import { beforeEach, describe, expect, it } from "vitest";
import { ApiRoutes } from "../../shared/generated/ApiRoutes.ts";
import { ScreenPaths, Screens } from "../../shared/generated/Screens.ts";
import * as viewsIndex from "../src/astro/views-index.ts";
import * as viewsPage from "../src/astro/views-page.ts";
import { KnownPages } from "../src/domain/slug.ts";
import type { PageViews, PageViewsList } from "../src/domain/types.ts";
import { EnvKeys, createViewsStore, getViewsStore, resetViewsStoreCache } from "../src/store/factory.ts";
import { MemoryViewsStore } from "../src/store/memory.ts";
import { apiPath } from "../src/http/router.ts";
import type { AstroApiContext } from "../src/astro/types.ts";

const ORIGIN = "https://yh-portfolio.test";

function context(
  route: { method: string; path: string },
  params: Record<string, string>,
  env: Record<string, string | undefined>,
  headers: Record<string, string> = {},
): AstroApiContext {
  return {
    request: new Request(new URL(apiPath(route, params), ORIGIN), { method: route.method, headers }),
    params,
    locals: { runtime: { env } },
  };
}

const memoryEnv = { [EnvKeys.storeDriver]: "memory" };

beforeEach(() => {
  resetViewsStoreCache();
});

describe("Astro endpoint adapters", () => {
  it("are server-rendered, never prerendered", () => {
    expect(viewsIndex.prerender).toBe(false);
    expect(viewsPage.prerender).toBe(false);
  });

  it("expose exactly the verbs the contract defines", () => {
    expect(typeof viewsIndex.GET).toBe("function");
    expect(typeof viewsPage.GET).toBe("function");
    expect(typeof viewsPage.POST).toBe("function");
    expect("POST" in viewsIndex).toBe(false);
  });

  it("GET /api/views serves ApiRoutes.listPageViews", async () => {
    const response = await viewsIndex.GET(context(ApiRoutes.listPageViews, {}, memoryEnv));
    expect(response.status).toBe(200);
    const body = (await response.json()) as PageViewsList;
    expect(Array.isArray(body.items)).toBe(true);
  });

  it("POST then GET /api/views/{page} share one counter", async () => {
    const params = { page: KnownPages.handoffAgent };
    const posted = (await (
      await viewsPage.POST(
        context(ApiRoutes.incrementPageViews, params, memoryEnv, { "x-forwarded-for": "192.0.2.1" }),
      )
    ).json()) as PageViews;
    expect(posted.page).toBe(KnownPages.handoffAgent);
    expect(posted.views).toBeGreaterThanOrEqual(1);

    const read = (await (await viewsPage.GET(context(ApiRoutes.getPageViews, params, memoryEnv))).json()) as PageViews;
    expect(read.views).toBe(posted.views);
  });

  it("answers 503 when neither VIEWS_STORE_URL nor VIEWS_STORE_TOKEN is set", async () => {
    const response = await viewsIndex.GET(context(ApiRoutes.listPageViews, {}, {}));
    expect(response.status).toBe(503);
  });

  it("rejects an invalid slug with 400", async () => {
    const response = await viewsPage.GET(context(ApiRoutes.getPageViews, { page: "Bad_Slug" }, memoryEnv));
    expect(response.status).toBe(400);
  });
});

describe("store factory reads the approved env vars", () => {
  it("needs both VIEWS_STORE_URL and VIEWS_STORE_TOKEN", () => {
    expect(createViewsStore({})).toBeNull();
    expect(createViewsStore({ [EnvKeys.storeUrl]: "https://x.upstash.io" })).toBeNull();
    expect(createViewsStore({ [EnvKeys.storeToken]: "placeholder" })).toBeNull();
    expect(
      createViewsStore({ [EnvKeys.storeUrl]: "https://x.upstash.io", [EnvKeys.storeToken]: "placeholder" }),
    ).not.toBeNull();
  });

  it("only uses in-process counters when explicitly asked", () => {
    expect(createViewsStore(memoryEnv)).toBeInstanceOf(MemoryViewsStore);
    expect(
      createViewsStore({ [EnvKeys.storeUrl]: "https://x.upstash.io", [EnvKeys.storeToken]: "placeholder" }),
    ).not.toBeInstanceOf(MemoryViewsStore);
  });

  it("returns the same instance for equivalent env records built per request", () => {
    // Regression: adapters rebuild the env object every request; caching on object
    // identity handed out a fresh store each time and dropped in-process counters.
    const first = getViewsStore({ ...memoryEnv });
    const second = getViewsStore({ ...memoryEnv });
    expect(second).toBe(first);
  });

  it("names exactly the env vars the human approved", () => {
    expect([EnvKeys.storeUrl, EnvKeys.storeToken]).toEqual(["VIEWS_STORE_URL", "VIEWS_STORE_TOKEN"]);
  });
});

describe("page slugs cover the designed screens", () => {
  it("every screen in the design maps to a countable page slug", () => {
    // s0–s5 are sections of one document served at "/" (ScreenPaths), counted as `handoff-agent`.
    const paths = new Set(Object.values(Screens).map((id) => ScreenPaths[id]));
    expect([...paths]).toEqual(["/"]);
    expect(KnownPages.handoffAgent).toBe("handoff-agent");
  });
});
