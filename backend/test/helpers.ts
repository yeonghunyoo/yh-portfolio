import type { Route } from "../../shared/generated/ApiRoutes.ts";
import { apiPath, handleRequest } from "../src/http/router.ts";
import type { ViewsStore } from "../src/store/port.ts";

export const ORIGIN = "https://yh-portfolio.test";

export interface CallOptions {
  params?: Record<string, string>;
  headers?: Record<string, string>;
  /** Bypasses apiPath() when a test needs a raw (possibly invalid) path. */
  rawPath?: string;
}

/**
 * Issues a real Request against the contracted route and returns the Response.
 * The path always comes from the generated ApiRoutes entry — tests cannot drift
 * from api/openapi.yaml without failing.
 */
export function call(
  route: Route,
  store: ViewsStore | null,
  options: CallOptions = {},
): Promise<Response> {
  const path = options.rawPath ?? apiPath(route, options.params ?? {});
  const request = new Request(new URL(path, ORIGIN), {
    method: route.method,
    headers: options.headers,
  });
  return handleRequest(request, { store });
}

export async function bodyOf<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}
