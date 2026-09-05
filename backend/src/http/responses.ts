import { invalidPageMessage, unknownPageMessage } from "../domain/slug.ts";
import { ErrorCodes, type ApiError, type PageViews, type PageViewsList } from "../domain/types.ts";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" } as const;

export function json(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  for (const [key, value] of Object.entries(JSON_HEADERS)) headers.set(key, value);
  return new Response(JSON.stringify(body), { ...init, headers });
}

/** Counters are public aggregates but must never be cached as a page fragment. */
export function noStore(response: Response): Response {
  response.headers.set("cache-control", "no-store");
  return response;
}

export const ok = {
  pageViews: (value: PageViews): Response => noStore(json(value, { status: 200 })),
  pageViewsList: (items: PageViews[]): Response =>
    noStore(json({ items } satisfies PageViewsList, { status: 200 })),
};

export const fail = {
  /** 400 — components.responses.BadRequest */
  invalidPage: (): Response =>
    noStore(
      json({ code: ErrorCodes.invalidPage, message: invalidPageMessage() } satisfies ApiError, {
        status: 400,
      }),
    ),
  /** 400 — well-formed slug, but not a page of this site (writes only). */
  unknownPage: (): Response =>
    noStore(
      json({ code: ErrorCodes.invalidPage, message: unknownPageMessage() } satisfies ApiError, {
        status: 400,
      }),
    ),
  /** 429 — repeated increments from one client in a short window */
  rateLimited: (retryAfterSeconds: number): Response =>
    noStore(
      json(
        {
          code: ErrorCodes.rateLimited,
          message: `too many increments; retry in ${retryAfterSeconds}s`,
        } satisfies ApiError,
        { status: 429, headers: { "retry-after": String(retryAfterSeconds) } },
      ),
    ),
  /** 503 — components.responses.StoreUnavailable */
  storeUnavailable: (): Response =>
    noStore(
      json({ code: ErrorCodes.storeUnavailable, message: "views store unavailable" } satisfies ApiError, {
        status: 503,
      }),
    ),
  /** Outside the contract surface — the router answers unknown paths/methods. */
  notFound: (): Response => noStore(json({ code: ErrorCodes.invalidPage, message: "not found" }, { status: 404 })),
  methodNotAllowed: (allow: string[]): Response =>
    noStore(
      json(
        { code: ErrorCodes.invalidPage, message: "method not allowed" },
        { status: 405, headers: { allow: allow.join(", ") } },
      ),
    ),
};
