/**
 * API-02 · `GET /api/views/{page}` — `ApiRoutes.getPageViews`
 * API-03 · `POST /api/views/{page}` — `ApiRoutes.incrementPageViews`
 *
 * `{page}` is the kebab-cased screen id (`resume`, `forest`, `handoff-agent`); the
 * backend validates it against the `PageSlug` pattern from api/openapi.yaml.
 * The handlers live in `@yh/backend/astro/views-page`; this file only mounts them.
 */
export { GET, POST } from "@yh/backend/astro/views-page";
/**
 * Astro decides prerendering by *static analysis* of this file, so the flag has to be a
 * literal here — a re-exported `prerender` is invisible to it and the build fails with
 * GetStaticPathsRequired. The backend module declares the same value.
 */
export const prerender = false;

