import { describe, expect, it } from "vitest";
import { ApiRoutes } from "../../shared/generated/ApiRoutes.ts";
import { KnownPages } from "../src/domain/slug.ts";
import type { PageViews, PageViewsList } from "../src/domain/types.ts";
import { counterKey, pageIndexKey } from "../src/store/keys.ts";
import { StoreUnavailableError } from "../src/store/port.ts";
import { UpstashViewsStore } from "../src/store/upstash.ts";
import { bodyOf, call } from "./helpers.ts";

const URL_PLACEHOLDER = "https://example.upstash.test";
const TOKEN_PLACEHOLDER = "test-token-not-a-secret";

interface Recorded {
  url: string;
  body: unknown;
  authorization: string | null;
}

function fakeUpstash(reply: (command: unknown, url: string) => unknown, log: Recorded[] = []) {
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    log.push({
      url,
      body,
      authorization: new Headers(init?.headers).get("authorization"),
    });
    return new Response(JSON.stringify(reply(body, url)), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  return { fetchImpl, log };
}

function storeWith(reply: (command: unknown, url: string) => unknown) {
  const { fetchImpl, log } = fakeUpstash(reply);
  return {
    store: new UpstashViewsStore({ url: URL_PLACEHOLDER, token: TOKEN_PLACEHOLDER, fetchImpl }),
    log,
  };
}

describe("UpstashViewsStore — Redis REST wire format", () => {
  it("INCRs the counter key and indexes the page in one pipeline", async () => {
    const { store, log } = storeWith(() => [{ result: 7 }, { result: 1 }]);
    await expect(store.increment(KnownPages.handoffAgent)).resolves.toBe(7);
    expect(log[0]?.url).toBe(`${URL_PLACEHOLDER}/pipeline`);
    expect(log[0]?.body).toEqual([
      ["INCR", counterKey(KnownPages.handoffAgent)],
      ["SADD", pageIndexKey(), KnownPages.handoffAgent],
    ]);
    expect(log[0]?.authorization).toBe(`Bearer ${TOKEN_PLACEHOLDER}`);
  });

  it("GETs the counter key and treats a missing key as 0", async () => {
    const { store, log } = storeWith(() => ({ result: null }));
    await expect(store.read(KnownPages.resume)).resolves.toBe(0);
    expect(log[0]?.body).toEqual(["GET", counterKey(KnownPages.resume)]);
  });

  it("coerces Upstash's string counters to numbers", async () => {
    const { store } = storeWith(() => ({ result: "128" }));
    await expect(store.read(KnownPages.handoffAgent)).resolves.toBe(128);
  });

  it("reads all pages with SMEMBERS + MGET", async () => {
    const { store, log } = storeWith((command) => {
      const [verb] = command as string[];
      if (verb === "SMEMBERS") return { result: [KnownPages.resume, KnownPages.handoffAgent] };
      return { result: ["3", "128"] };
    });
    await expect(store.readAll()).resolves.toEqual([
      { page: KnownPages.resume, views: 3 },
      { page: KnownPages.handoffAgent, views: 128 },
    ]);
    expect(log[1]?.body).toEqual(["MGET", counterKey(KnownPages.resume), counterKey(KnownPages.handoffAgent)]);
  });

  it("claims a rate-limit slot with SET NX EX", async () => {
    const { store, log } = storeWith(() => ({ result: "OK" }));
    await expect(store.claim("k", 10)).resolves.toBe(true);
    expect(log[0]?.body).toEqual(["SET", "k", "1", "NX", "EX", 10]);
  });

  it("reports a taken slot when SET NX returns null", async () => {
    const { store } = storeWith(() => ({ result: null }));
    await expect(store.claim("k", 10)).resolves.toBe(false);
  });

  it("raises StoreUnavailableError when the REST call fails", async () => {
    const fetchImpl: typeof fetch = () => Promise.reject(new Error("ECONNREFUSED"));
    const store = new UpstashViewsStore({ url: URL_PLACEHOLDER, token: TOKEN_PLACEHOLDER, fetchImpl });
    await expect(store.read(KnownPages.resume)).rejects.toBeInstanceOf(StoreUnavailableError);
  });

  it("never leaks the token into the error message", async () => {
    const fetchImpl: typeof fetch = () =>
      Promise.resolve(new Response("nope", { status: 401 }));
    const store = new UpstashViewsStore({ url: URL_PLACEHOLDER, token: TOKEN_PLACEHOLDER, fetchImpl });
    const thrown = await store.read(KnownPages.resume).then(
      () => null,
      (e: unknown) => e as Error,
    );
    expect(thrown).toBeInstanceOf(StoreUnavailableError);
    expect(thrown?.message).not.toContain(TOKEN_PLACEHOLDER);
    expect(thrown?.message).toContain("401");
  });
});

describe("routes degrade to 503 when Upstash is down", () => {
  const downStore = new UpstashViewsStore({
    url: URL_PLACEHOLDER,
    token: TOKEN_PLACEHOLDER,
    fetchImpl: () => Promise.reject(new Error("network down")),
  });

  it("GET /views answers 503 instead of throwing", async () => {
    const response = await call(ApiRoutes.listPageViews, downStore);
    expect(response.status).toBe(503);
    await expect(bodyOf<{ code: string }>(response)).resolves.toMatchObject({ code: "store_unavailable" });
  });

  it("GET /views/{page} answers 503", async () => {
    const response = await call(ApiRoutes.getPageViews, downStore, { params: { page: KnownPages.resume } });
    expect(response.status).toBe(503);
  });

  it("POST /views/{page} answers 503", async () => {
    const response = await call(ApiRoutes.incrementPageViews, downStore, {
      params: { page: KnownPages.handoffAgent },
      headers: { "x-forwarded-for": "198.51.100.7" },
    });
    expect(response.status).toBe(503);
  });
});

describe("happy path over a fake Upstash, end to end", () => {
  it("POST then GET agree on the count", async () => {
    let count = 0;
    const store = new UpstashViewsStore({
      url: URL_PLACEHOLDER,
      token: TOKEN_PLACEHOLDER,
      fetchImpl: async (_input, init) => {
        const body = JSON.parse(String(init?.body)) as unknown;
        if (Array.isArray(body) && Array.isArray(body[0])) {
          count += 1;
          return new Response(JSON.stringify([{ result: count }, { result: 1 }]));
        }
        const [verb] = body as string[];
        if (verb === "SET") return new Response(JSON.stringify({ result: "OK" }));
        if (verb === "SMEMBERS") return new Response(JSON.stringify({ result: [KnownPages.handoffAgent] }));
        if (verb === "MGET") return new Response(JSON.stringify({ result: [count] }));
        return new Response(JSON.stringify({ result: count }));
      },
    });

    const posted = await bodyOf<PageViews>(
      await call(ApiRoutes.incrementPageViews, store, {
        params: { page: KnownPages.handoffAgent },
        headers: { "x-forwarded-for": "198.51.100.8" },
      }),
    );
    expect(posted).toEqual({ page: KnownPages.handoffAgent, views: 1 });

    const read = await bodyOf<PageViews>(
      await call(ApiRoutes.getPageViews, store, { params: { page: KnownPages.handoffAgent } }),
    );
    expect(read.views).toBe(1);

    const listed = await bodyOf<PageViewsList>(await call(ApiRoutes.listPageViews, store));
    expect(listed.items).toEqual([{ page: KnownPages.handoffAgent, views: 1 }]);
  });
});
