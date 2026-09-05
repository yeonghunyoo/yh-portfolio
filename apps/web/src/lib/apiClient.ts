import { ApiRoutes, type Route } from "@generated/ApiRoutes";
import { type ScreenId } from "@generated/Screens";

/**
 * One client for the whole app. Every call goes through an `ApiRoutes.*` entry —
 * no method or path is ever written out by hand.
 *
 * The base URL is `servers[0].url` from api/openapi.yaml ("/api", same origin as
 * the site — the Astro endpoints). `PUBLIC_API_BASE_URL` overrides it when the API
 * is served from somewhere else. It is public by definition: it ships to the browser
 * and must never hold a credential.
 */
export const DEFAULT_API_BASE = "/api";

export const API_BASE: string =
  (import.meta.env.PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "") || DEFAULT_API_BASE;

/** `PageSlug` from api/openapi.yaml. */
export const PAGE_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

/**
 * Page slug of a screen. api/openapi.yaml: "Page keys are slugs, one per screen in
 * design/handoff.manifest.json: `resume`, `forest` and `handoff-agent`" — the
 * kebab-case of the `Screens.*` id, derived rather than written out.
 */
export function pageSlug(screen: ScreenId): string {
  return screen.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export interface PageViews {
  readonly page: string;
  readonly views: number;
}

export interface PageViewsList {
  readonly items: readonly PageViews[];
}

export type ApiErrorCode = "invalid_page" | "rate_limited" | "store_unavailable";

export interface ApiErrorBody {
  readonly code: ApiErrorCode;
  readonly message: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode | "unknown",
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Fill `{param}` placeholders of a generated route path and prefix the base URL. */
export function buildUrl(
  route: Route,
  params: Readonly<Record<string, string>> = {},
  base: string = API_BASE,
): string {
  const path = route.path.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`missing path parameter "${name}" for ${route.path}`);
    return encodeURIComponent(value);
  });
  return `${base}${path}`;
}

/**
 * Vercel rejects a POST that carries no `content-type` with
 * "Cross-site POST form submissions are forbidden" (403), and a browser sets no
 * content-type on a bodyless `fetch` POST — so `POST /views/{page}` was answering 403
 * in production while every GET worked. Declaring the type on writes is enough; it is
 * same-origin, so it triggers no preflight.
 */
function defaultHeaders(route: Route): Record<string, string> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (route.method !== "GET" && route.method !== "HEAD") {
    headers["content-type"] = "application/json";
  }
  return headers;
}

async function call<T>(
  route: Route,
  params: Readonly<Record<string, string>> = {},
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(buildUrl(route, params), {
    ...init,
    method: route.method,
    headers: { ...defaultHeaders(route), ...init.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body?.code ?? "unknown", body?.message ?? response.statusText);
  }

  return (await response.json()) as T;
}

/** API-01 · `GET /views` — every known page slug with its current count. */
export function listPageViews(): Promise<PageViewsList> {
  return call<PageViewsList>(ApiRoutes.listPageViews);
}

/** API-02 · `GET /views/{page}` — current count of one page (0 when never viewed). */
export function getPageViews(page: string): Promise<PageViews> {
  return call<PageViews>(ApiRoutes.getPageViews, { page });
}

/** API-03 · `POST /views/{page}` — count this visit and return the new total. */
export function incrementPageViews(page: string, init: RequestInit = {}): Promise<PageViews> {
  return call<PageViews>(ApiRoutes.incrementPageViews, { page }, init);
}
