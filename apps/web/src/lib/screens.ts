import { Screens, ScreenPaths, type ScreenId } from "@generated/Screens";
import { Strings } from "@generated/Strings";

/**
 * The six screens of the contract are the six sections of one document:
 * every entry in `ScreenPaths` is "/", and `navigation.entry` is `s0`.
 * Section navigation is therefore fragment navigation on that one path.
 */
export const SECTION_IDS = [
  Screens.s0,
  Screens.s1,
  Screens.s2,
  Screens.s3,
  Screens.s4,
  Screens.s5,
] as const satisfies readonly ScreenId[];

/** Href for a section link — the screen's own `ScreenPaths` entry plus its anchor. */
export function sectionHref(id: ScreenId): string {
  const path = ScreenPaths[id];
  return `${path === "/" ? "" : path}#${id}`;
}

/** Section labels in the side nav. */
const SECTION_LABELS: Record<ScreenId, string> = {
  [Screens.s0]: Strings.Shared.gaeyo,
  [Screens.s1]: Strings.Shared.guseong,
  [Screens.s2]: Strings.Shared.dongjakBangsik,
  [Screens.s3]: Strings.Shared.uIuxJeonghapseong,
  [Screens.s4]: Strings.Shared.baekendeuSeupek,
  [Screens.s5]: Strings.Shared.sikeuritGyeokri,
};

/**
 * The "01".."06" ordinals the design prints above each nav label.
 * They carry no Strings key in the contract (raw_text) — kept verbatim.
 */
const SECTION_ORDINALS: Record<ScreenId, string> = {
  [Screens.s0]: "01",
  [Screens.s1]: "02",
  [Screens.s2]: "03",
  [Screens.s3]: "04",
  [Screens.s4]: "05",
  [Screens.s5]: "06",
};

export interface SectionLink {
  readonly id: ScreenId;
  readonly ordinal: string;
  readonly label: string;
  readonly href: string;
}

export const SECTION_LINKS: readonly SectionLink[] = SECTION_IDS.map((id) => ({
  id,
  ordinal: SECTION_ORDINALS[id],
  label: SECTION_LABELS[id],
  href: sectionHref(id),
}));

/** Document metadata, built from the same Strings the page renders. */
export const PAGE_TITLE = `${Strings.Shared.handoffAgent} — ${Strings.Shared.iOsAndroidBackendSePeulraetpomeulHan}`;
export const PAGE_DESCRIPTION = `${Strings.Shared.claudeDesignUiHandoffPaekijireulGibaneuro} ${Strings.Shared.iOsAndroidBackendSePeulraetpomeulHan}`;
