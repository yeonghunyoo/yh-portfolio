import { ApiRoutes, type Route } from "../../../shared/generated/ApiRoutes.ts";
import type { ViewsStore } from "../store/port.ts";
import { operationHandlers, type HandlerContext, type OperationId } from "./handlers.ts";
import { fail } from "./responses.ts";

/** api/openapi.yaml → servers[0].url. Endpoints are same-origin under this prefix. */
export const API_BASE_PATH = "/api";

type Segment = { kind: "literal"; value: string } | { kind: "param"; name: string };

function compile(route: Route): Segment[] {
  return route.path
    .split("/")
    .filter(Boolean)
    .map((raw) =>
      raw.startsWith("{") && raw.endsWith("}")
        ? ({ kind: "param", name: raw.slice(1, -1) } as const)
        : ({ kind: "literal", value: raw } as const),
    );
}

interface CompiledRoute {
  operationId: OperationId;
  method: string;
  segments: Segment[];
  handle: (context: HandlerContext, ...params: string[]) => Promise<Response>;
}

/** Built from the generated constants — one entry per contracted operation. */
export const compiledRoutes: CompiledRoute[] = (
  Object.entries(operationHandlers) as [OperationId, (typeof operationHandlers)[OperationId]][]
).map(([operationId, entry]) => ({
  operationId,
  method: entry.route.method.toUpperCase(),
  segments: compile(entry.route),
  handle: entry.handle as CompiledRoute["handle"],
}));

function stripBase(pathname: string): string[] {
  const parts = pathname.split("/").filter(Boolean);
  const base = API_BASE_PATH.split("/").filter(Boolean);
  return parts.length >= base.length && base.every((segment, i) => parts[i] === segment)
    ? parts.slice(base.length)
    : parts;
}

function matchSegments(segments: Segment[], parts: string[]): string[] | null {
  if (segments.length !== parts.length) return null;
  const params: string[] = [];
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i]!;
    const part = parts[i]!;
    if (segment.kind === "literal") {
      if (segment.value !== part) return null;
    } else {
      params.push(part);
    }
  }
  return params;
}

function decodeParams(params: string[]): string[] | null {
  try {
    return params.map((value) => decodeURIComponent(value));
  } catch {
    return null;
  }
}

export interface RouterOptions {
  /** Resolved once per request by the adapter (Astro endpoint or the dev server). */
  store: ViewsStore | null;
}

/**
 * Single entry point for every contracted route. The Astro endpoints and the local
 * dev server both delegate here, so there is exactly one implementation per operation.
 */
export async function handleRequest(request: Request, options: RouterOptions): Promise<Response> {
  const parts = stripBase(new URL(request.url).pathname);
  const method = request.method.toUpperCase() === "HEAD" ? "GET" : request.method.toUpperCase();
  const context: HandlerContext = { store: options.store, request };

  const allowed = new Set<string>();
  for (const route of compiledRoutes) {
    const params = matchSegments(route.segments, parts);
    if (!params) continue;
    allowed.add(route.method);
    if (route.method !== method) continue;
    const decoded = decodeParams(params);
    if (!decoded) return fail.invalidPage();
    return route.handle(context, ...decoded);
  }

  if (allowed.size > 0) return fail.methodNotAllowed([...allowed].sort());
  return fail.notFound();
}

/** Absolute request path for an operation, e.g. apiPath(ApiRoutes.getPageViews, { page: "home" }). */
export function apiPath(route: Route, params: Record<string, string> = {}): string {
  const filled = route.path.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`missing path parameter: ${name}`);
    return encodeURIComponent(value);
  });
  return `${API_BASE_PATH}${filled}`;
}

export { ApiRoutes };
