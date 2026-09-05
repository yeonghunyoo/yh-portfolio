import { beforeEach, describe, expect, it } from "vitest";
import { ApiRoutes } from "../../shared/generated/ApiRoutes.ts";
import { KnownPages } from "../src/domain/slug.ts";
import { ErrorCodes, type ApiError, type PageViews, type PageViewsList } from "../src/domain/types.ts";
import { RATE_LIMIT_WINDOW_SECONDS } from "../src/http/rateLimit.ts";
import { MemoryViewsStore } from "../src/store/memory.ts";
import { bodyOf, call } from "./helpers.ts";

let store: MemoryViewsStore;
/** Distinct client per call so the rate limiter does not interfere with counter assertions. */
let seq = 0;
const freshClient = () => ({ "x-forwarded-for": `10.0.0.${(seq += 1) % 250}` });

beforeEach(() => {
  store = new MemoryViewsStore();
  seq = 0;
});

describe("API-01 GET /views — ApiRoutes.listPageViews", () => {
  it("uses the contracted method and path", () => {
    expect(ApiRoutes.listPageViews).toEqual({ method: "GET", path: "/views" });
  });

  it("returns an empty items array when nothing has been viewed", async () => {
    const response = await call(ApiRoutes.listPageViews, store);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(bodyOf<PageViewsList>(response)).resolves.toEqual({ items: [] });
  });

  it("lists every known page with its current count", async () => {
    store.seed(KnownPages.home, 3);
    store.seed(KnownPages.handoffAgent, 128);
    const body = await bodyOf<PageViewsList>(await call(ApiRoutes.listPageViews, store));
    expect(body.items).toHaveLength(2);
    expect(body.items).toEqual(
      expect.arrayContaining([
        { page: KnownPages.home, views: 3 },
        { page: KnownPages.handoffAgent, views: 128 },
      ]),
    );
  });

  it("answers 503 store_unavailable when the store is not configured", async () => {
    const response = await call(ApiRoutes.listPageViews, null);
    expect(response.status).toBe(503);
    await expect(bodyOf<ApiError>(response)).resolves.toEqual({
      code: ErrorCodes.storeUnavailable,
      message: "views store unavailable",
    });
  });
});

describe("API-02 GET /views/{page} — ApiRoutes.getPageViews", () => {
  it("uses the contracted method and path template", () => {
    expect(ApiRoutes.getPageViews).toEqual({ method: "GET", path: "/views/{page}" });
  });

  it("returns 0 for a page that was never viewed (never 404)", async () => {
    const response = await call(ApiRoutes.getPageViews, store, { params: { page: KnownPages.home } });
    expect(response.status).toBe(200);
    await expect(bodyOf<PageViews>(response)).resolves.toEqual({ page: KnownPages.home, views: 0 });
  });

  it("returns the stored count for the handoff-agent case study page", async () => {
    store.seed(KnownPages.handoffAgent, 42);
    const body = await bodyOf<PageViews>(
      await call(ApiRoutes.getPageViews, store, { params: { page: KnownPages.handoffAgent } }),
    );
    expect(body).toEqual({ page: KnownPages.handoffAgent, views: 42 });
  });

  it.each([
    ["uppercase", "Home"],
    ["leading hyphen", "-home"],
    ["trailing hyphen", "home-"],
    ["underscore", "handoff_agent"],
    ["too long", "a".repeat(65)],
  ])("rejects an invalid slug (%s) with 400 invalid_page", async (_label, slug) => {
    const response = await call(ApiRoutes.getPageViews, store, { params: { page: slug } });
    expect(response.status).toBe(400);
    const body = await bodyOf<ApiError>(response);
    expect(body.code).toBe(ErrorCodes.invalidPage);
    expect(body.message).toContain("page must match");
  });

  it("answers 503 when the store is not configured", async () => {
    const response = await call(ApiRoutes.getPageViews, null, { params: { page: KnownPages.home } });
    expect(response.status).toBe(503);
  });
});

