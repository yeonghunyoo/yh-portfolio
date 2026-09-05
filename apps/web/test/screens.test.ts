import { describe, expect, it } from "vitest";
import { Screens, ScreenPaths, type ScreenId } from "@generated/Screens";
import { Strings } from "@generated/Strings";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  SECTION_IDS,
  SECTION_LINKS,
  sectionHref,
} from "../src/lib/screens";

describe("section navigation", () => {
  it("SCR-01..SCR-06 · covers every screen of the contract, in order", () => {
    expect(SECTION_IDS).toEqual(Object.values(Screens));
    expect(SECTION_LINKS.map((link) => link.id)).toEqual([
      Screens.s0,
      Screens.s1,
      Screens.s2,
      Screens.s3,
      Screens.s4,
      Screens.s5,
    ]);
  });

  it("derives every href from ScreenPaths, never from a literal", () => {
    for (const id of SECTION_IDS) {
      expect(sectionHref(id)).toBe(`${ScreenPaths[id] === "/" ? "" : ScreenPaths[id]}#${id}`);
    }
  });

  it("keeps a link for the entry screen s0", () => {
    const entry = SECTION_LINKS.find((link) => link.id === Screens.s0);
    expect(entry?.href).toBe(`#${Screens.s0}`);
    expect(entry?.label).toBe(Strings.Shared.gaeyo);
  });

  it("labels every section from Strings.Shared", () => {
    const labels = SECTION_LINKS.map((link) => link.label);
    expect(labels).toEqual([
      Strings.Shared.gaeyo,
      Strings.Shared.guseong,
      Strings.Shared.dongjakBangsik,
      Strings.Shared.uIuxJeonghapseong,
      Strings.Shared.baekendeuSeupek,
      Strings.Shared.sikeuritGyeokri,
    ]);
    for (const label of labels) expect(label.length).toBeGreaterThan(0);
  });

  it("numbers the sections 01..06", () => {
    expect(SECTION_LINKS.map((link) => link.ordinal)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);
  });

  it("builds page metadata from Strings, not from hand-written copy", () => {
    expect(PAGE_TITLE).toContain(Strings.Shared.handoffAgent);
    expect(PAGE_TITLE).toContain(Strings.Shared.iOsAndroidBackendSePeulraetpomeulHan);
    expect(PAGE_DESCRIPTION).toContain(Strings.Shared.claudeDesignUiHandoffPaekijireulGibaneuro);
  });

  it("routes every screen to the one document path the contract gives it", () => {
    for (const id of Object.values(Screens) as ScreenId[]) {
      expect(ScreenPaths[id]).toBe("/");
    }
  });
});
