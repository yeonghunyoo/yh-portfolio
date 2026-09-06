/**
 * Copy the human rewrote after the design was frozen.
 *
 * `shared/generated/Strings.ts` and `design/` are contract artifacts and are not
 * edited by hand, so a reworded line lands here and the generated key it replaces goes
 * on the record in [retiredCopy.ts]. Keeping the pair together means a later handoff
 * cycle can see both what was dropped and what took its place, and lift the new
 * wording into the contract in one move.
 */
export interface RevisedString {
  /** The new wording, as rendered. */
  readonly text: string;
  /** Dotted path of the generated string it replaces, as spelled in Strings.ts. */
  readonly replaces: string;
  /** ISO date the rewrite was requested. */
  readonly on: string;
  readonly reason: string;
}

const ON = "2026-09-06";
const entry = (text: string, replaces: string, reason: string): RevisedString => ({
  text,
  replaces,
  on: ON,
  reason,
});

export const Revised = {
  /**
   * Last block of the handoff-agent pipeline diagram, under the `verify` label.
   * The three blocks before it name what that stage produces, as a noun phrase; this
   * one named a single project instead, which read as "the pipeline outputs Forest".
   */
  verifyOutcome: entry(
    "검사 리포트 · Merge",
    "Strings.Handoff.jeonghapseongChekeuForest",
    "'정합성 체크 → Forest' 는 앞의 세 블록(산출물 명사구)과 형식이 어긋나고, 일반적인 파이프라인 도해에 특정 프로젝트 이름이 들어가 층위가 맞지 않았다.",
  ),

  // ── 동작 방식 ②: 순서는 맞았고 설명이 다른 단계의 일을 적고 있었다 ──────────────
  //
  // import_design 은 그 자리에서 derive 를 돌려 design/derived/ 를 만든다 — 레이아웃
  // 트리 · 문구 · 아이콘 · 전이표 · 컴포넌트 분류. "번역" 이 일어나는 건 맞지만
  // HTML → 트리 이지, 네이티브 언어로 옮기는 것은 아니다. 그건 dispatch 이후
  // 빌더 에이전트의 일이고 ⑥ 이 이미 그렇게 적고 있어 두 단계가 겹쳐 보였다.
  refineLabel: entry(
    "화면 정제",
    "Strings.HandoffAgent.hwamyeonBeonyeok",
    "'화면 번역' 은 ⑥ 의 네이티브 변환과 같은 낱말이라 두 단계가 겹쳐 읽혔다.",
  ),
  refineBody: entry(
    "HTML 화면을 화면별 레이아웃 트리와 문구 · 아이콘 · 전이표로 정제",
    "Strings.HandoffAgent.htmlHwamyeoneulGakNeitibeuEijeonteugaIos",
    "임포트 시점에 실제로 일어나는 일은 HTML → 레이아웃 트리 정제다. 네이티브 언어로 옮기는 것은 dispatch 이후 빌더 에이전트가 하며 ⑥ 이 이미 적고 있다.",
  ),

  // ── 정제 전후 표 ────────────────────────────────────────────────────────────
  refineLead: entry(
    "정제의 목적은 정합성 검증입니다. 사람이 눈으로 대조하던 것을, 프로그램이 셀 수 있는 수치로 바꿉니다.",
    "Strings.HandoffAgent.jeongjeJeonhuuiIpryeokeulSutjaroBomyeon",
    "'정제 전후의 입력을 숫자로 보면' 은 라벨일 뿐 주장이 없었다. 왜 정제하는지(정합성을 프로그램이 검증할 수 있게) 를 앞세운다.",
  ),
  /** 실측: wc -l 320 · 242 · 150 · 103. 기존 문구는 네 값 모두 +1 이었다. */
  refineTrees: entry(
    "→ 화면별 트리 4개 (320 · 242 · 150 · 103줄)",
    "Strings.HandoffAgent.hwamyeondangTeuri4Gae321243",
    "줄 수가 네 파일 모두 +1 이었다(split('\\n') 이 끝 개행 뒤 빈 줄을 세는 off-by-one). 실측은 320 · 242 · 150 · 103.",
  ),
  /** 표 밖으로 뺀 제외 규칙 — 지표가 아니라 무엇을 버리는지에 대한 설명이다. */
  refineExclusions: entry(
    "앱에 없는 프로토타입 장식(가짜 상태바 · 홈 인디케이터 · 폰 프레임 · 런타임 JS)은 트리에 담지 않습니다.",
    "Strings.HandoffAgent.peurototaipJangsik",
    "'프로토타입 장식 → 전달 안 함' 은 숫자가 아니라 제외 규칙이라 '숫자로 보면' 표에 들어갈 성격이 아니었다.",
  ),
  /**
   * 화면 5개인데 트리가 4개인 이유. derive.py 가 규칙을 명문화하고 있다 —
   * "오버레이는 화면이 아니라 컴포넌트다". 재생 중 화면은 components.json 에
   * `{"id":"nowPlaying","type":"modal","screen":"shared"}` 로 기록돼 있고,
   * navigation.json 도 화면 이동(go/leave) 이 아니라 open/close 대상으로만 다룬다.
   */
  refineOverlayNote: entry(
    "재생 중 화면은 type: modal 오버레이로 분류돼 트리가 4개입니다 — 추출기는 오버레이를 화면이 아니라 컴포넌트로 봅니다.",
    "Strings.HandoffAgent.jeondalAnHam",
    "화면 5개에 트리 4개인 이유가 어디에도 없어 숫자가 틀린 것처럼 읽혔다.",
  ),

  // ── 성능 검증 A/B: 글자 대신 이름으로 ────────────────────────────────────────
  //
  // A · B 는 실험 설계용 표기라 읽는 사람이 대응표를 들고 다녀야 했고, 그 대응이
  // 표 머리 · 본문 · 캡션 세 군데에 흩어져 있었다. 캡션은 B 를 먼저 부르기까지 했다.
  abRunCount: entry(
    "iOS 8회 · Android 8회 (총 16회)",
    "Strings.HandoffAgent.homeStatsIosAndroid2Hoe",
    "'home · stats × iOS · Android × 2회 = 16회' 는 곱하면 8이 나온다 — 비교 축인 입력 2가지가 빠져 있었다. 플랫폼당 8회로 적으면 검산할 필요가 없다.",
  ),
  abArmHtml: entry(
    "원본 HTML (57KB)",
    "Strings.HandoffAgent.aWonbonHtml57Kb",
    "A · B 는 뜻이 없는 글자라 읽는 사람이 대응표를 기억해야 했다. 그대로 이름을 부른다.",
  ),
  abArmTree: entry(
    "정제한 레이아웃 트리",
    "Strings.HandoffAgent.bJeongjehanReiautTeuri",
    "A · B 는 뜻이 없는 글자라 읽는 사람이 대응표를 기억해야 했다. 그대로 이름을 부른다.",
  ),
  abParityHtml: entry(
    "이 입력으로 돌린 8번 중 7번, 화면을 제 마음대로 바꿈 — 조건부 영역을 항상 표시, 정해진 색 대신 임의 색",
    "Strings.HandoffAgent._8BeonJung7BeonHwamyeoneul",
    "16 을 플랫폼으로 잘라도 8, 입력으로 잘라도 8 이라 이 '8번' 이 어느 쪽인지 모호했다. 입력 쪽임을 밝힌다.",
  ),
  abConclusion: entry(
    "바꿔 비교. 디자인이 확정된 상황에선 정합성이 우선이라 정제 트리를 택해 도입했습니다.",
    "Strings.HandoffAgent.bakkwoBigyoDijainiHwakjeongdoenSanghwangeseonJeonghapseongi",
    "'B를 택해' 가 표 머리를 다시 찾아보게 만들었다.",
  ),
  abFigureOrder: entry(
    "왼쪽부터 정제 트리 · HTML 직접 변환 · 인터랙티브 프로토타입 · 클릭하면 확대",
    "Strings.HandoffAgent.oenjjokbuteoBReiautTeuriAhtml",
    "캡션이 B 를 먼저 불러 표 순서(A 다음 B)와 반대였다. 이름으로 부르면 순서를 맞출 필요가 없다.",
  ),
  abOnboardingGap: entry(
    "온보딩 — 버튼 위치 · 여백이 HTML 직접 변환에서 프로토타입과 달라짐",
    "Strings.HandoffAgent.onbodingBeoteunWichiYeobaekiAEseo",
    "'A에서' 가 무엇인지 이 문장만으론 알 수 없었다.",
  ),
  abSectionTitle: entry(
    "성능 검증 — Handoff package 정제 전후 비교",
    "Strings.HandoffAgent.seongneungGeomjeungHandoffPackageJeongjeJeonhu",
    "제목에 남은 'A/B' 가 표 안에서 글자를 걷어낸 것과 어긋났다. 비교 대상은 이제 이름으로 부른다.",
  ),
  /** 축 라벨 '색' 이 붙으므로 셀에서는 되풀이하지 않는다. */
  refineColorBefore: entry(
    "리터럴 119개",
    "Strings.HandoffAgent.saekRiteoreol119Gae",
    "행에 '색' 축 라벨이 생겨 '색 색 리터럴' 로 겹쳐 읽혔다.",
  ),
  /** 축 라벨 '이름' 이 붙으므로 셀에서는 되풀이하지 않는다. */
  refineNameBefore: entry(
    "문구 · 아이콘 · 동작",
    "Strings.HandoffAgent.ireumEoldeonMunguAikonDongjak",
    "행에 '이름' 축 라벨이 생겨 '이름 이름 없던' 으로 겹쳐 읽혔다.",
  ),
} as const;

/** 표의 세 행에 붙는 축 이름 — 무엇을 비교하는 행인지 한눈에 보이게 한다. */
export const RefineAxes = ["구조", "색", "이름"] as const;
