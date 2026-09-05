/**
 * `lightbox` (modal) + `open1`..`open5` + `closeLightbox` from
 * design/derived/components.json.
 *
 * A native `<dialog>` opened with `showModal()`: the browser gives us the focus trap,
 * the inert background and Esc-to-close (`escClose`) for free. Clicking anywhere on
 * the overlay closes it, exactly as the prototype does (the whole surface is zoom-out).
 */
export function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>("[data-lightbox]");
  const image = dialog?.querySelector<HTMLImageElement>("[data-lightbox-image]");
  if (!dialog || !image) return;

  document.querySelectorAll<HTMLElement>("[data-lightbox-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.dataset["lightboxSrc"];
      if (!src) return;
      image.src = src;
      image.alt = trigger.dataset["lightboxAlt"] ?? "";
      if (!dialog.open) dialog.showModal();
    });
  });

  // Any click on the overlay — background or the picture itself — closes it.
  dialog.addEventListener("click", () => dialog.close());

  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    image.alt = "";
  });
}
