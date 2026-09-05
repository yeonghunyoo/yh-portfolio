/**
 * Theme switch — `toggleTheme` / `themeLabel` of all three design exports.
 *
 * The prototype keeps `theme` in component state, writes `document.body.dataset.theme`
 * and remembers the choice under `yh-theme` in localStorage. Same here; the palettes
 * themselves live in styles/global.css.
 */
import { RawCopy } from "../content/rawCopy";

export const THEME_STORAGE_KEY = "yh-theme";
export const THEMES = ["light", "mint"] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = "light";

export function themeLabel(theme: Theme): string {
  return theme === "mint" ? RawCopy.themeMint : RawCopy.themeLight;
}

export function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "mint" || stored === "light") return stored;
  } catch {
    /* storage disabled — fall through to the default */
  }
  return DEFAULT_THEME;
}

export function applyTheme(theme: Theme): void {
  document.body.dataset["theme"] = theme;
  for (const node of document.querySelectorAll<HTMLElement>("[data-theme-label]")) {
    node.textContent = themeLabel(theme);
  }
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage disabled — the switch still works for this visit */
  }
}

export function currentTheme(): Theme {
  return document.body.dataset["theme"] === "mint" ? "mint" : "light";
}

export function initTheme(): void {
  applyTheme(readTheme());
}

export function toggleTheme(): void {
  applyTheme(currentTheme() === "mint" ? "light" : "mint");
}
