import type { Env } from "../store/factory.ts";

/**
 * Astro/Vercel expose env in two places: `import.meta.env` at build/SSR time and
 * `process.env` in the serverless runtime. Read both, prefer the runtime value.
 * Values are never logged — only their presence decides 200 vs 503.
 */
export function runtimeEnv(locals?: { runtime?: { env?: Env } }): Env {
  const fromProcess: Env = typeof process !== "undefined" && process.env ? process.env : {};
  const fromMeta = (import.meta as unknown as { env?: Env }).env ?? {};
  const fromLocals = locals?.runtime?.env ?? {};
  return { ...fromMeta, ...fromProcess, ...fromLocals };
}
