

## handoff 워크플로

이 레포는 Claude Design 핸드오프 패키지로 iOS · Android · web · backend 를 한 번에 만든다. **개발 작업 전에 반드시
MCP 도구 `status` 를 부르고 `next` 를 따른다.** 절차는 `/handoff` 스킬에 있다.

- 순서: 패키지 등록 → 스펙·인프라 결정 → openapi → 계약 확정(사람) → 구현 → 검사 → 완료 승인(사람)
- `design/` · `api/` · `shared/generated/` 는 직접 편집하지 않는다. 계약 변경은 `back` 으로 되돌아가 재승인.
- 구현은 `.handoff/worktrees/<역할>` 안에서만 한다. 승인은 사람만 한다 (elicitation).
- 구현 착수는 `build` 응답의 `dispatch` 를 따른다 — 기본은 **직렬**(한 번에 한 역할, report 를 받고 다음).
  `.handoff/config.json` 의 `dispatch.mode` 를 `"parallel"` 로 바꾸면 동시 착수한다.
