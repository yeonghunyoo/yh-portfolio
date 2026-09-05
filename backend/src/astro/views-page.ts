import { getPageViews, incrementPageViews } from "../http/handlers.ts";
import { getViewsStore } from "../store/factory.ts";
import { runtimeEnv } from "./env.ts";
import type { AstroApiRoute } from "./types.ts";

/** Server-rendered, never prerendered — INCR must run per request. */
export const prerender = false;

/** GET /api/views/{page} — ApiRoutes.getPageViews. Mount at `src/pages/api/views/[page].ts`. */
export const GET: AstroApiRoute = ({ request, params, locals }) =>
  getPageViews({ store: getViewsStore(runtimeEnv(locals)), request }, params.page ?? "");

/** POST /api/views/{page} — ApiRoutes.incrementPageViews. Same file as the GET above. */
export const POST: AstroApiRoute = ({ request, params, locals }) =>
  incrementPageViews({ store: getViewsStore(runtimeEnv(locals)), request }, params.page ?? "");
