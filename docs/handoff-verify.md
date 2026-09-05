# 검사 v2 — 점수 85.0/85 → pass

- 소비 85.0 · 테스트 100.0 · 파리티 70.0 · 하드코딩 15 · 미승인 발산 3 · 파리티 갭 0

## backend (backend/) — 소비 3/3 (100.0%)
- 리포트: done · 테스트 self-reported 100 · 작성 순서 test-first · 계약 접촉 3/3
- 사람 확인: Vercel 프로젝트에 VIEWS_STORE_URL · VIEWS_STORE_TOKEN 두 값을 넣어야 한다 (Upstash Marketplace 연동이 만들어 주는 REST endpoint + token). backend/.env.example 에 자리만 있고 값은 비어 있다 — 값이 없으면 세 라우트 모두 계약대로 503 store_unavailable 을 낸다.
- 사람 확인: 웹 앱(apps/web)이 이 패키지를 마운트해야 실제로 라우트가 뜬다: src/pages/api/views/index.ts 에 `export { GET, prerender } from "@yh/backend/astro/views-index";`, src/pages/api/views/[page].ts 에 `export { GET, POST, prerender } from "@yh/backend/astro/views-page";`. 웹은 @astrojs/vercel 어댑터 + output: "server" 필요. backend/README.md 에 그대로 적어 뒀다.
- 사람 확인: 조회수는 디자인 어느 화면에도 표시되지 않는다(3개 화면 HTML 에 '조회수/views' 문자열 없음). 수집만 하고 노출은 안 하는 게 맞는지 확인 바란다.
- 사람 확인: 증가 제한은 클라이언트 IP + 페이지당 10초 1회다. 사람이 다른 창을 원하면 RATE_LIMIT_WINDOW_SECONDS 한 줄이다.

## web (apps/web/) — 소비 366/366 (100.0%)
- 리포트: done · 테스트 self-reported 100 · 작성 순서 mixed · 계약 접촉 6/366
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:14 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:15 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:16 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:17 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:18 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:19 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:20 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:21 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:22 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:23 → Strings.*
- 하드코딩 raw-string apps/web/src/content/rawCopy.ts:24 → Strings.*
- 하드코딩 raw-string apps/web/src/content/codeSamples.ts:62 → Strings.*
- 하드코딩 raw-string apps/web/src/content/codeSamples.ts:63 → Strings.*
- 하드코딩 raw-string apps/web/src/content/codeSamples.ts:64 → Strings.*
- 하드코딩 raw-string apps/web/src/content/codeSamples.ts:65 → Strings.*
- 사람 확인: ENV — set VIEWS_STORE_URL and VIEWS_STORE_TOKEN (Upstash Redis REST endpoint + bearer token) in the Vercel project. Server-side only: they must never carry the PUBLIC_ prefix. Names are documented in apps/web/.env.example, values are nowhere in the repo. Without them every /api/views route answers 503 store_unavailable, by contract.
- 사람 확인: ENV — set PUBLIC_SITE_URL to the deployed origin so canonical and Open Graph URLs are absolute; without it the page falls back to the request origin.
- 사람 확인: ACCESSIBILITY — `npm run a11y` (axe-core, WCAG 2.1 A/AA) reports 0 violations on `forest` and three on the other two screens, all of them properties of the prototype's own default (light) palette, not of the implementation: (1) resume, color-contrast, --muted #6B7280 on --surface #EEF0F2 at 12px = 4.23:1 (needs 4.5); (2) resume, link-in-text-block, the App Store link --accent #2F5BEA against surrounding --muted text = 1.14:1 (needs 3:1, or an underline — the design sets text-decoration:none); (3) handoffAgent, color-contrast, --accent #2F5BEA on --code-bg #1D1F24 = 2.98:1. The same values appear in design/*.dc.html. Fixing any of them changes the design, so nothing was changed — decide whether to adjust the palette or accept the finding.
- 사람 확인: LIGHTHOUSE — not run: the accessibility score was measured with axe-core instead (no Lighthouse binary here and no network to install one). With the three findings above, the entry screen would likely land just under 90. Run `npx lighthouse` once against a preview build if the ≥90 target must be evidenced.
- 사람 확인: RAW COPY — eleven strings have no Strings key and are kept verbatim in apps/web/src/content/rawCopy.ts: 테마 전환 (theme button title), Forest 온보딩 / Forest 홈 / Forest 사운드 / Forest 기록 (screenshot alts), 확대 이미지 (lightbox alt), 온보딩 화면 비교 / 홈 화면 비교 / 사운드 화면 비교 / 기록 화면 비교 / 추가 비교 (comparison alts), and the toggle labels Light / Mint. All are copied from the exports' alt/title attributes — please confirm the wording, or accept the proposal to add contract keys.
- 사람 확인: SCREENSHOTS — .handoff/shots/{resume,forest,handoffAgent}.png are freshly regenerated from the final code (1440x900, deviceScaleFactor 2, full page, default light theme). The six older files s0.png..s5.png in that folder are leftovers from the contract-v1 cycle and no longer match any screen; the tool refused to let me delete them (".handoff/ is tool state"), so the server or the human should remove them.
- 사람 확인: AFTER MERGE — once handoff/backend is in main, backend/ exists and the @yh/backend alias resolves to the real handlers automatically. Please re-run `npm run build` in apps/web once after the merge and hit /api/views to confirm the endpoints answer with real counters instead of the 503 stand-in.
- 사람 확인: CODE SAMPLES — the four <pre> blocks whose text contains Korean (apps/web/src/content/codeSamples.ts h45..h48: the generated Strings.swift / Strings.kt samples, the openapi.yaml sample and the secret-isolation sample) are verbatim prototype text, kept literal because strings.json collapses their line breaks; test/codeSamples.test.ts asserts each segment still equals its Strings constant once whitespace is collapsed.
- 계약 수정 제안: Add Strings keys for the eleven pieces of copy the design carries in an ATTRIBUTE — strings.json only collects element text, so `alt` and `title` have no key: the theme button's title (테마 전환), the four Forest screenshot alts, the lightbox alt (확대 이미지), the five comparison-shot alts, plus the toggle's Latin labels Light/Mint. They are verbatim in apps/web/src/content/rawCopy.ts today and are the only copy in the app that is not a generated constant.
- 계약 수정 제안: Tokenise the prototype's DEFAULT (light) palette. tokens.css carries 14 tokens, all from the `mint` palette; the light palette the site opens with (--bg #F7F7F5, --ink #16181D, --accent #2F5BEA, --code-bg #1D1F24, --muted #6B7280, …) has no tokens, so those 14 values live as literals in apps/web/src/styles/global.css and nowhere else. A second token set (or light/dark pairs) would remove the last hard-coded colours and let iOS/Android carry the same default palette.
- 계약 수정 제안: Consider a Strings key for a 404 message. The design has no error screen, so src/pages/404.astro invents no copy — it shows the status code and the resume wordmark (Strings.Resume.yuyeonghun) as the way back.
