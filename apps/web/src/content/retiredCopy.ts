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
import { Revised as RevisedForRecord, RevisedLists as RevisedListsForRecord } from "./revisedCopy";

export interface RetiredString {
  /** Dotted path exactly as it appears in shared/generated/Strings.ts. */
  readonly path: string;
  /** ISO date the removal was requested. */
  readonly on: string;
  readonly reason: string;
}

export const RetiredCopy: RetiredString[] = [
  {
    path: "Strings.Resume.hamkkeMandeuleobolkkayo",
    on: "2026-09-06",
    reason: "사람이 이력서 하단 CTA 문구 '함께 만들어볼까요?' 삭제를 지시했다. 푸터에는 연락처 줄만 남긴다.",
  },
  {
    path: "Strings.Resume.kiroJeonhwan",
    on: "2026-09-06",
    reason:
      "사람이 탭 옆의 '← → 키로 전환' 힌트 삭제를 지시했다. 화살표 키 전환 자체는 살아 있다 — role=\"tablist\" 의 표준 키보드 동작이라 눈에 보이는 안내 없이도 스크린리더가 알린다.",
  },
  {
    path: "Strings.Handoff.jeonghapseongChekeuForest",
    on: "2026-09-06",
    reason:
      "파이프라인 verify 블록의 '정합성 체크 → Forest' 를 '검사 리포트 · Merge' 로 바꿨다. 새 문구는 [revisedCopy] 의 verifyOutcome 에 있다.",
  },
  {
    path: "Strings.HandoffAgent.dijainYeondongEijeonteu",
    on: "2026-09-06",
    reason: "사람이 플러그인 구성에서 디자인 연동 에이전트 항목을 빼기로 했다. 플랫폼 에이전트 3개만 남긴다.",
  },
  {
    path: "Strings.HandoffAgent._1Gae",
    on: "2026-09-06",
    reason: "디자인 연동 에이전트 항목과 함께 빠진 개수 표기.",
  },
  {
    path: "Strings.Resume._03Gyeongryeok4Nyeon2Gaewol",
    on: "2026-09-06",
    reason: "총 경력을 빌드 시점에 계산하도록 바꿨다 — 개별 항목을 더하면 4년 4개월인데 4년 2개월로 적혀 있었고, 시간이 지나면 반드시 다시 낡는 값이다. [revisedCopy] 의 careerLength() 가 센다.",
  },
  {
    path: "Strings.Resume._4Nyeon2Gaewol",
    on: "2026-09-06",
    reason: "위와 같음 — 경력 배지도 careerLength() 가 만든다.",
  },
];

/**
 * 문구가 바뀐 것들 — 지운 게 아니라 대체다. 새 문구와 사유는 [revisedCopy] 에 있고,
 * 여기 목록은 "생성 키가 더 이상 렌더되지 않는다" 는 가드를 위해 함께 기록한다.
 */
for (const revised of Object.values(RevisedForRecord)) {
  RetiredCopy.push({ path: revised.replaces, on: revised.on, reason: revised.reason });
}

/** 불렛으로 쪼갠 경력 상세도 원래 생성 문자열을 대체한 것이다. */
for (const revised of Object.values(RevisedListsForRecord)) {
  RetiredCopy.push({ path: revised.replaces, on: revised.on, reason: revised.reason });
}

export const RetiredCopyPaths: ReadonlySet<string> = new Set(RetiredCopy.map((entry) => entry.path));
