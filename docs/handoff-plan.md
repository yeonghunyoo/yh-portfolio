# 계약 v2 — 지문 d5d70e4a61bd

## 화면 (design/)

| id | 제목 | 파일 | 스크린샷 |
|---|---|---|---|
| `resume` | 이력서 — 유영훈 | Resume.dc.html | 0 |
| `forest` | Forest — 명상 사운드 믹서 | Forest.dc.html | 0 |
| `handoffAgent` | Handoff Agent — 핸드오프 플러그인 | Handoff Agent.dc.html | 0 |

문서: 없음

## 토큰 (14개)

| 키 | 종류 | 값 |
|---|---|---|
| `accent` | color | `#3DDC97` |
| `accent.ink` | color | `#0F1115` |
| `accent.soft` | color | `rgba(61,220,151,.12)` |
| `bg` | color | `#0F1115` |
| `card` | color | `#141821` |
| `code.bg` | color | `#0A0C10` |
| `code.dim` | color | `#6F7783` |
| `code.ink` | color | `#C9CED6` |
| `hl` | color | `rgba(61,220,151,.14)` |
| `ink` | color | `#E6E8EC` |
| `line` | color | `rgba(230,232,236,.16)` |
| `line.soft` | color | `rgba(230,232,236,.08)` |
| `muted` | color | `#8B93A1` |
| `surface` | color | `#181C24` |

## API (3개) — api/openapi.yaml

| 이름 | 메서드 | 경로 | 요약 |
|---|---|---|---|
| `listPageViews` | GET | `/views` | List all page view counters |
| `getPageViews` | GET | `/views/{page}` | Read the view count of one page |
| `incrementPageViews` | POST | `/views/{page}` | Increment the view count of one page |

## 스펙 (사람이 결정)

- 플랫폼: web
- 스택: {"backend": "Astro server endpoints (TypeScript) — 웹과 같은 앱·같은 배포. 별도 백엔드 서버 없음", "web_project": "existing", "web_framework": "Astro + 바닐라 TS 아일랜드 (UI 프레임워크 없음). 뿌대는 빌더가 apps/web 에 create astro 로 직접 세우고 @astrojs/vercel 어댑터를 붙인다. 생성물(Screens.ts · ScreenPaths.ts · ApiRoutes.ts · DesignTokens.ts · tokens.css)를 그대로 import 해 쓴다"}
- 인프라: {"notes": "정적 포트폴리오 페이지 + 최소 백엔드. 백엔드 범위는 페이지별 조회수 집계 하나뿐이다(증가 + 조회). 문의 폼은 이번 사이클에서 제외 — 나중 사이클에 붙일 여지를 남긴다. 요금 조회는 사람이 건너뛰라고 했다.\n\n[프론트] Astro + 바닐라 TS 아일랜드. React·Svelte·Solid 어느 UI 런타임도 클라이언트에 실리지 않는다. 정적 본문 6섹션은 JS 0바이트로 내보낸다.\n\n[애니메이션 — 빠지면 미구현으로 간주한다]\n1. rise 키프레임: from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none}. s0 섹션 진입 .5s ease both, 라이트박스 등장 .2s ease both.\n2. 스크롤 진행 레일: transform scaleX(scrollTop/max), transition transform .15s linear. 변화가 0.005 초과할 때만 갱신한다.\n3. 스크롤 스파이 내비: rect.top <= 140 인 마지막 섹션이 활성. 앱커 이동은 scroll-behavior: smooth.\n4. 호버 트랜지션 8종: color .2s (링크 6곳) · transform .25s + scale(1.015) (비교 이미지 5장) · border-color .2s (3곳) · opacity .2s · background .15s (코드 토큰·표 행).\n5. 테마 전환: transition background .3s, color .3s. light ↔ mint 2종, body.dataset.theme, localStorage 'yh-theme'.\n6. 스크롤 리스너는 passive: true. prefers-reduced-motion 이 reduce 면 rise와 트랜지션을 끄되 상태 전환 자체는 유지한다(원본에는 없지만 접근성상 추가한다).", "mau": 1000, "dau": 50, "scale": "small", "hosting": "Vercel (Astro Vercel 어댑터)", "auth": "없음 — 로그인 화면이 디자인에 없고 조회수는 공개 집계다", "env_vars": ["VIEWS_STORE_URL", "VIEWS_STORE_TOKEN"], "db": "Upstash Redis (Vercel Marketplace 연동) — 페이지별 조회수 카운터 전용 (INCR / GET). 무료 티어 안에서 운영, 비용 대략 $0", "cost": "$0 (Vercel Hobby + Upstash 무료 티어, 대략치)"}

### 요금 확인 2026-09-05 (월 · USD · 대략 (무료 티어 포함, 공개 요금 기준))

| 조합 | 소규모 | 중규모 이상 | 출처 |
|---|---|---|---|
| AWS 서버리스 | $0–5 | $20–100 | <https://aws.amazon.com/dynamodb/pricing/> <https://aws.amazon.com/cognito/pricing/> <https://aws.amazon.com/lambda/pricing/> <https://aws.amazon.com/api-gateway/pricing/> |
| Railway 올인원 | $5–20 | $20–80 | <https://railway.com/pricing> |
