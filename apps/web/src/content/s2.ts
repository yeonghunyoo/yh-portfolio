import { Screens } from "@generated/Screens";
import { Strings } from "@generated/Strings";
import { sectionHref } from "../lib/screens";

export interface Step {
  /** Step number — printed as-is by the design, no Strings key in the contract. */
  readonly ordinal: string;
  readonly name: string;
  readonly description: string;
  /** Steps 2, 3, 4 and 6 link into the section that explains them. */
  readonly href?: string;
  /** The last step is the inverted card. */
  readonly invert?: boolean;
}

/** Screens.s2 — 03 동작 방식. */
export const howItWorks = {
  title: Strings.Shared.dongjakBangsik,
  steps: [
    {
      ordinal: "1",
      name: Strings.Shared.dijain,
      description: Strings.Shared.claudeDesignAepDijainPeurototaipJejak,
    },
    {
      ordinal: "2",
      name: Strings.Shared.hwamyeonBeonyeok,
      description: Strings.Shared.htmlHwamyeoneulGakNeitibeuEijeonteugaIos,
      href: sectionHref(Screens.s3),
    },
    {
      ordinal: "3",
      name: Strings.Shared.seobeoInpeura,
      description: Strings.Shared.jujeGineungYesangGyumoreulInteobyuroMutgo,
      href: sectionHref(Screens.s4),
    },
    {
      ordinal: "4",
      name: Strings.Shared.aPiYaksok,
      description: Strings.Shared.hwamyeonePilyohanDeiteoreulBogoAepSeobeo,
      href: sectionHref(Screens.s4),
    },
    {
      ordinal: "5",
      name: Strings.Shared.gongyongPailSaengseong,
      description: Strings.Shared.aPiJeonguiDijainTokeunMunguAikoneul,
    },
    {
      ordinal: "6",
      name: Strings.Shared.gaebalGeomsa,
      description: Strings.Shared.seEijeonteugaGaebalJeonghapseongeulPeurogeuraemiHwakin,
      href: sectionHref(Screens.s5),
      invert: true,
    },
  ] satisfies readonly Step[],
} as const;
