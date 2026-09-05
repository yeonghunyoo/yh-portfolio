/**
 * `open1..open5` / `closeLightbox` of the forest and handoffAgent exports.
 *
 * The prototype swaps `state.lightbox` to an asset path and renders the overlay.
 * Here the opening button already contains the image, so the dialog reuses that
 * element's built source — the bundler's optimised copy, never a hand-written path.
 */
import type { Handlers } from "./dom";

export function lightboxHandlers(): Handlers {
  const dialog = document.querySelector<HTMLDialogElement>("[data-lightbox]");
  const image = document.querySelector<HTMLImageElement>("[data-lightbox-image]");
  if (!dialog || !image) return {};

  const close = (): void => {
    if (dialog.open) dialog.close();
  };

  dialog.addEventListener("click", close);
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
  });

  const open = (_event: Event, element: HTMLElement): void => {
    const source = element.querySelector("img");
    if (!source) return;
    image.src = source.currentSrc || source.src;
    const alt = source.getAttribute("alt");
    if (alt !== null) image.alt = alt;
    dialog.showModal();
  };

  const handlers: Handlers = { closeLightbox: close };
  for (let n = 1; n <= 5; n += 1) handlers[`open${n}`] = open;
  return handlers;
}
