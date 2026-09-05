import { Strings } from "@generated/Strings";
import { links } from "./common";

/** Copy of the sticky site header. */
export const header = {
  wordmark: Strings.Shared.yuyeonghun,
  currentProject: Strings.Shared.handoffAgent,
  otherProject: Strings.Shared.forest,
  repo: Strings.Shared.gitHub,
  /**
   * `title`/`aria-label` of the theme switch. The prototype writes it as a plain
   * attribute and the contract has no Strings key for it — kept verbatim.
   */
  themeSwitchLabel: "테마 전환",
  links,
} as const;
