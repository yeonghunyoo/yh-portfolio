import { unavailable } from "../unavailable";

/**
 * Stand-in for `@yh/backend/astro/views-index`, used ONLY while the backend package
 * is absent from the checkout (it is built on its own branch and lands at
 * `<repo>/backend/`). astro.config.mjs points the `@yh/backend` alias here when that
 * directory does not exist, so the web app builds on its own; once the branches are
 * together the alias resolves to the real package and this file is never bundled.
 *
 * It answers the contract's 503 `store_unavailable`, the same shape the real handler
 * returns when the counter store is not configured — no counter is ever invented.
 */
export const prerender = false;

export const GET = (): Promise<Response> => Promise.resolve(unavailable());
