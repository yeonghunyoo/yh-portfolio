import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ApiRoutes, type Route } from "@generated/ApiRoutes";
import { DEFAULT_API_BASE } from "../src/lib/apiClient";

/**
 * The API routes of api/openapi.yaml are served by this app: Astro derives a URL from
 * each file's path under src/pages, so the file layout *is* the route table. These
 * tests check that the layout matches `ApiRoutes.*` — a renamed route or a moved file
 * fails here rather than 404-ing in production.
 */

const app = (relative: string): string => fileURLToPath(new URL(relative, import.meta.url));

/** Astro's file route for an `ApiRoutes.*` path: `/views/{page}` → `api/views/[page].ts`. */
function pageFile(route: Route): string {
  const segments = `${DEFAULT_API_BASE}${route.path}`
    .replace(/^\//, "")
    .split("/")
    .map((segment) => segment.replace(/^\{(\w+)\}$/, "[$1]"));
  const last = segments[segments.length - 1] ?? "";
  if (last.startsWith("[")) return `${segments.join("/")}.ts`;
  return `${segments.join("/")}/index.ts`;
}

const sourceOf = (route: Route): string => {
  const file = app(`../src/pages/${pageFile(route)}`);
  expect(existsSync(file), `missing endpoint file for ${route.method} ${route.path}`).toBe(true);
  return readFileSync(file, "utf8");
};

describe("views API endpoints", () => {
  it("API-01 — GET /views is mounted where ApiRoutes.listPageViews points", () => {
    expect(pageFile(ApiRoutes.listPageViews)).toBe("api/views/index.ts");
    const source = sourceOf(ApiRoutes.listPageViews);
    expect(source).toMatch(/export \{[^}]*\bGET\b[^}]*\}/);
    expect(source).toContain("prerender");
    expect(source).toContain("@yh/backend/astro/views-index");
  });

  it("API-02/03 — GET and POST /views/{page} share one dynamic route file", () => {
    expect(pageFile(ApiRoutes.getPageViews)).toBe("api/views/[page].ts");
    expect(pageFile(ApiRoutes.incrementPageViews)).toBe("api/views/[page].ts");
    const source = sourceOf(ApiRoutes.getPageViews);
    expect(source).toMatch(/export \{[^}]*\bGET\b[^}]*\}/);
    expect(source).toMatch(/export \{[^}]*\bPOST\b[^}]*\}/);
    expect(source).toContain("prerender");
    expect(source).toContain("@yh/backend/astro/views-page");
  });

  it("serves the API on the base URL the client uses", () => {
    expect(DEFAULT_API_BASE).toBe("/api");
    for (const route of Object.values(ApiRoutes)) {
      expect(pageFile(route).startsWith("api/")).toBe(true);
    }
  });
});

describe("stand-in endpoints (used only when the backend package is not checked out)", () => {
  it("answer the contract's 503 store_unavailable and never invent a count", async () => {
    const index = await import("../src/lib/backend-unmounted/astro/views-index");
    const page = await import("../src/lib/backend-unmounted/astro/views-page");
    expect(index.prerender).toBe(false);
    expect(page.prerender).toBe(false);

    for (const handler of [index.GET, page.GET, page.POST]) {
      const response = await handler();
      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({
        code: "store_unavailable",
        message: "views store unavailable",
      });
    }
  });
});
