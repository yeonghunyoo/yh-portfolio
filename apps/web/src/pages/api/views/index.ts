/**
 * API-01 · `GET /api/views` — `ApiRoutes.listPageViews`.
 *
 * The handler itself lives in the backend package (`@yh/backend/astro/views-index`);
 * this file only mounts it on the route Astro derives from its own path, so the site
 * and its API deploy as one app. See astro.config.mjs for how `@yh/backend` resolves.
 */
export { GET, prerender } from "@yh/backend/astro/views-index";
