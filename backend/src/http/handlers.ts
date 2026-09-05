import { ApiRoutes } from "../../../shared/generated/ApiRoutes.ts";
import { isValidPageSlug } from "../domain/slug.ts";
import { StoreUnavailableError, type ViewsStore } from "../store/port.ts";
import { allowIncrement, clientId } from "./rateLimit.ts";
import { fail, ok } from "./responses.ts";

/** Everything a handler needs. The store is resolved once per request by the adapter. */
export interface HandlerContext {
  store: ViewsStore | null;
  request: Request;
}

async function withStore(
  context: HandlerContext,
  run: (store: ViewsStore) => Promise<Response>,
): Promise<Response> {
  if (!context.store) return fail.storeUnavailable();
  try {
    return await run(context.store);
  } catch (error) {
    if (error instanceof StoreUnavailableError) return fail.storeUnavailable();
    throw error;
  }
}

/** GET /views — ApiRoutes.listPageViews */
export function listPageViews(context: HandlerContext): Promise<Response> {
  return withStore(context, async (store) => ok.pageViewsList(await store.readAll()));
}

/** GET /views/{page} — ApiRoutes.getPageViews. Returns 0 for an unseen page, never 404. */
export function getPageViews(context: HandlerContext, page: string): Promise<Response> {
  if (!isValidPageSlug(page)) return Promise.resolve(fail.invalidPage());
  return withStore(context, async (store) => ok.pageViews({ page, views: await store.read(page) }));
}

/** POST /views/{page} — ApiRoutes.incrementPageViews. Atomic +1, returns the new value. */
export function incrementPageViews(context: HandlerContext, page: string): Promise<Response> {
  if (!isValidPageSlug(page)) return Promise.resolve(fail.invalidPage());
  return withStore(context, async (store) => {
    const verdict = await allowIncrement(store, page, clientId(context.request));
    if (!verdict.allowed) return fail.rateLimited(verdict.retryAfterSeconds);
    return ok.pageViews({ page, views: await store.increment(page) });
  });
}

/**
 * Contract operation → handler. Keyed by the generated ApiRoutes entries so a route
 * that disappears from api/openapi.yaml breaks the build instead of drifting silently.
 */
export const operationHandlers = {
  listPageViews: { route: ApiRoutes.listPageViews, handle: listPageViews },
  getPageViews: { route: ApiRoutes.getPageViews, handle: getPageViews },
  incrementPageViews: { route: ApiRoutes.incrementPageViews, handle: incrementPageViews },
} as const;

export type OperationId = keyof typeof operationHandlers;
