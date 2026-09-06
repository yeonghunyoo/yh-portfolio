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
  // ── 이력서 ────────────────────────────────────────────────────────────────
  /**
   * 시크릿 격리 절의 결과 문장. "환경변수만 노출" 은 시크릿이 사는 곳이 환경변수라
   * "시크릿은 안 샜는데 시크릿이 든 곳만 샜다" 로 읽혔다. 앞의 대시가 앞말을
   * 바로잡는 구조라 "0개라더니 뭔가 샜구나" 로 받아들여진다.
   */
  secretsOutcome: entry(
    "— 값은 환경변수로만 다뤘습니다. 빌더 에이전트들이 결과물을 내면 그 뒤에 실제 민감 정보(인증서, 키 등)를 사용자가 직접 입력하게 유도.",
    "Strings.HandoffAgent.hwangyeongbyeonsumanNochulBildeoEijeonteudeuliGyeolgwamuleulNaemyeon",
    "'환경변수만 노출' 이 유출이 있었다는 뜻으로 읽혔다. 사람이 고른 표현은 '값은 환경변수로만 다뤘다' 다 — 아래 예시의 'JWT_SECRET 은 Worker 시크릿으로만 넣는다 → 저장소에는 자리표시자만 있다' 와 같은 말이다.",
  ),
  /** 이력서에만 A/B 표기가 남아 상세 페이지와 갈렸다. */
  tokenSaving: entry(
    "구현 에이전트 토큰 39% 절감 (iOS · Android 각 8회 실측)",
    "Strings.Handoff.guhyeonEijeonteuTokeun39Jeolgam16",
    "상세 페이지에서 A/B 표기를 이름으로 바꿨는데 이력서에 남아 두 페이지가 갈렸다. 횟수도 상세와 같은 표기로 맞춘다.",
  ),
  /** 도구의 기본 착수 방식은 직렬이다 (.handoff/config.json → dispatch.mode: "serial"). */
  builderAgents: entry(
    "위 산출물 기반으로 각 플랫폼을 구현하는 빌더 에이전트 3개",
    "Strings.Handoff.wiSanchulmulGibaneuroByeongryeolGuhyeonhaneun3",
    "'병렬 구현' 은 설정으로 켜는 것이고 기본값은 직렬이다. 개수는 그대로 두고 착수 방식 주장만 뺀다.",
  ),
  interviewScope: entry(
    "요금 · 기능 · 예상 사용자 규모를 인터뷰 기반으로 표로 선택지 제공",
    "Strings.Handoff.yogeumGineungYecheukSayongjaGyumoreulInteobyu",
    "인터뷰로 묻는 값이므로 '예측' 이 아니라 '예상' 이다. 상세 페이지 동작 방식 ③ 과 표기를 맞춘다.",
  ),
  refineHeadline: entry(
    "Claude Design 프로토타입 산출물을 레이아웃 트리(JSON) 구조로 정제",
    "Strings.Handoff.claudeDesignPeurototaipSanchulmuleulReiautTeuri",
    "'정제화' 는 조어다.",
  ),
  principleTwo: entry(
    "말보다 눈으로 보여주는 것이 오해를 줄입니다. API 통신 로그는 보기 좋게 포맷화해 전달하고, 화면 이슈는 이미지·영상으로, 디자인은 샘플 데이터로 미리 확인하며 대화합니다.",
    "Strings.Resume.malbodaNuneuroHwakinsikineunGeotiOhaereulJulipnida",
    "'확인시키는' 은 어색하다.",
  ),
  careerContent: entry(
    "UI/UX 개선 및 콘텐츠 추가",
    "Strings.Resume.uIuxGaeseonMitKeontencheuChuga",
    "'컨텐츠' 는 비표준 표기다.",
  ),
  careerContentDetail: entry(
    "'오늘의 띠별 운세', '타로 신년운세' 콘텐츠 추가",
    "Strings.Resume.oneuluiTtibyeolUnseTaroSinnyeonunseKeontencheu",
    "'컨텐츠' 는 비표준 표기다.",
  ),

  // ── handoff 상세 ──────────────────────────────────────────────────────────
  agentAutonomy: entry(
    "하고, 이를 기반으로 에이전트가 자율성을 가지고 개발하도록 함. 각 에이전트는 플랫폼 개발 지식과 파이프라인이 만들어내는 중간 산출물에 접근할 수 있다.",
    "Strings.HandoffAgent.hagoIreulGibaneuroEijeonteugaJayulseongeulGajigo",
    "'접근성을 갖는다' 는 accessibility 로 읽힌다. 여기서 말하는 것은 접근 권한이다.",
  ),
  infraProblem: entry(
    "백엔드 인프라 구성은 주요 기능, 예상 사용자 규모, 예산 등에 따라 가변적이라 번거로움이 느껴졌고, 이를 돕는 인터뷰 프로세스가 필요했음. 사용자 니즈를 파악해 과한 서버 구성을 피하기 위함도 있음.",
    "Strings.HandoffAgent.baekendeuInpeuraGuseongeunJuyoGineungYecheuk",
    "'예측' → '예상' 으로 통일.",
  ),
  costTableCaption: entry(
    "월 비용 · 확인일 · 종속성 · 장단점을 월 상한이 싼 순으로 정리한 비교표를 세션에서 바로 확인",
    "Strings.HandoffAgent.wolBiyongHwakinilJongsokseongJangdanjeomeulSsan",
    "'싼 값 순' 만으로는 $0-10 이 $4-10 보다 뒤에 오는 것이 설명되지 않았다. 정렬 기준(상한)을 밝힌다.",
  ),
  costTableIntro: entry(
    "(MAU 10,000 · DAU 1,000) 기준으로 후보 조합의 요금을 오늘(2026-09-04) 다시 읽었습니다. 월 상한이 싼 순이고, 상한이 같으면 하한이 싼 쪽이 먼저입니다.",
    "Strings.HandoffAgent.mAu10000Dau1000",
    "정렬 기준을 밝힌다. 표는 이제 표시된 금액을 파싱해 이 규칙대로 정렬한다.",
  ),

  // ── Forest ────────────────────────────────────────────────────────────────
  forestStats: entry(
    "세션 기록과 연속 사용일",
    "Strings.Forest.sesyeonGirokgwaYeonsokilSeuteurik",
    "'연속일' 과 '스트릭' 이 같은 뜻이라 중복이었다.",
  ),
} as const;

