import type { PageViews } from "../domain/types.ts";
import { counterKey, pageIndexKey } from "./keys.ts";
import { StoreUnavailableError, type ViewsStore } from "./port.ts";

export interface UpstashConfig {
  /** VIEWS_STORE_URL — Upstash Redis REST endpoint, e.g. https://<id>.upstash.io */
  url: string;
  /** VIEWS_STORE_TOKEN — Upstash Redis REST token (bearer). Never logged, never echoed. */
  token: string;
  /** Request timeout in ms. Keeps a cold store from hanging a page load. */
  timeoutMs?: number;
  /** Injectable for tests. Defaults to global fetch. */
  fetchImpl?: typeof fetch;
}

type Command = (string | number)[];

interface UpstashResult {
  result?: unknown;
  error?: string;
}

const DEFAULT_TIMEOUT_MS = 3000;

function toCount(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0;
}

/**
 * Upstash Redis over its REST API — no SDK dependency, just fetch, so the same
 * adapter runs in the Vercel edge/node runtime that serves the Astro endpoints.
 */
export class UpstashViewsStore implements ViewsStore {
  readonly #url: string;
  readonly #token: string;
  readonly #timeoutMs: number;
  readonly #fetch: typeof fetch;

  constructor(config: UpstashConfig) {
    this.#url = config.url.replace(/\/+$/, "");
    this.#token = config.token;
    this.#timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.#fetch = config.fetchImpl ?? globalThis.fetch;
  }

  async #send(body: unknown, path: string): Promise<unknown> {
    const signal = AbortSignal.timeout(this.#timeoutMs);
    let response: Response;
    try {
      response = await this.#fetch(`${this.#url}${path}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.#token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        signal,
      });
    } catch (cause) {
      throw new StoreUnavailableError("views store unreachable", { cause });
    }
    if (!response.ok) {
      // The body may contain the token in an echoed request — never surface it.
      throw new StoreUnavailableError(`views store returned ${response.status}`);
    }
    try {
      return await response.json();
    } catch (cause) {
      throw new StoreUnavailableError("views store returned a malformed response", { cause });
    }
  }

  async #command(command: Command): Promise<unknown> {
    const payload = (await this.#send(command, "")) as UpstashResult;
    if (payload && typeof payload === "object" && typeof payload.error === "string") {
      throw new StoreUnavailableError("views store rejected the command");
    }
    return payload?.result;
  }

  async #pipeline(commands: Command[]): Promise<unknown[]> {
    const payload = (await this.#send(commands, "/pipeline")) as UpstashResult[] | UpstashResult;
    if (!Array.isArray(payload)) {
      throw new StoreUnavailableError("views store returned a malformed pipeline response");
    }
    return payload.map((entry) => {
      if (entry && typeof entry === "object" && typeof entry.error === "string") {
        throw new StoreUnavailableError("views store rejected the command");
      }
      return entry?.result;
    });
  }

  async increment(page: string): Promise<number> {
    const [count] = await this.#pipeline([
      ["INCR", counterKey(page)],
      ["SADD", pageIndexKey(), page],
    ]);
    return toCount(count);
  }

  async read(page: string): Promise<number> {
    return toCount(await this.#command(["GET", counterKey(page)]));
  }

  async readAll(): Promise<PageViews[]> {
    const members = await this.#command(["SMEMBERS", pageIndexKey()]);
    const pages = Array.isArray(members) ? members.filter((m): m is string => typeof m === "string") : [];
    if (pages.length === 0) return [];
    const counts = await this.#command(["MGET", ...pages.map(counterKey)]);
    const values = Array.isArray(counts) ? counts : [];
    return pages.map((page, index) => ({ page, views: toCount(values[index]) }));
  }

  async claim(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.#command(["SET", key, "1", "NX", "EX", ttlSeconds]);
    if (result === null || result === undefined) return false;
    if (typeof result === "string") return result.toUpperCase() === "OK";
    if (typeof result === "object" && result !== null && "result" in result) {
      return String((result as { result: unknown }).result).toUpperCase() === "OK";
    }
    return Boolean(result);
  }
}
