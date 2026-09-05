/**
 * The prototype writes its handlers straight into the markup (`onClick="{{ pick }}"`).
 * The transplant keeps the same handler names but carries them as data attributes,
 * so one delegating listener per screen replaces the prototype's runtime.
 *
 *   onClick      -> data-on-click="<handler>"
 *   onMouseEnter -> data-on-enter="<handler>"
 *   onMouseLeave -> data-on-leave="<handler>"
 *   onKeyDown    -> data-on-keydown="<handler>"
 *
 * The bound values the prototype interpolated are carried the same way:
 *   data-hl="{{ hl0 }}"    -> data-hl="0" data-hl-key="hl0"
 *   style="width:{{ p }}"  -> a CSS custom property plus data-var="p"
 */

export type Handlers = Record<string, (event: Event, element: HTMLElement) => void>;

type Kind = "click" | "enter" | "leave" | "keydown";

const EVENT_OF: Record<Kind, keyof HTMLElementEventMap> = {
  click: "click",
  enter: "mouseenter",
  leave: "mouseleave",
  keydown: "keydown",
};

/** Wire every `data-on-*` element inside `root` to the matching handler. */
export function bindHandlers(handlers: Handlers, root: ParentNode = document): void {
  for (const kind of Object.keys(EVENT_OF) as Kind[]) {
    for (const element of root.querySelectorAll<HTMLElement>(`[data-on-${kind}]`)) {
      const name = element.dataset[kind === "keydown" ? "onKeydown" : `on${kind[0]!.toUpperCase()}${kind.slice(1)}`];
      const handler = name === undefined ? undefined : handlers[name];
      if (!handler) continue;
      element.addEventListener(EVENT_OF[kind], (event) => handler(event, element));
    }
  }
}

/**
 * Set the value of one bound attribute everywhere it appears.
 * `setBound("hl", (key) => key === "hl2" ? "1" : "0")` reproduces the prototype's
 * `data-hl="{{ hl2 }}"` for every node at once.
 */
export function setBound(attribute: string, value: (key: string) => string): void {
  for (const element of document.querySelectorAll<HTMLElement>(`[data-${attribute}-key]`)) {
    const key = element.getAttribute(`data-${attribute}-key`);
    if (key !== null) element.setAttribute(`data-${attribute}`, value(key));
  }
}

/** Set the CSS custom property that replaced an interpolated style value. */
export function setVar(binding: string, cssProperty: string, value: string): void {
  for (const element of document.querySelectorAll<HTMLElement>(`[data-var="${binding}"]`)) {
    element.style.setProperty(cssProperty, value);
  }
}

/** Scroll progress of the document, 0..1 — the prototype's `d.scrollTop / max`. */
export function scrollRatio(): number {
  const d = document.documentElement;
  const max = d.scrollHeight - d.clientHeight;
  return max > 0 ? Math.min(1, d.scrollTop / max) : 0;
}
