/**
 * Theme switch — `toggleTheme` in design/derived/components.json.
 *
 * Two themes, exactly as the prototype: `light` (default) and `mint`. The value
 * lives on `body[data-theme]` and is remembered in localStorage under 'yh-theme';
 * the palettes themselves are in src/styles/global.css.
 */
export const THEME_STORAGE_KEY = "yh-theme";

export const THEMES = ["light", "mint"] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "light";

/**
 * Button label per theme. The prototype computes it in JS
 * (`themeLabel = theme === 'mint' ? 'Mint' : 'Light'`) and the contract has no
 * Strings key for either word — kept verbatim, flagged for the human.
 */
export const THEME_LABELS: Readonly<Record<Theme, string>> = {
  light: "Light",
  mint: "Mint",
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** The other theme — what a click switches to. */
export function nextTheme(current: Theme): Theme {
  return current === "mint" ? "light" : "mint";
}

/** Theme remembered from a previous visit, or the default. Never throws. */
export function readStoredTheme(storage: Pick<Storage, "getItem"> | null): Theme {
  try {
    const stored = storage?.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function persist(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode / storage disabled — the theme still applies for this visit */
  }
}

function paint(theme: Theme, toggle: HTMLElement | null): void {
  document.body.dataset["theme"] = theme;
  if (!toggle) return;
  toggle.setAttribute("aria-checked", String(theme === "mint"));
  const label = toggle.querySelector<HTMLElement>("[data-theme-label]");
  if (label) label.textContent = THEME_LABELS[theme];
}

/** Wire the header switch. Idempotent; safe to call once per page load. */
export function initThemeToggle(): void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  let theme = readStoredTheme(window.localStorage);

  paint(theme, toggle);

  toggle?.addEventListener("click", () => {
    theme = nextTheme(theme);
    persist(theme);
    paint(theme, toggle);
  });
}
