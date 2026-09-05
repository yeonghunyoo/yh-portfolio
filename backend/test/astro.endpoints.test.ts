import { beforeEach, describe, expect, it } from "vitest";
import { ApiRoutes } from "../../shared/generated/ApiRoutes.ts";
import { ScreenPaths, Screens } from "../../shared/generated/Screens.ts";
import * as viewsIndex from "../src/astro/views-index.ts";
import * as viewsPage from "../src/astro/views-page.ts";
import { KnownPages, isValidPageSlug, knownPageSlugs, pageSlugForScreen } from "../src/domain/slug.ts";
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
  it("derives one slug per generated screen id", () => {
    expect(Object.keys(KnownPages).sort()).toEqual(Object.keys(Screens).sort());
  });

  it("spells the slugs exactly as api/openapi.yaml documents them", () => {
    expect(pageSlugForScreen(Screens.resume)).toBe("resume");
    expect(pageSlugForScreen(Screens.forest)).toBe("forest");
    expect(pageSlugForScreen(Screens.handoffAgent)).toBe("handoff-agent");
  });

  it("keeps every derived slug inside the contracted pattern", () => {
    expect(knownPageSlugs).toHaveLength(Object.keys(Screens).length);
    for (const slug of knownPageSlugs) expect(isValidPageSlug(slug)).toBe(true);
  });

  it("counts each screen path independently", async () => {
    const counted: Record<string, number> = {};
    let client = 0;
    for (const id of Object.values(Screens)) {
      const page = pageSlugForScreen(id);
      const response = await viewsPage.POST(
        context(ApiRoutes.incrementPageViews, { page }, memoryEnv, {
          "x-forwarded-for": `198.51.100.${(client += 1)}`,
        }),
      );
      expect(response.status).toBe(200);
      const body = (await response.json()) as PageViews;
      expect(ScreenPaths[id]).toBeTypeOf("string");
      counted[body.page] = body.views;
    }
    // Every screen got its own counter at 1 — no screen shares another's slug.
    expect(Object.values(counted)).toEqual(Object.values(Screens).map(() => 1));
    expect(Object.keys(counted).sort()).toEqual([...knownPageSlugs].sort());
  });
});
