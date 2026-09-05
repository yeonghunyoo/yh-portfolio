import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiRoutes } from "@generated/ApiRoutes";
import {
  ApiError,
  DEFAULT_API_BASE,
  HANDOFF_AGENT_PAGE,
  PAGE_SLUG_PATTERN,
  buildUrl,
  getPageViews,
  incrementPageViews,
  listPageViews,
} from "../src/lib/apiClient";

function mockFetch(response: Response) {
  const fetchMock = vi.fn(async () => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("buildUrl", () => {
  it("API-01 · builds GET /views from ApiRoutes.listPageViews", () => {
    expect(ApiRoutes.listPageViews.method).toBe("GET");
    expect(buildUrl(ApiRoutes.listPageViews)).toBe(`${DEFAULT_API_BASE}/views`);
  });

  it("API-02 · fills {page} of ApiRoutes.getPageViews", () => {
    expect(ApiRoutes.getPageViews.method).toBe("GET");
    expect(buildUrl(ApiRoutes.getPageViews, { page: HANDOFF_AGENT_PAGE })).toBe(
      `${DEFAULT_API_BASE}/views/${HANDOFF_AGENT_PAGE}`,
    );
  });

  it("API-03 · fills {page} of ApiRoutes.incrementPageViews", () => {
    expect(ApiRoutes.incrementPageViews.method).toBe("POST");
    expect(buildUrl(ApiRoutes.incrementPageViews, { page: "home" })).toBe(
      `${DEFAULT_API_BASE}/views/home`,
    );
  });

  it("percent-encodes the slug and refuses a missing parameter", () => {
    expect(buildUrl(ApiRoutes.getPageViews, { page: "a b" })).toContain("a%20b");
    expect(() => buildUrl(ApiRoutes.getPageViews)).toThrow(/missing path parameter "page"/);
  });

  it("keeps the contracted page slug legal", () => {
    expect(PAGE_SLUG_PATTERN.test(HANDOFF_AGENT_PAGE)).toBe(true);
    expect(PAGE_SLUG_PATTERN.test("Handoff_Agent")).toBe(false);
  });
});

describe("calls", () => {
  it("listPageViews reads the counter list", async () => {
    const fetchMock = mockFetch(json({ items: [{ page: HANDOFF_AGENT_PAGE, views: 128 }] }));

    await expect(listPageViews()).resolves.toEqual({
      items: [{ page: HANDOFF_AGENT_PAGE, views: 128 }],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      buildUrl(ApiRoutes.listPageViews),
      expect.objectContaining({ method: ApiRoutes.listPageViews.method }),
    );
  });

  it("getPageViews reads one counter", async () => {
    const fetchMock = mockFetch(json({ page: HANDOFF_AGENT_PAGE, views: 0 }));

    await expect(getPageViews(HANDOFF_AGENT_PAGE)).resolves.toEqual({
      page: HANDOFF_AGENT_PAGE,
      views: 0,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      buildUrl(ApiRoutes.getPageViews, { page: HANDOFF_AGENT_PAGE }),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("incrementPageViews posts and returns the new total", async () => {
    const fetchMock = mockFetch(json({ page: HANDOFF_AGENT_PAGE, views: 129 }));

    await expect(incrementPageViews(HANDOFF_AGENT_PAGE, { keepalive: true })).resolves.toEqual({
      page: HANDOFF_AGENT_PAGE,
      views: 129,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      buildUrl(ApiRoutes.incrementPageViews, { page: HANDOFF_AGENT_PAGE }),
      expect.objectContaining({ method: "POST", keepalive: true }),
    );
  });

  it("turns a contract error body into an ApiError", async () => {
    mockFetch(json({ code: "store_unavailable", message: "views store unavailable" }, 503));

    await expect(getPageViews(HANDOFF_AGENT_PAGE)).rejects.toMatchObject({
      name: "ApiError",
      status: 503,
      code: "store_unavailable",
    });
  });

  it("survives an error body that is not JSON", async () => {
    mockFetch(new Response("nope", { status: 429 }));

    const error = await incrementPageViews("home").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe("unknown");
  });
});
