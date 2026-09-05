import { Strings } from "@generated/Strings";

/**
 * Copy that more than one section prints. Everything visible in the app is named
 * here or in a sibling `src/content/*.ts` module and comes from `Strings.Shared.*`;
 * the `.astro` templates only lay it out.
 */

/** The 문제 / 접근 / 구현 / 결과 gutter labels of the three case studies. */
export const caseLabels = {
  problem: Strings.Shared.munje,
  approach: Strings.Shared.jeopgeun,
  implementation: Strings.Shared.guhyeon,
  result: Strings.Shared.gyeolgwa,
} as const;

/** Outbound links. Plain URLs, not copy — the design writes them as `href`s. */
export const links = {
  profile: "https://github.com/yeonghunyoo",
  repo: "https://github.com/yeonghunyoo/handoff-agent",
} as const;
