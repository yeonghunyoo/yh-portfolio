/**
 * API-01 · `GET /api/views` — `ApiRoutes.listPageViews`.
 *
 * The handler itself lives in the backend package (`@yh/backend/astro/views-index`);
 * this file only mounts it on the route Astro derives from its own path, so the site
 * and its API deploy as one app. See astro.config.mjs for how `@yh/backend` resolves.
 */
export { GET } from "@yh/backend/astro/views-index";
/**
 * Astro decides prerendering by *static analysis* of this file, so the flag has to be a
 * literal here — a re-exported `prerender` is invisible to it and the build fails with
 * GetStaticPathsRequired. The backend module declares the same value.
 */
export const prerender = false;

