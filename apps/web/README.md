# @yh/web — handoff-agent case study site

Astro 5 + vanilla TypeScript islands (no UI framework ships to the browser), deployed
through `@astrojs/vercel`. The whole document is one page: screens `s0`–`s5` of the
contract are the six sections of `/` (every entry in `ScreenPaths` is `"/"`).

| Checklist | Screen | Section component |
|---|---|---|
| SCR-01 | `Screens.s0` — 01 개요 | `src/sections/S0Overview.astro` |
| SCR-02 | `Screens.s1` — 02 구성 | `src/sections/S1Composition.astro` |
| SCR-03 | `Screens.s2` — 03 동작 방식 | `src/sections/S2HowItWorks.astro` |
| SCR-04 | `Screens.s3` — 04 UI/UX 정합성 | `src/sections/S3UiParity.astro` |
| SCR-05 | `Screens.s4` — 05 백엔드 스펙 | `src/sections/S4BackendSpec.astro` |
| SCR-06 | `Screens.s5` — 06 시크릿 격리 | `src/sections/S5SecretIsolation.astro` |

| Checklist | Operation | Consumed by |
|---|---|---|
| API-01 | `ApiRoutes.listPageViews` | `src/lib/apiClient.ts → listPageViews` |
| API-02 | `ApiRoutes.getPageViews` | `src/lib/apiClient.ts → getPageViews` |
| API-03 | `ApiRoutes.incrementPageViews` | `src/lib/apiClient.ts → incrementPageViews`, called once per page load by `src/lib/pageViews.ts` |

## Layout

```
src/layouts/Base.astro      <html lang="ko">, metadata, tokens.css + global.css, pre-paint theme
src/components/             SiteHeader (theme toggle) · SectionNav (rail + scroll spy) · Lightbox · CodeSample
src/sections/               one component per contracted screen
src/lib/                    apiClient (ApiRoutes) · screens (Screens/ScreenPaths) · theme · scrollSpy ·
                            tokenHighlight · lightbox · pageViews · codeBlocks
src/styles/global.css       the design's own <style> block + the light/mint palettes
src/pages/index.astro       the document · 404.astro · favicon.svg.ts (drawn from DesignTokens)
```

Nothing is copied out of `design/` or `shared/generated/`. Both are read-only and are
reached through aliases declared in `astro.config.mjs` and `tsconfig.json`:

| Alias | Points at |
|---|---|
| `@generated/*` | `shared/generated/*` — `ApiRoutes`, `Screens`, `ScreenPaths`, `DesignTokens`, `Strings`, `tokens.css` |
| `@design-uploads/*` | `design/uploads/*` — the five comparison screenshots, optimised by `astro:assets` at build time |

## Themes and tokens

`shared/generated/tokens.css` declares the 14 contracted tokens on `:root` with the
**mint** palette — that is what the extractor captured. The prototype has two themes,
`light` (default) and `mint`. `src/styles/global.css` keeps the generated values under
`--mint-*` aliases and hands them back on `body[data-theme="mint"]`, so no mint colour is
ever re-typed by hand. The light palette has no tokens in the contract, so its values are
literals there (and only there) — see the report's proposals.

Every component consumes colour as `var(--token)`; `test/contract.test.ts` fails if a
component file contains a hex colour or re-types a generated value.

## Behaviour (design/derived/components.json)

| Component | Where |
|---|---|
| `toggleTheme` (toggle) | `SiteHeader.astro` + `src/lib/theme.ts` — `body[data-theme]`, `localStorage['yh-theme']` |
| `navScrollSpy` (tab) + `scrollRail` (item) + `onScroll` (gesture) | `SectionNav.astro` + `src/lib/scrollSpy.ts` — one passive listener, 140px line, 0.005 rail threshold |
| `tokGap` `tokSize` `tokColor` `tokText` `tokClick` `tokLeave` (gestures) | `src/lib/tokenHighlight.ts` — one element lights up in all four code samples at once |
| `open1`..`open5` (buttons) + `lightbox` (modal) + `closeLightbox` + `escClose` | `S3UiParity.astro` + `Lightbox.astro` + `src/lib/lightbox.ts` — a native `<dialog>` (`showModal()` gives the focus trap and Esc) |

## Mounting the views API (after the backend branch merges)

The human's decision was "same app, same deployment — no separate backend server". The
`@yh/backend` package holds the logic and this app mounts it as two re-exports. It is not
wired yet because `backend/` does not exist on this branch; add it once both branches are
in main:

1. `"@yh/backend": "workspace:*"` (or a relative `file:../../backend`) in `dependencies`.
2. `src/pages/api/views/index.ts` — `export { GET, prerender } from "@yh/backend/astro/views-index";`
3. `src/pages/api/views/[page].ts` — `export { GET, POST, prerender } from "@yh/backend/astro/views-page";`

That yields exactly the contracted paths under the `/api` prefix from `servers[0].url`.
Until then `POST /api/views/handoff-agent` 404s; the client swallows the failure on
purpose — the counter is invisible in the design and must never affect rendering.

## Environment

Copy `.env.example` to `.env`. Only `PUBLIC_*` values reach the browser; never put a
secret behind that prefix. The Upstash credentials (`VIEWS_STORE_URL`,
`VIEWS_STORE_TOKEN`) belong to the backend package, not here.

## Commands

```bash
npm run dev         # astro dev
npm run typecheck   # tsc --noEmit          (per-cycle)
npm test            # vitest run            (per-cycle)
npm run check       # astro check           (once, at the end)
npm run build       # astro build           (once, at the end)
```

Three scripts need a browser and a dev server, so they are not part of `npm test`.
Each one starts and stops its own `astro dev`:

```bash
npm run smoke   # the four interactive components, in a real browser
npm run shots   # one PNG per screen into <worktree>/.handoff/shots/
npm run a11y    # axe-core, WCAG 2.1 A/AA, both themes + the 404 page
```

## Known accessibility finding

`npm run a11y` reports **0 violations** in the mint theme and on the 404 page. The
light theme — the default — has one, `color-contrast`, and it comes from the prototype
palette itself, not from this implementation:

| Where | Foreground on background | Ratio |
|---|---|---|
| code sample titles, `[data-tok]` fragments | `--accent` `#2F5BEA` on `--code-bg` `#1D1F24` | ≈ 3.0 : 1 |
| table headers | `--muted` `#6B7280` on `--surface` `#EEF0F2` | ≈ 4.2 : 1 |

Both need 4.5 : 1. Fixing them means changing the light palette, which is a design
decision — the app reproduces the prototype's colours exactly and does not invent any.
