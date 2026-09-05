import { describe, expect, it } from "vitest";
import { Screens } from "@generated/Screens";
import { MIX_INTERVAL_MS, MIX_REST, shuffleMix } from "../src/lib/forestScreen";
import { TOKENS } from "../src/lib/handoffAgentScreen";
import { CareerSkills, Skills } from "../src/content/skills";
import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY, themeLabel } from "../src/lib/theme";
import { RawCopy } from "../src/content/rawCopy";

describe("theme", () => {
  it("keeps the prototype's two palettes, default and storage key", () => {
    expect(THEMES).toEqual(["light", "mint"]);
    expect(DEFAULT_THEME).toBe("light");
    expect(THEME_STORAGE_KEY).toBe("yh-theme");
  });

  it("labels the switch the way the design does", () => {
    expect(themeLabel("light")).toBe(RawCopy.themeLight);
    expect(themeLabel("mint")).toBe(RawCopy.themeMint);
  });
});

describe("forest mix bars", () => {
  it("rests on the five heights of the design export", () => {
    expect([...MIX_REST]).toEqual([55, 30, 70, 20, 45]);
  });

  it("uses the 900 ms interval design/derived/behavior.json records", () => {
    expect(MIX_INTERVAL_MS).toBe(900);
  });

  it("shuffles inside the prototype's 15..95 range", () => {
    for (const value of shuffleMix(() => 0)) expect(value).toBe(15);
    for (const value of shuffleMix(() => 1)) expect(value).toBe(95);
    expect(shuffleMix()).toHaveLength(MIX_REST.length);
  });
});

describe("handoffAgent token pairing", () => {
  it("pairs the five elements the case study highlights", () => {
    expect([...TOKENS]).toEqual(["Gap", "Size", "Color", "Text", "Click"]);
  });
});

describe("resume skills", () => {
  it("loops the 19 chips of the design export", () => {
    expect(Skills).toHaveLength(19);
    expect(Skills[0]).toEqual({ name: "Swift" });
  });

  it("dims a career only when it never used the hovered skill", () => {
    const names = new Set(Skills.map((skill) => skill.name));
    for (const set of Object.values(CareerSkills)) {
      for (const skill of set) expect(names.has(skill), skill).toBe(true);
    }
    expect(CareerSkills.dimC.includes("Flutter")).toBe(false);
    expect(CareerSkills.dimB.includes("Flutter")).toBe(true);
  });
});

describe("screens", () => {
  it("names the three contracted screens", () => {
    expect(Object.values(Screens)).toEqual(["resume", "forest", "handoffAgent"]);
  });
});
