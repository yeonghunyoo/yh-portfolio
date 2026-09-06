/**
 * Copy for the pages the contract's three screens do not cover — the loading terminal,
 * 404 and 500 — plus the document title used when the site is shared as a link.
 *
 * None of this is invented here. The three states come from the design exports the
 * human added after the contract was frozen (404 / 500 / loading), and `siteTitle` is
 * the wording the human asked for. They have no `Strings.*` key because they are not
 * part of any contracted screen; keeping them in one module means a later handoff
 * cycle can lift them into the contract in one move.
 */

/** Shown in the browser tab and as the Open Graph title when the link is shared. */
export const SiteCopy = {
  /** The share card should name the site, not the headline the page already renders. */
  siteTitle: "개발자 유영훈의 포트폴리오",
  /**
   * 공유 카드의 서브 문구. 카카오톡·슬랙 카드는 한 줄 반쯤에서 잘리므로 슬로건 길이로
   * 맞춘다. 본문의 소개 첫 문장을 그대로 쓰던 것을 대신하는데, 그 문장은
   * "…가두지 않습니다" 로 끝나는 부정문이라 카드만 보면 끝맺음이 없었다.
   * 직무를 박지 않는 것도 의도다 — 페이지가 특정 플랫폼에 스스로를 가두지 않는다고
   * 말하면서 카드에 "iOS 개발자" 를 적으면 앞뒤가 맞지 않는다.
   */
  siteDescription: "반복을 도구로 바꾸는 개발자.",} as const;

/** The terminal that greets a first visit to the landing page. */
export const LoadingCopy = {
  windowTitle: "yeonghun@portfolio: ~ — zsh",
  label: "불러오는 중",
  /**
   * Three lines, each short enough to hold one row at 390px. The mount list and the
   * "warming up pipeline" line are gone — the mounts named routes the reader has not
   * seen yet, and the progress line duplicated what the blinking cursor already says.
   * The cursor now simply sits at the end of the last line.
   *
   * The wording is trimmed from the export's: at the size a phone uses, the original
   * two Korean lines ran 5px and 10px past the window and wrapped a single syllable
   * each. `./load-resume.sh --sections all` became an alias for the same reason.
   */
  lines: [
    "yeonghun@portfolio:~$ load-portfolio",
    "[ ok ] 유영훈의 포트폴리오를 불러옵니다",
    "[ ok ] 시간 내주셔서 감사합니다 :)",
  ],
} as const;

export const NotFoundCopy = {
  status: "HTTP 404 · Not Found",
  headline: "이 주소에는 화면이 없습니다.",
  body: "주소가 잘못되었거나 페이지가 이동되었습니다. 아래에서 찾으시는 내용으로 이동해 주세요.",
  contactLabel: "문의 · ",
  /** The three destination cards, worded as the export words them, keyed by screen id. */
  cards: {
    resume: { name: "이력서 홈", blurb: "소개 · 만든 것 · 경력" },
    forest: { name: "Forest", blurb: "사운드 믹싱 집중 & 명상 앱" },
    handoffAgent: { name: "handoff-agent", blurb: "세 플랫폼을 한 번에 구현하는 플러그인" },
  },
} as const;

export const ServerErrorCopy = {
  status: "HTTP 500 · Something went wrong",
  headline: "페이지를 불러오지 못했습니다.",
  body: "일시적인 문제일 수 있습니다. 새로 고침해 보시고, 계속되면 아래 로그와 함께 메일로 알려주세요.",
  logMessage: "렌더링 중 예기치 않은 오류",
  logHint: "reload → 그래도 안 되면 mailto:yeonghun.yoo@gmail.com",
  reload: "새로 고침",
  home: "이력서 홈으로",
  copy: "copy",
  copied: "copied ✓",
} as const;

/** Contact details the landing page shows up top and the footer repeats. */
export const ContactCopy = {
  email: "yeonghun.yoo@gmail.com",
  phone: "010 9390 8827",
  github: "github.com/yeonghunyoo",
  githubUrl: "https://github.com/yeonghunyoo",
} as const;
