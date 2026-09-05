import { listPageViews } from "../http/handlers.ts";
import { getViewsStore } from "../store/factory.ts";
import { runtimeEnv } from "./env.ts";
import type { AstroApiRoute } from "./types.ts";

/** Server-rendered, never prerendered — the counter must be read per request. */
export const prerender = false;

/** GET /api/views — ApiRoutes.listPageViews. Mount at `src/pages/api/views/index.ts`. */
export const GET: AstroApiRoute = ({ request, locals }) =>
  listPageViews({ store: getViewsStore(runtimeEnv(locals)), request });
