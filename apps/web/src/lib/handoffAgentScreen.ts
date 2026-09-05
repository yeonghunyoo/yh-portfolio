/**
 * Behaviour of the `handoffAgent` screen — state { theme, cur, rail, tok, lightbox }
 * and the handlers tokGap · tokSize · tokColor · tokText · tokClick · tokLeave ·
 * open1..5 · closeLightbox · toggleTheme of the design export.
 */
import { Screens } from "@generated/Screens";
import { bindHandlers, setBound, type Handlers } from "./dom";
import { initScrollSpy } from "./scrollSpy";
import { lightboxHandlers } from "./lightbox";
import { initTheme, toggleTheme } from "./theme";
import { countVisit } from "./pageViews";

/**
 * The five elements the four code samples highlight together. `tokGap` lights every
 * `data-tok-key="tGap"` span at once — that pairing is the point of the case study.
 */
export const TOKENS = ["Gap", "Size", "Color", "Text", "Click"] as const;

export function initHandoffAgentScreen(): void {
  let token: string | null = null;

  const render = (): void => setBound("tok", (key) => (key === token ? "1" : "0"));

  const handlers: Handlers = {
    toggleTheme,
    tokLeave: () => {
      token = null;
      render();
    },
    ...lightboxHandlers(),
  };
  for (const name of TOKENS) {
    handlers[`tok${name}`] = () => {
      token = `t${name}`;
      render();
    };
  }

  initTheme();
  bindHandlers(handlers);
  initScrollSpy(6);
  render();
  countVisit(Screens.handoffAgent);
}