/** 표의 세 행에 붙는 축 이름 — 무엇을 비교하는 행인지 한눈에 보이게 한다. */
export const RefineAxes = ["구조", "색", "이름"] as const;


/**
 * 총 경력. "4년 2개월" 로 적혀 있었지만 개별 항목을 더하면 4년 4개월이었다 — 시간이
 * 지나면 반드시 낡는 값이라 빌드할 때마다 시작일에서 다시 센다. 경계 포함으로 세는
 * 것은 각 회사 항목의 기존 표기(홀리츠 1년 11개월 · 알파이글루 1년 5개월)와 같다.
 */
const CAREER_SPANS: ReadonlyArray<{ from: readonly [number, number]; to: readonly [number, number] | null }> = [
  { from: [2025, 10], to: null },
  { from: [2023, 4], to: [2025, 2] },
  { from: [2020, 11], to: [2022, 3] },
];

function monthsBetween(from: readonly [number, number], to: readonly [number, number]): number {
  return (to[0] - from[0]) * 12 + (to[1] - from[1]) + 1;
}

export function totalCareerMonths(now: Date = new Date()): number {
  const today: readonly [number, number] = [now.getFullYear(), now.getMonth() + 1];
  return CAREER_SPANS.reduce((sum, span) => sum + monthsBetween(span.from, span.to ?? today), 0);
}

/** "4년 4개월" — 배지와 절 제목이 함께 쓴다. */
export function careerLength(now: Date = new Date()): string {
  const months = totalCareerMonths(now);
  return `${Math.floor(months / 12)}년 ${months % 12}개월`;
}

/** "03 — 경력 · 4년 4개월" — 절 제목. 한글이 화면에 직접 박히지 않게 여기서 만든다. */
export function careerSectionLabel(now: Date = new Date()): string {
  return `03 — 경력 · ${careerLength(now)}`;
}

