/** Redis key layout. One counter key per page + one set holding every known page. */
export const KEY_PREFIX = "yh:views";

/** Counter key for a page slug (Redis INCR / GET target). */
export const counterKey = (page: string): string => `${KEY_PREFIX}:count:${page}`;

/** Set of every page slug that has ever been incremented (SADD / SMEMBERS). */
export const pageIndexKey = (): string => `${KEY_PREFIX}:pages`;

/** Short-lived marker used by the increment rate limiter (SET NX EX). */
export const rateLimitKey = (page: string, client: string): string =>
  `${KEY_PREFIX}:rl:${page}:${client}`;
