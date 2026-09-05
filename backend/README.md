# @yh/backend — views API

The whole backend for this cycle: a public, per-page view counter (increment + read).
Contract: `api/openapi.yaml`. Routes come from the generated `shared/generated/ApiRoutes.ts`.

| Checklist | Operation | Route | Handler |
|---|---|---|---|
| API-01 | `ApiRoutes.listPageViews` | `GET /api/views` | `src/http/handlers.ts → listPageViews` |
| API-02 | `ApiRoutes.getPageViews` | `GET /api/views/{page}` | `src/http/handlers.ts → getPageViews` |
| API-03 | `ApiRoutes.incrementPageViews` | `POST /api/views/{page}` | `src/http/handlers.ts → incrementPageViews` |

No auth (the counters are public aggregates and the design has no login screen).
No contact form — the human deferred it to a later cycle.

## Layout

```
src/domain/    slug rules + response shapes, mirrored from api/openapi.yaml
src/store/     ViewsStore port · Upstash Redis REST adapter · in-memory adapter · key layout
src/http/      handlers (one per operation) · router built from ApiRoutes · rate limiter · responses
src/astro/     Astro endpoint adapters — what the web app mounts under src/pages/api/
src/server.ts  standalone Node dev server over the same router (no Astro needed)
```

There is exactly one implementation per operation. The Astro endpoints, the dev server
and the tests all reach the same functions.

## Wiring into the Astro web app

The human's decision was "same app, same deployment — no separate backend server". This
package holds the logic; `apps/web` mounts it as two three-line files. Add `@yh/backend`
to the web app's dependencies (workspace link), then:

`apps/web/src/pages/api/views/index.ts`
```ts
export { GET, prerender } from "@yh/backend/astro/views-index";
```

`apps/web/src/pages/api/views/[page].ts`
```ts
export { GET, POST, prerender } from "@yh/backend/astro/views-page";
```

That yields exactly the contracted paths under the `/api` prefix from `servers[0].url`.
The web app needs `output: "server"` (or these two routes marked `prerender = false`,
which the re-export already carries) and the `@astrojs/vercel` adapter.

Client side, count a visit once per page load:

```ts
fetch(`/api/views/handoff-agent`, { method: "POST", keepalive: true }).catch(() => {});
```

Failures are ignored on purpose — the counter is invisible in the design (no screen
renders a view count), so it must never affect rendering.

## Page slugs

`handoff-agent` is the case study document served at `/` (screens s0–s5 are sections of
that one page, per `ScreenPaths`). `home` is reserved for the portfolio index.
Slugs must match `^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$`; anything else is `400 invalid_page`.

## Storage

Upstash Redis over its REST API — plain `fetch`, no SDK, so it runs unchanged in the
Vercel serverless runtime.

| Key | Purpose |
|---|---|
| `yh:views:count:<page>` | the counter (`INCR` / `GET` / `MGET`) |
| `yh:views:pages` | set of every page ever incremented (`SADD` / `SMEMBERS`), backs `GET /views` |
| `yh:views:rl:<page>:<ip>` | rate-limit marker (`SET NX EX 10`) |

One increment per client IP per page per 10 s; a repeat inside the window gets
`429` with `Retry-After` and is not counted. Every store failure — unreachable, non-2xx,
malformed body, missing credentials — becomes `503 store_unavailable`. The token is
never included in an error message or log.

## Environment

Copy `.env.example` to `.env` (git-ignored) or set the same names in Vercel:

- `VIEWS_STORE_URL` — Upstash Redis REST endpoint
- `VIEWS_STORE_TOKEN` — Upstash Redis REST token

With either missing, every route answers `503`, which is the contracted behaviour.
`VIEWS_STORE_DRIVER=memory` runs the routes on in-process counters for local work only.

## Commands

```bash
npm install
npm run typecheck                                   # tsc --noEmit
npm test                                            # vitest, 48 tests
VIEWS_STORE_DRIVER=memory npm run dev               # http://localhost:4321/api/views
```
