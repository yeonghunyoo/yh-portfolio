import type { PageViews } from "../domain/types.ts";

/** Raised when the counter store is unreachable or misconfigured → HTTP 503 store_unavailable. */
export class StoreUnavailableError extends Error {
  override readonly name = "StoreUnavailableError";
  constructor(message = "views store unavailable", options?: { cause?: unknown }) {
    super(message, options);
  }
}

/**
 * The only persistence this cycle needs: a per-page counter plus a short-lived
 * "already counted" marker used for rate limiting. Small scale (MAU 1000 · DAU 50)
 * — one store, no cache layer, no queue.
 */
export interface ViewsStore {
  /** Atomic +1 (Redis INCR). Returns the value after the increment. */
  increment(page: string): Promise<number>;
  /** Current value; 0 for a page that was never viewed (never throws NotFound). */
  read(page: string): Promise<number>;
  /** Every known page with its count. Order is unspecified by the contract. */
  readAll(): Promise<PageViews[]>;
  /**
   * Set `key` only if absent, with a TTL. Returns true when this caller won the slot
   * (i.e. not rate limited), false when the key already existed.
   */
  claim(key: string, ttlSeconds: number): Promise<boolean>;
}
