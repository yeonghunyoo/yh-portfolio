/**
 * Behaviour of the system pages (404, 500). They carry the same header as the
 * contracted screens, so they need the theme switch wired the same way — nothing
 * else. The 500 page adds its own copy-the-log handler on top of this.
 */
import { bindHandlers, type Handlers } from "./dom";
import { initTheme, toggleTheme } from "./theme";

export function initSystemPage(extra: Handlers = {}): void {
  initTheme();
  bindHandlers({ toggleTheme, ...extra });
}
