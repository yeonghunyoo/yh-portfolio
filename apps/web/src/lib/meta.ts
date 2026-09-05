import { Screens, ScreenPaths, type ScreenId } from "@generated/Screens";
import { Strings } from "@generated/Strings";
import { SiteCopy } from "../content/systemCopy";

/**
 * Document metadata per contracted screen. Every word comes from `Strings.*`, so a
 * title can never drift from the copy the page renders.
 */
export interface ScreenMeta {
  readonly id: ScreenId;
  readonly path: string;
  readonly title: string;
  readonly description: string;
}

export const SCREEN_META: Record<ScreenId, ScreenMeta> = {
  [Screens.resume]: {
    id: Screens.resume,
    path: ScreenPaths[Screens.resume],
    // The share card names the site. The headline the page renders
    // (Strings.Resume.softwareEngineerIosBuilder) stays where it belongs — in the
    // content — instead of being repeated as the title of every shared link.
    title: SiteCopy.siteTitle,
    description: Strings.Resume.iOsNeitibeuAepGaebaleulJuroMatawatjiman,
  },
  [Screens.forest]: {
    id: Screens.forest,
    path: ScreenPaths[Screens.forest],
    title: `${Strings.Resume.forest} — ${Strings.Forest.saundeuMiksingJipjungMyeongsangAepIos}`,
    description: Strings.Forest.padoBiBaramMoraeJangjakDaseot,
  },
  [Screens.handoffAgent]: {
    id: Screens.handoffAgent,
    path: ScreenPaths[Screens.handoffAgent],
    title: `${Strings.Resume.handoffAgent} — ${Strings.HandoffAgent.iOsAndroidBackendSePeulraetpomeulHan}`,
    description: `${Strings.HandoffAgent.claudeDesignUiHandoffPaekijireulGibaneuro} ${Strings.HandoffAgent.iOsAndroidBackendSePeulraetpomeulHan}`,
  },
};

/** Every screen id, in navigation order (entry first — design/derived/navigation.json). */
export const SCREEN_ORDER: readonly ScreenId[] = [
  Screens.resume,
  Screens.forest,
  Screens.handoffAgent,
];
