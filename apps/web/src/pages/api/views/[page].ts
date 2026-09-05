/**
 * API-02 · `GET /api/views/{page}` — `ApiRoutes.getPageViews`
 * API-03 · `POST /api/views/{page}` — `ApiRoutes.incrementPageViews`
 *
 * `{page}` is the kebab-cased screen id (`resume`, `forest`, `handoff-agent`); the
 * backend validates it against the `PageSlug` pattern from api/openapi.yaml.
 * The handlers live in `@yh/backend/astro/views-page`; this file only mounts them.
 */
export { GET, POST, prerender } from "@yh/backend/astro/views-page";