/**
 * 경력 상세를 불렛으로 쪼갠 것.
 *
 * 원문은 한 줄에 쉼표와 마침표로 여러 성과를 이어 붙여 읽기 어려웠다. 구분자가
 * 항목마다 달라(마침표 · 쉼표 · "6건 —" 나열) 기계적으로 자를 수 없어 손으로 나눈다.
 * 낱말은 원문 그대로고 순서만 유지한 채 경계에서만 끊었다.
 */
export interface RevisedList {
  /** 불렛 위에 한 줄로 남는 도입부. 없으면 불렛만 나온다. */
  readonly intro?: string;
  readonly items: readonly string[];
  readonly replaces: string;
  readonly on: string;
  readonly reason: string;
}

const REASON = "한 줄에 쉼표·마침표로 여러 성과를 이어 붙여 읽기 어려웠다. 성과 단위로 끊는다.";
const list = (
  replaces: string,
  items: readonly string[],
  intro?: string,
): RevisedList => ({ items, replaces, on: ON, reason: REASON, ...(intro ? { intro } : {}) });

export const RevisedLists = {
  tripaidIosUx: list("Strings.Resume.androidDaebiJeongchedoenIosHwangyeongeulJeomgeomhae", [
    "Android 대비 정체된 iOS 환경을 점검해 UI/UX 전반 개선",
    "플랫폼 간 정합성 확보",
    "디자인 컴포넌트화 · 토큰화로 뷰 유지보수성 향상",
  ]),
  tripaidNetwork: list("Strings.Resume.eungdapEreoCheorireulInteosepteoGyecheungeuroBunrihae", [
    "응답 · 에러 처리를 인터셉터 계층으로 분리해 중복 제거",
    "인증 토큰 주입 · 갱신 자동화",
    "커스텀 로깅으로 디버깅 효율 개선",
  ]),
  tripaidDesign: list("Strings.Resume.dijainSaempeulroTimGanBanghyangseongGongyu", [
    "디자인 샘플로 팀 간 방향성 공유",
    "디자인 · 번역 결과를 네이티브 리소스로 컨버트해 빠르게 전달",
  ]),
  letsbeePh: list("Strings.Resume.yujeoPateuneoJeomjuAepUiux", [
    "유저 · 파트너(점주) 앱 UI/UX 구현",
    "번역 자동화 프로세스를 기능 개발에 통합",
  ]),
  /**
   * 사람이 내용을 고쳤다 — 로그아웃 플래그를 빼고, 장바구니 건은 이슈였음을,
   * 비밀번호 찾기는 기능 추가였음을 밝혔다. 항목이 다섯이 되었으므로 도입부의
   * 개수도 함께 고친다(세어 보면 바로 드러나는 자리다). 다섯 중 트러블슈팅은
   * 하나뿐이라 도입부도 "기능 추가" 로 바꿨다.
   */
  letsbeeClark: list(
    "Strings.Resume.uIuxGaeseonMitTeureobeulsyuting6",
    [
      "장바구니 동기화 이슈",
      "탭 간 스크롤 위치 캐싱",
      "비밀번호 찾기 기능 추가",
      "Apple 계정 삭제 대응 (토큰 revoke)",
      "SNS 가입 정보 통일",
    ],
    "UI/UX 개선 및 기능 추가 5건",
  ),
  myconect: list("Strings.Resume.eolgulSinbunjeungInsikGibanBoninhwakinGaro", [
    "얼굴 · 신분증 인식 기반 본인확인",
    "가로 스택 차트 형태의 시간별 예약 기능",
  ]),
  alphaiglooPayment: list("Strings.Resume.gyeoljeHuSangpumMijigeupeuroCsWa", [
    "결제 후 상품 미지급으로 CS와 DB 수정이 반복되던 이슈",
    "클로저 캡처 리스트 메모리 누수로 상품 코드가 섞이던 원인을 로그 분석으로 파악해 수정",
    "IAP finishTransaction이 지급 전에 호출되던 순서를 바로잡아 재지급 안정성 확보",
  ]),
} as const;
