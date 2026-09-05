/**
 * Generated strings the owner asked to stop showing, after the design was frozen.
 *
 * `shared/generated/Strings.ts` and `design/` are contract artifacts — they are not
 * edited by hand — so a string removed from the UI stays in the generated set and the
 * contract tests would report it as a dropped translation. That guard exists to catch
 * copy lost *by accident* during the port; a deliberate removal is a different event
 * and belongs here, on the record, rather than as a weakened guard.
 *
 * Each entry names the generated path, who asked, when, and why. The next handoff
 * cycle should read this before re-adding the string: it was taken out on purpose.
 */
export interface RetiredString {
  /** Dotted path exactly as it appears in shared/generated/Strings.ts. */
  readonly path: string;
  /** ISO date the removal was requested. */
  readonly on: string;
  readonly reason: string;
}

export const RetiredCopy: readonly RetiredString[] = [
  {
    path: "Strings.Resume.hamkkeMandeuleobolkkayo",
    on: "2026-09-06",
    reason: "사람이 이력서 하단 CTA 문구 '함께 만들어볼까요?' 삭제를 지시했다. 푸터에는 연락처 줄만 남긴다.",
  },
];

export const RetiredCopyPaths: ReadonlySet<string> = new Set(RetiredCopy.map((entry) => entry.path));
