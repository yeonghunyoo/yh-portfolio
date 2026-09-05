import { unavailable } from "../unavailable";

/**
 * Stand-in for `@yh/backend/astro/views-page` — see ./views-index.ts for why this
 * exists and when it is used.
 */
export const prerender = false;

export const GET = (): Promise<Response> => Promise.resolve(unavailable());

export const POST = (): Promise<Response> => Promise.resolve(unavailable());
