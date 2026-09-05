import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiRoutes } from "@generated/ApiRoutes";
import { Screens } from "@generated/Screens";
import {
  API_BASE,
  ApiError,
  DEFAULT_API_BASE,
  PAGE_SLUG_PATTERN,
  buildUrl,
  getPageViews,
  incrementPageViews,
  listPageViews,
  pageSlug,
} from "../src/lib/apiClient";
import { countVisit } from "../src/lib/pageViews";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("page slugs", () => {
  it("derives one slug per contracted screen, as api/openapi.yaml documents", () => {
    expect(pageSlug(Screens.resume)).toBe("resume");
    expect(pageSlug(Screens.forest)).toBe("forest");
    expect(pageSlug(Screens.handoffAgent)).toBe("handoff-agent");
  });

  it("keeps every slug inside the contract's PageSlug pattern", () => {
    for (const screen of Object.values(Screens)) {
      expect(pageSlug(screen)).toMatch(PAGE_SLUG_PATTERN);
    }
  });
});

describe("buildUrl", () => {
  it("defaults to the servers[0].url of the contract", () => {
    expect(API_BASE).toBe(DEFAULT_API_BASE);
    expect(DEFAULT_API_BASE).toBe("/api");
  });

  it("fills the {page} parameter of the generated route", () => {
    expect(buildUrl(ApiRoutes.getPageViews, { page: pageSlug(Screens.forest) })).toBe("/api/views/forest");
  });

  it("refuses a route whose parameter was not supplied", () => {
    expect(() => buildUrl(ApiRoutes.incrementPageViews)).toThrow(/missing path parameter "page"/);
  });
});

describe("calls", () => {
  it("API-01 listPageViews uses the generated method and path", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ items: [{ page: "resume", views: 3 }] }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(listPageViews()).resolves.toEqual({ items: [{ page: "resume", views: 3 }] });
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}${ApiRoutes.listPageViews.path}`,
      expect.objectContaining({ method: ApiRoutes.listPageViews.method }),
    );
  });

  it("API-02 getPageViews reads one counter", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ page: "forest", views: 0 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getPageViews(pageSlug(Screens.forest))).resolves.toEqual({ page: "forest", views: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/views/forest",
      expect.objectContaining({ method: ApiRoutes.getPageViews.method }),
    );
  });

  it("API-03 incrementPageViews posts to the same path", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ page: "handoff-agent", views: 9 }));
    vi.stubGlobal("fetch", fetchMock);

    await incrementPageViews(pageSlug(Screens.handoffAgent));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/views/handoff-agent",
      expect.objectContaining({ method: ApiRoutes.incrementPageViews.method }),
    );
    expect(ApiRoutes.incrementPageViews.method).toBe("POST");
  });

  it("declares content-type on writes, so Vercel does not answer 403", async () => {
    // Regression: a bodyless POST carries no content-type from the browser, and Vercel
    // rejects it with "Cross-site POST form submissions are forbidden" — every visit
    // was silently dropped in production while GET kept working.
    const fetchMock = vi.fn(async () => jsonResponse({ page: "resume", views: 1 }));
    vi.stubGlobal("fetch", fetchMock);

    await incrementPageViews("resume");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/views/resume",
      expect.objectContaining({
        headers: { accept: "application/json", "content-type": "application/json" },
      }),
    );
  });

  it("leaves reads without a content-type", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ page: "resume", views: 1 }));
    vi.stubGlobal("fetch", fetchMock);

    await getPageViews("resume");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/views/resume",
      expect.objectContaining({ headers: { accept: "application/json" } }),
    );
  });

  it("turns a contract error body into an ApiError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ code: "invalid_page", message: "bad slug" }, 400)),
    );

    await expect(getPageViews("NOPE")).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      code: "invalid_page",
    });
    expect(new ApiError(503, "store_unavailable", "down")).toBeInstanceOf(Error);
  });
});

describe("countVisit", () => {
  it("counts the visit of a screen and never rejects when the API is down", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("offline");
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(() => countVisit(Screens.resume)).not.toThrow();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledWith("/api/views/resume", expect.objectContaining({ keepalive: true }));
  });
});