describe("API-03 POST /views/{page} — ApiRoutes.incrementPageViews", () => {
  it("uses the contracted method and path template", () => {
    expect(ApiRoutes.incrementPageViews).toEqual({ method: "POST", path: "/views/{page}" });
  });

  it("increments by 1 and returns the new value", async () => {
    const first = await bodyOf<PageViews>(
      await call(ApiRoutes.incrementPageViews, store, {
        params: { page: KnownPages.handoffAgent },
        headers: freshClient(),
      }),
    );
    expect(first).toEqual({ page: KnownPages.handoffAgent, views: 1 });

    const second = await bodyOf<PageViews>(
      await call(ApiRoutes.incrementPageViews, store, {
        params: { page: KnownPages.handoffAgent },
        headers: freshClient(),
      }),
    );
    expect(second).toEqual({ page: KnownPages.handoffAgent, views: 2 });
  });

  it("is visible to a subsequent read of the same page", async () => {
    await call(ApiRoutes.incrementPageViews, store, {
      params: { page: KnownPages.home },
      headers: freshClient(),
    });
    const read = await bodyOf<PageViews>(
      await call(ApiRoutes.getPageViews, store, { params: { page: KnownPages.home } }),
    );
    expect(read.views).toBe(1);
  });

  it("counts pages independently", async () => {
    await call(ApiRoutes.incrementPageViews, store, {
      params: { page: KnownPages.home },
      headers: freshClient(),
    });
    const other = await bodyOf<PageViews>(
      await call(ApiRoutes.getPageViews, store, { params: { page: KnownPages.handoffAgent } }),
    );
    expect(other.views).toBe(0);
  });

  it("rejects an invalid slug with 400 before touching the store", async () => {
    const response = await call(ApiRoutes.incrementPageViews, store, {
      params: { page: "NOT A SLUG" },
      headers: freshClient(),
    });
    expect(response.status).toBe(400);
    await expect(store.read("NOT A SLUG")).resolves.toBe(0);
  });

  it("answers 429 with Retry-After when one client repeats inside the window", async () => {
    const client = { "x-forwarded-for": "203.0.113.9" };
    const first = await call(ApiRoutes.incrementPageViews, store, {
      params: { page: KnownPages.handoffAgent },
      headers: client,
    });
    expect(first.status).toBe(200);

    const second = await call(ApiRoutes.incrementPageViews, store, {
      params: { page: KnownPages.handoffAgent },
      headers: client,
    });
    expect(second.status).toBe(429);
    expect(second.headers.get("retry-after")).toBe(String(RATE_LIMIT_WINDOW_SECONDS));
    await expect(bodyOf<ApiError>(second)).resolves.toMatchObject({ code: ErrorCodes.rateLimited });
    // The rejected call must not have counted.
    await expect(store.read(KnownPages.handoffAgent)).resolves.toBe(1);
  });

  it("rate limits per page, not globally", async () => {
    const client = { "x-forwarded-for": "203.0.113.9" };
    await call(ApiRoutes.incrementPageViews, store, { params: { page: KnownPages.handoffAgent }, headers: client });
    const other = await call(ApiRoutes.incrementPageViews, store, {
      params: { page: KnownPages.home },
      headers: client,
    });
    expect(other.status).toBe(200);
  });

  it("answers 503 when the store is not configured", async () => {
    const response = await call(ApiRoutes.incrementPageViews, null, {
      params: { page: KnownPages.home },
      headers: freshClient(),
    });
    expect(response.status).toBe(503);
  });
});

describe("routing edges", () => {
  it("405s a POST to the collection route with an Allow header", async () => {
    const response = await call({ method: "POST", path: ApiRoutes.listPageViews.path }, store);
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET");
  });

  it("405s a DELETE on the item route listing both contracted methods", async () => {
    const response = await call({ method: "DELETE", path: ApiRoutes.getPageViews.path }, store, {
      params: { page: KnownPages.home },
    });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, POST");
  });

  it("404s a path outside the contract", async () => {
    const response = await call(ApiRoutes.listPageViews, store, { rawPath: "/api/contact" });
    expect(response.status).toBe(404);
  });

  it("marks every response no-store so counters are never cached", async () => {
    const response = await call(ApiRoutes.getPageViews, store, { params: { page: KnownPages.home } });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
