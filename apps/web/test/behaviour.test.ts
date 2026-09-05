import { describe, expect, it } from "vitest";
import {
  RAIL_EPSILON,
  SPY_OFFSET_PX,
  computeCurrentIndex,
  computeRail,
} from "../src/lib/scrollSpy";
import {
  DEFAULT_THEME,
  THEMES,
  THEME_LABELS,
  THEME_STORAGE_KEY,
  isTheme,
  nextTheme,
  readStoredTheme,
} from "../src/lib/theme";
import { SECTION_IDS } from "../src/lib/screens";

describe("scroll rail", () => {
  it("is 0 on a page shorter than the viewport", () => {
    expect(computeRail(0, 0)).toBe(0);
    expect(computeRail(120, -10)).toBe(0);
  });

  it("is the clamped scroll ratio", () => {
    expect(computeRail(0, 1000)).toBe(0);
    expect(computeRail(500, 1000)).toBe(0.5);
    expect(computeRail(2000, 1000)).toBe(1);
  });

  it("keeps the prototype's repaint threshold", () => {
    expect(RAIL_EPSILON).toBe(0.005);
  });
});

describe("scroll spy", () => {
  it("uses the prototype's 140px line", () => {
    expect(SPY_OFFSET_PX).toBe(140);
  });

  it("picks the last section whose top has passed the line", () => {
    const tops = [-800, -400, -20, 300, 900, 1600];
    expect(tops).toHaveLength(SECTION_IDS.length);
    expect(computeCurrentIndex(tops)).toBe(2);
  });

  it("falls back to the entry section at the top of the document", () => {
    expect(computeCurrentIndex([0, 700, 1400, 2100, 2800, 3500])).toBe(0);
    expect(computeCurrentIndex([600, 1300, 2000, 2700, 3400, 4100])).toBe(0);
  });

  it("picks the last section at the bottom of the document", () => {
    // the last section is still below the line → the fifth stays current
    expect(computeCurrentIndex([-3000, -2400, -1800, -1200, -600, 200])).toBe(4);
    // …and becomes current as soon as its top edge crosses it
    expect(computeCurrentIndex([-3000, -2400, -1800, -1200, -600, 140])).toBe(5);
    expect(computeCurrentIndex([-3000, -2400, -1800, -1200, -600, 0])).toBe(5);
  });
});

describe("theme switch", () => {
  it("has the prototype's two themes and storage key", () => {
    expect(THEMES).toEqual(["light", "mint"]);
    expect(DEFAULT_THEME).toBe("light");
    expect(THEME_STORAGE_KEY).toBe("yh-theme");
  });

  it("toggles between them", () => {
    expect(nextTheme("light")).toBe("mint");
    expect(nextTheme("mint")).toBe("light");
  });

  it("labels each theme", () => {
    expect(THEME_LABELS.light).toBe("Light");
    expect(THEME_LABELS.mint).toBe("Mint");
  });

  it("only accepts the two known values", () => {
    expect(isTheme("mint")).toBe(true);
    expect(isTheme("dark")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it("reads a remembered theme and survives a hostile storage", () => {
    expect(readStoredTheme({ getItem: () => "mint" })).toBe("mint");
    expect(readStoredTheme({ getItem: () => "nonsense" })).toBe(DEFAULT_THEME);
    expect(readStoredTheme(null)).toBe(DEFAULT_THEME);
    expect(
      readStoredTheme({
        getItem: () => {
          throw new Error("storage disabled");
        },
      }),
    ).toBe(DEFAULT_THEME);
  });
});
