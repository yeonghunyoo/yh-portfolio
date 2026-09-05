/**
 * The side rail of the forest and handoffAgent exports: `c0..cN` mark the section the
 * reader is in, `railScale` scales the accent line by the document scroll ratio.
 * Same thresholds as the prototype (`getBoundingClientRect().top <= 140`).
 */
import { scrollRatio, setBound, setVar } from "./dom";

export function initScrollSpy(sectionCount: number): void {
  let current = -1;
  let rail = -1;

  const update = (): void => {
    const ratio = scrollRatio();
    let next = 0;
    for (let i = 0; i < sectionCount; i += 1) {
      const element = document.getElementById(`s${i}`);
      if (element && element.getBoundingClientRect().top <= 140) next = i;
    }
    if (next !== current) {
      current = next;
      setBound("cur", (key) => (key === `c${current}` ? "1" : "0"));
    }
    if (Math.abs(ratio - rail) > 0.005) {
      rail = ratio;
      setVar("railScale", "--rail-scale", rail.toFixed(3));
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}
