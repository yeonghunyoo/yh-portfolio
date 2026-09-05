# @yh/web — resume + case studies

Astro 5 + vanilla TypeScript islands (no UI framework ships to the browser), deployed
through `@astrojs/vercel`. Three documents, one per contracted screen, plus the views API
mounted on the same app.

| Checklist | Screen | Route | Files |
|---|---|---|---|
| SCR-01 | `Screens.resume` — 이력서 — 유영훈 | `ScreenPaths.resume` (and `/`, the entry) | `src/pages/resume.astro` · `src/pages/index.astro` · `src/screens/ResumeScreen.astro` |
| SCR-02 | `Screens.forest` — Forest — 명상 사운드 믹서 | `ScreenPaths.forest` | `src/pages/forest.astro` · `src/screens/ForestScreen.astro` |
| SCR-03 | `Screens.handoffAgent` — Handoff Agent — 핸드오프 플러그인 | `ScreenPaths.handoffAgent` | `src/pages/handoffAgent.astro` · `src/screens/HandoffAgentScreen.astro` |

| Checklist | Operation | Client | Server |
|---|---|---|---|
| API-01 | `ApiRoutes.listPageViews` | `src/lib/apiClient.ts → listPageViews` | `src/pages/api/views/index.ts` |
| API-02 | `ApiRoutes.getPageViews` | `src/lib/apiClient.ts → getPageViews` | `src/pages/api/views/[page].ts` |
| API-03 | `ApiRoutes.incrementPageViews` | `src/lib/apiClient.ts → incrementPageViews`, called once per page load by `src/lib/pageViews.ts` | `src/pages/api/views/[page].ts` |

No screen displays a view count, so `countVisit()` swallows every failure: the counter can
never change what the reader sees.

## Layout

```
src/layouts/Base.astro      <html lang="ko">, metadata + Open Graph, tokens.css + global.css,
                            and the inline script that applies the remembered theme
                            before the first paint
src/screens/                one component per contracted screen — markup and its <style> block
src/components/Lightbox.astro   the shared <dialog> the case-study screenshots open into
src/content/                resumeCopy · forestCopy · handoffAgentCopy — one field per
                            contracted string, per screen — plus codeSamples · rawCopy · skills
src/lib/                    apiClient (ApiRoutes) · pageViews · meta (Screens/ScreenPaths/Strings) ·
                            theme · scrollSpy · lightbox · dom · one <screen>Screen.ts per screen
src/lib/backend-unmounted/  stand-in endpoints, used only when <repo>/backend is not checked out
src/pages/                  index · resume · forest · handoffAgent · 404 · favicon.svg.ts ·
                            api/views/* (the two server endpoints)
src/styles/global.css       the design's own global rules + the light/mint palettes
scripts/                    shots.ts (compare-page screenshots) · a11y.ts (axe-core)
```

Copy and layout are separated on purpose: a `.astro` file never spells a string, it reads a
field of its `src/content/<screen>Copy.ts` module, and every field there is a `Strings.*`
constant. All 360 contracted keys are used; `test/contract.test.ts` proves it, fails on
inline Korean, and fails on a copy field the screen does not render.

The only copy that is not a `Strings` key is in `src/content/rawCopy.ts`: text the design
carries in an *attribute* (`alt`, `title`), which `strings.json` does not collect. It is
verbatim from the exports and listed in the build report.

Nothing is copied out of `design/` or `shared/generated/`. Both are read-only and are
reached through aliases declared in `astro.config.mjs` and `tsconfig.json`:

| Alias | Points at |
|---|---|
| `@generated/*` | `shared/generated/*` — `ApiRoutes`, `Screens`, `ScreenPaths`, `DesignTokens`, `Strings`, `tokens.css` |
| `@design-assets/*` | `design/assets/*` — the nine case-study screenshots, optimised by `astro:assets` at build time |
| `@yh/backend` | `backend/src` when the backend package is checked out, `src/lib/backend-unmounted` when it is not |

## Themes and tokens

`shared/generated/tokens.css` declares the 14 contracted tokens on `:root` with the
**mint** palette — that is what the extractor captured. The prototype has two themes,
`light` (default) and `mint`. `src/styles/global.css` keeps the generated values under
`--mint-*` aliases and hands them back on `body[data-theme="mint"]`, so no mint colour is
ever re-typed by hand. The light palette has no tokens in the contract, so its values are
literals there (and only there) — see the report's proposals.

Every screen consumes colour as `var(--token)`; `test/contract.test.ts` fails if a screen's
stylesheet re-types a generated value.

