import type { ScreenId } from "@generated/Screens";
import { SECTION_IDS } from "./screens";

/**
 * `onScroll` + `navScrollSpy` + `scrollRail` from design/derived/components.json.
 *
 * One passive scroll listener drives both the progress rail (scaleY of the document
 * progress) and the section nav (the last section whose top edge has passed 140px).
 * Both only repaint when something actually changed — the rail needs to move more
 * than 0.005 — which is the prototype's own guard.
 */
export const SPY_OFFSET_PX = 140;
export const RAIL_EPSILON = 0.005;

/** Document progress in 0..1. `max <= 0` (page shorter than the viewport) is 0. */
export function computeRail(scrollTop: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / max));
}

/** Index of the active section: the last one whose top edge is at or above the offset. */
export function computeCurrentIndex(
  sectionTops: readonly number[],
  offset: number = SPY_OFFSET_PX,
): number {
  let current = 0;
  for (let i = 0; i < sectionTops.length; i += 1) {
    const top = sectionTops[i];
    if (top !== undefined && top <= offset) current = i;
  }
  return current;
}

export function initScrollSpy(): void {
  const rail = document.querySelector<HTMLElement>("[data-scroll-rail]");
  const sections = SECTION_IDS.map((id) => document.getElementById(id));
  const links = SECTION_IDS.map((id: ScreenId) =>
    document.querySelector<HTMLAnchorElement>(`[data-section-link="${id}"]`),
  );

  let currentIndex = -1;
  let currentRail = -1;

  const onScroll = (): void => {
    const doc = document.documentElement;
    const nextRail = computeRail(doc.scrollTop, doc.scrollHeight - doc.clientHeight);
    const nextIndex = computeCurrentIndex(
      sections.map((section) => section?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY),
    );

    if (nextIndex !== currentIndex) {
      currentIndex = nextIndex;
      links.forEach((link, index) => {
        if (!link) return;
        const active = index === currentIndex;
        link.dataset["cur"] = active ? "1" : "0";
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }

    if (Math.abs(nextRail - currentRail) > RAIL_EPSILON || currentRail < 0) {
      currentRail = nextRail;
      if (rail) rail.style.transform = `scaleY(${nextRail.toFixed(3)})`;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}
