import { ApiRoutes } from "../../../shared/generated/ApiRoutes.ts";
import { isKnownPageSlug, isValidPageSlug } from "../domain/slug.ts";
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

/**
 * GET /views — ApiRoutes.listPageViews.
 *
 * The contract says this returns "every *known* page slug with its current count", so
 * anything else the store happens to hold is filtered out rather than served as site
 * content. Writes are already restricted to known pages; this is the second half of
 * that guarantee, and it also keeps a store polluted before the restriction landed
 * from showing attacker-chosen text in a public response.
 */
export function listPageViews(context: HandlerContext): Promise<Response> {
  return withStore(context, async (store) => {
    const all = await store.readAll();
    return ok.pageViewsList(all.filter((entry) => isKnownPageSlug(entry.page)));
  });
}

/** GET /views/{page} — ApiRoutes.getPageViews. Returns 0 for an unseen page, never 404. */
export function getPageViews(context: HandlerContext, page: string): Promise<Response> {
  if (!isValidPageSlug(page)) return Promise.resolve(fail.invalidPage());
  return withStore(context, async (store) => ok.pageViews({ page, views: await store.read(page) }));
}

/**
 * POST /views/{page} — ApiRoutes.incrementPageViews. Atomic +1, returns the new value.
 *
 * Only this site's own pages can be incremented. The store indexes every slug it
 * increments, so accepting any well-formed slug would let a caller create unlimited
 * counters and choose the text that shows up in the public list.
 */
export function incrementPageViews(context: HandlerContext, page: string): Promise<Response> {
  if (!isValidPageSlug(page)) return Promise.resolve(fail.invalidPage());
  if (!isKnownPageSlug(page)) return Promise.resolve(fail.unknownPage());
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