## Behaviour (design/derived/components.json)

| Component | Where |
|---|---|
| `toggleTheme` `toggleTheme2` `toggleTheme3` (toggle) | each screen's own header button + `src/lib/theme.ts` — `body[data-theme]`, `localStorage['yh-theme']` |
| `pickHandoff` `pickForest` (button) + `skillsEnter` (item) + `enter0`..`enter4` (gesture) | `src/lib/resumeScreen.ts` — the project tabs, the skill rail and the pipeline nodes |
| `mixEnter` `e1`..`e4` (gesture) | `src/lib/forestScreen.ts` — the mixer bars, `setInterval(900)` from behavior.json |
| the section rail (`scrollSpy`) | `src/lib/scrollSpy.ts` — one passive scroll listener, used by the two case-study screens |
| `tokGap` `tokSize` `tokColor` `tokText` `tokClick` `tokLeave` (gesture) | `src/lib/handoffAgentScreen.ts` — one element lights up in all four code samples at once |
| `open1`..`open5` (button) + `closeLightbox` | `src/components/Lightbox.astro` + `src/lib/lightbox.ts` — a native `<dialog>` (`showModal()` gives the focus trap and Esc) |

The design's `gesture` components are pointer-only (`mouseenter` / `mouseleave`, wired by
`src/lib/dom.ts`) and stay that way here: every one of them only *highlights* something
that is already on screen — the pipeline node, the skill rail, the mixer bars, the matching
token in the four code samples — so a reader who never hovers loses no content. That is the
parity divergence recorded in the build report. What is keyboard-reachable is everything
that carries information or navigation: the project tabs, the links, the theme toggle, the
lightbox buttons and the horizontally scrollable code blocks (`tabindex="0"`).

## The views API

The human's decision was "same app, same deployment — no separate backend server".
`@yh/backend` holds the logic; this app mounts it on the paths Astro derives from the file
layout, which is exactly `ApiRoutes.*` under the `/api` prefix from `servers[0].url`:

```
src/pages/api/views/index.ts    → GET  /api/views
src/pages/api/views/[page].ts   → GET, POST /api/views/{page}
```

`prerender = false` is declared in those files as a literal: Astro reads it by static
analysis, and a re-exported flag is invisible to it.

The backend package is developed on its own branch and lands at `<repo>/backend`. When it
is absent, `astro.config.mjs` points `@yh/backend` at `src/lib/backend-unmounted`, whose
handlers answer the contract's `503 store_unavailable` and never invent a count — so this
app always builds, and the real handlers take over as soon as both branches are together.

## Environment

Copy `.env.example` to `.env`. Only `PUBLIC_*` values reach the browser; never put a secret
behind that prefix. `VIEWS_STORE_URL` / `VIEWS_STORE_TOKEN` are the Upstash credentials the
mounted endpoints read at runtime — server-side only, set in the deployment environment.

## Commands

```bash
npm run dev         # astro dev
npm run typecheck   # tsc --noEmit          (per-cycle)
npm test            # vitest run            (per-cycle)
npm run check       # astro check           (once, at the end)
npm run build       # astro build           (once, at the end)
```

Two scripts need a browser and a dev server, so they are not part of `npm test`. Each one
starts and stops its own `astro dev`, and every wait inside them is bounded — they can fail
loudly, never hang:

```bash
npm run shots   # one PNG per screen into <worktree>/.handoff/shots/<screenId>.png
npm run a11y    # axe-core, WCAG 2.1 A/AA, over every ScreenPaths.* route
```

## Known accessibility finding

`npm run a11y` reports **0 violations** on `forest`. The other two screens have three, all
of them properties of the prototype's default (light) palette rather than of this
implementation — the same values appear in `design/*.dc.html`:

| Screen | Rule | Measured |
|---|---|---|
| `resume` | `color-contrast` | `--muted` `#6B7280` on `--surface` `#EEF0F2`, 12px → 4.23 : 1 (needs 4.5) |
| `resume` | `link-in-text-block` | inline link `--accent` `#2F5BEA` vs surrounding `--muted` `#6B7280` → 1.14 : 1 (needs 3, or an underline; the design sets `text-decoration: none`) |
| `handoffAgent` | `color-contrast` | `--accent` `#2F5BEA` on `--code-bg` `#1D1F24` → 2.98 : 1 (needs 4.5) |

Fixing any of them means changing the light palette or the link styling, which is a design
decision. The app reproduces the prototype's colours exactly and invents none.
