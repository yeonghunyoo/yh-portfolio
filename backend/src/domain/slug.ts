/**
 * Page slug rules — mirrored verbatim from api/openapi.yaml → components.schemas.PageSlug.
 * Lowercase letters, digits and hyphens; 1–64 chars; no leading/trailing hyphen.
 */
export const PAGE_SLUG_PATTERN = "^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$";
export const PAGE_SLUG_MAX_LENGTH = 64;

const PAGE_SLUG_RE = new RegExp(PAGE_SLUG_PATTERN);

/** Known slugs from the contract description. `handoff-agent` is the case study page (screens s0–s5, path "/"). */
export const KnownPages = {
  home: "home",
  handoffAgent: "handoff-agent",
} as const;

export type PageSlug = string;

export function isValidPageSlug(value: unknown): value is PageSlug {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= PAGE_SLUG_MAX_LENGTH &&
    PAGE_SLUG_RE.test(value)
  );
}

/** The 400 body message the contract documents for an invalid slug. */
export function invalidPageMessage(): string {
  return `page must match ${PAGE_SLUG_PATTERN}`;
}
