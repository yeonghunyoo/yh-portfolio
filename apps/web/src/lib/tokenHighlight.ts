import type { TokenKey } from "./codeBlocks";

/**
 * `tokGap` · `tokSize` · `tokColor` · `tokText` · `tokClick` · `tokLeave` from
 * design/derived/components.json.
 *
 * Pointing at one fragment of a code sample lights up the same fragment in all four
 * samples at once (HTML · layout tree · SwiftUI · Compose). Leaving the sample clears
 * it. The highlight itself is CSS: `[data-tok="1"]` in src/styles/global.css.
 */
export function setActiveToken(root: ParentNode, tok: TokenKey | null): void {
  root.querySelectorAll<HTMLElement>("[data-tok-key]").forEach((element) => {
    element.dataset["tok"] = element.dataset["tokKey"] === tok ? "1" : "0";
  });
}

export function initTokenHighlight(): void {
  const root = document.querySelector<HTMLElement>("[data-tok-root]");
  if (!root) return;

  root.querySelectorAll<HTMLElement>("[data-tok-key]").forEach((element) => {
    const tok = element.dataset["tokKey"] as TokenKey | undefined;
    if (!tok) return;
    element.addEventListener("mouseenter", () => setActiveToken(root, tok));
    // Keyboard and screen-reader users reach the same highlight through focus.
    element.addEventListener("focus", () => setActiveToken(root, tok));
  });

  root.querySelectorAll<HTMLElement>("[data-tok-leave]").forEach((sample) => {
    sample.addEventListener("mouseleave", () => setActiveToken(root, null));
  });
}
