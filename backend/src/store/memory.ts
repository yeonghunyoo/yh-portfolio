import type { PageViews } from "../domain/types.ts";
import type { ViewsStore } from "./port.ts";

/**
 * In-process counters. Used by the test suite and by `npm run dev` when no Upstash
 * credentials are present. Never selected in production: the factory only returns it
 * when VIEWS_STORE_DRIVER=memory is set explicitly.
 */
export class MemoryViewsStore implements ViewsStore {
  readonly #counts = new Map<string, number>();
  readonly #claims = new Map<string, number>();
  readonly #now: () => number;

  constructor(options: { now?: () => number } = {}) {
    this.#now = options.now ?? (() => Date.now());
  }

  increment(page: string): Promise<number> {
    const next = (this.#counts.get(page) ?? 0) + 1;
    this.#counts.set(page, next);
    return Promise.resolve(next);
  }

  read(page: string): Promise<number> {
    return Promise.resolve(this.#counts.get(page) ?? 0);
  }

  readAll(): Promise<PageViews[]> {
    return Promise.resolve([...this.#counts].map(([page, views]) => ({ page, views })));
  }

  claim(key: string, ttlSeconds: number): Promise<boolean> {
    const now = this.#now();
    const expiresAt = this.#claims.get(key);
    if (expiresAt !== undefined && expiresAt > now) return Promise.resolve(false);
    this.#claims.set(key, now + ttlSeconds * 1000);
    return Promise.resolve(true);
  }

  /** Test helper — seed a counter without going through the HTTP layer. */
  seed(page: string, views: number): void {
    this.#counts.set(page, views);
  }
}
