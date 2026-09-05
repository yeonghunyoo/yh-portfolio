/**
 * Types the loading script out, then gets out of the way.
 *
 * The design export types one character every 8ms and cycles a spinner every 220ms.
 * The human asked for the terminal to hold for two seconds on a first landing, so the
 * typing is paced to finish inside that window and the overlay leaves at 2s regardless
 * of how far the text got — the reader is never kept waiting on an animation.
 */
import { LoadingCopy } from "../content/systemCopy";

export const HOLD_MS = 2000;
const FADE_MS = 350;
const SPINNER_MS = 220;

/** sessionStorage key holding the epoch-ms of the last time the terminal played. */
export const SEEN_KEY = "yh-landed";

/**
 * How long a "already seen" mark counts for.
 *
 * The mark lives in sessionStorage, so closing the tab drops it and the next visit
 * plays the terminal — which is the behaviour asked for. A browser that restores a
 * session hands the mark back, though, and a genuine return then looks like a reload.
 * Anything older than this is treated as a new visit, so a restored tab still plays.
 */
export const SEEN_FRESH_FOR_MS = 30 * 60 * 1000;

/** Records when the terminal played. Storage may be unavailable; that is fine. */
function markSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    /* storage disabled — the terminal shows again next time */
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function initLoadingTerminal(): void {
  const overlay = document.querySelector<HTMLElement>("[data-loading-terminal]");
  if (!overlay) return; // already removed before paint — this tab has been here

  const out = overlay.querySelector<HTMLElement>("[data-terminal-text]");
  const script = LoadingCopy.lines.join("\n");
  markSeen();

  const timers: number[] = [];
  const stop = (): void => {
    for (const id of timers) window.clearInterval(id);
    timers.length = 0;
  };

  const leave = (): void => {
    stop();
    overlay.dataset["leaving"] = "";
    window.setTimeout(() => overlay.remove(), prefersReducedMotion() ? 0 : FADE_MS);
  };

  if (!out || prefersReducedMotion()) {
    if (out) out.textContent = script;
    window.setTimeout(leave, HOLD_MS);
    return;
  }

  // Finish typing a little before the hold ends, whatever the script's length.
  const typeEvery = Math.max(4, Math.floor((HOLD_MS * 0.7) / script.length));
  let typed = 0;
  let frame = 0;

  timers.push(
    window.setInterval(() => {
      typed = Math.min(script.length, typed + 1);
      const spinner = LoadingCopy.spinner[frame % LoadingCopy.spinner.length] ?? "";
      out.textContent = typed >= script.length ? `${script}${spinner}` : script.slice(0, typed);
    }, typeEvery),
    window.setInterval(() => {
      frame += 1;
    }, SPINNER_MS),
  );

  window.setTimeout(leave, HOLD_MS);
}
