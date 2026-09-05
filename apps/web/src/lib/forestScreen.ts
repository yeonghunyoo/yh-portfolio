/**
 * Behaviour of the `forest` screen — state { theme, cur, rail, pair, mix, lightbox }
 * and the handlers e1..e4 · pl · mixEnter · mixLeave · open1..4 · closeLightbox ·
 * toggleTheme of the design export.
 */
import { Screens } from "@generated/Screens";
import { bindHandlers, setBound, setVar, type Handlers } from "./dom";
import { initScrollSpy } from "./scrollSpy";
import { lightboxHandlers } from "./lightbox";
import { initTheme, toggleTheme } from "./theme";
import { countVisit } from "./pageViews";

/** Resting heights of the five mix bars — `state.mix` of the design export. */
export const MIX_REST = [55, 30, 70, 20, 45] as const;
/** `setInterval(..., 900)` — design/derived/behavior.json → timers_ms. */
export const MIX_INTERVAL_MS = 900;

/** One shuffle step: `15 + round(random() * 80)` per track. */
export function shuffleMix(random: () => number = Math.random): number[] {
  return MIX_REST.map(() => 15 + Math.round(random() * 80));
}

function paintMix(values: readonly number[]): void {
  values.forEach((value, index) => setVar(`m${index + 1}`, `--m${index + 1}`, `${value}%`));
}

export function initForestScreen(): void {
  let pair = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const renderPair = (): void => setBound("pair", (key) => (key === `p${pair}` ? "1" : "0"));

  const handlers: Handlers = {
    toggleTheme,
    pl: () => {
      pair = 0;
      renderPair();
    },
    mixEnter: () => {
      paintMix(shuffleMix());
      clearInterval(timer);
      timer = setInterval(() => paintMix(shuffleMix()), MIX_INTERVAL_MS);
    },
    mixLeave: () => {
      clearInterval(timer);
      timer = undefined;
      paintMix(MIX_REST);
    },
    ...lightboxHandlers(),
  };
  for (let i = 1; i <= 4; i += 1) {
    handlers[`e${i}`] = () => {
      pair = i;
      renderPair();
    };
  }

  initTheme();
  bindHandlers(handlers);
  initScrollSpy(4);
  paintMix(MIX_REST);
  renderPair();
  window.addEventListener("beforeunload", () => clearInterval(timer));
  countVisit(Screens.forest);
}
