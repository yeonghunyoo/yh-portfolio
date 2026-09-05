import { rateLimitKey } from "../store/keys.ts";
import type { ViewsStore } from "../store/port.ts";

/**
 * One increment per client per page per window. The client is identified by the
 * proxy-supplied IP (Vercel sets x-forwarded-for / x-real-ip); no cookie, no auth,
 * nothing stored beyond a TTL'd marker.
 */
export const RATE_LIMIT_WINDOW_SECONDS = 10;

const IP_HEADERS = ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"] as const;

export function clientId(request: Request): string {
  for (const header of IP_HEADERS) {
    const value = request.headers.get(header);
    if (!value) continue;
    const first = value.split(",")[0]?.trim();
    if (first) return first;
  }
  return "anonymous";
}

export interface RateLimitVerdict {
  allowed: boolean;
  retryAfterSeconds: number;
}

export async function allowIncrement(
  store: ViewsStore,
  page: string,
  client: string,
  windowSeconds: number = RATE_LIMIT_WINDOW_SECONDS,
): Promise<RateLimitVerdict> {
  const allowed = await store.claim(rateLimitKey(page, client), windowSeconds);
  return { allowed, retryAfterSeconds: windowSeconds };
}
