import { Screens, type ScreenId } from "../../../shared/generated/Screens.ts";

/**
 * Page slug rules — mirrored verbatim from api/openapi.yaml → components.schemas.PageSlug.
 * Lowercase letters, digits and hyphens; 1–64 chars; no leading/trailing hyphen.
 */
export const PAGE_SLUG_PATTERN = "^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$";
export const PAGE_SLUG_MAX_LENGTH = 64;

const PAGE_SLUG_RE = new RegExp(PAGE_SLUG_PATTERN);

export type PageSlug = string;

/**
 * Screen id → page slug. The generated ids are camelCase (`handoffAgent`); the contract
 * spells slugs in kebab-case (`handoff-agent`), so the boundary is one mechanical rule
 * rather than a hand-kept table that could drift from Screens.
 */
export function pageSlugForScreen(screen: ScreenId): PageSlug {
  return screen
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

/**
 * The slugs this site actually counts — one per screen in design/handoff.manifest.json,
 * derived from the generated Screens constant so a new screen shows up here for free.
 * Matches api/openapi.yaml's examples: `resume`, `forest`, `handoff-agent`.
 */
export const KnownPages = Object.fromEntries(
  Object.entries(Screens).map(([key, id]) => [key, pageSlugForScreen(id)]),
) as { readonly [K in keyof typeof Screens]: PageSlug };

/** Every known slug, for callers that want the whole set (e.g. seeding or checks). */
export const knownPageSlugs: readonly PageSlug[] = Object.values(KnownPages);

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
