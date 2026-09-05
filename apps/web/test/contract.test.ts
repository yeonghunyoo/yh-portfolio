import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DesignTokens } from "@generated/DesignTokens";
import { Screens, ScreenPaths, type ScreenId } from "@generated/Screens";
import { Strings } from "@generated/Strings";
import { SCREEN_META, SCREEN_ORDER } from "../src/lib/meta";
import { ResumeCopy } from "../src/content/resumeCopy";
import { ForestCopy } from "../src/content/forestCopy";
import { HandoffAgentCopy } from "../src/content/handoffAgentCopy";

const read = (relative: string): string =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

const screenSource: Record<ScreenId, string> = {
  [Screens.resume]: read("../src/screens/ResumeScreen.astro"),
  [Screens.forest]: read("../src/screens/ForestScreen.astro"),
  [Screens.handoffAgent]: read("../src/screens/HandoffAgentScreen.astro"),
};

/** The screens' copy lives in these modules — one `Strings.*` constant per field. */
const copySource = [
  read("../src/content/resumeCopy.ts"),
  read("../src/content/forestCopy.ts"),
  read("../src/content/handoffAgentCopy.ts"),
].join("\n");

const allSource = [
  ...Object.values(screenSource),
  copySource,
  read("../src/content/codeSamples.ts"),
  read("../src/content/rawCopy.ts"),
  read("../src/lib/meta.ts"),
].join("\n");

const pageSource = [
  read("../src/pages/index.astro"),
  read("../src/pages/resume.astro"),
  read("../src/pages/forest.astro"),
  read("../src/pages/handoffAgent.astro"),
  read("../src/pages/404.astro"),
].join("\n");

/** Flatten `Strings` into `Strings.<Namespace>.<key>` paths. */
function stringPaths(): string[] {
  const paths: string[] = [];
  for (const [namespace, entries] of Object.entries(Strings)) {
    for (const key of Object.keys(entries as Record<string, string>)) {
      paths.push(`Strings.${namespace}.${key}`);
    }
  }
  return paths;
}

describe("screens", () => {
  it("SCR-01..03 — one page per contracted screen, routed through ScreenPaths", () => {
    expect(SCREEN_ORDER).toEqual([Screens.resume, Screens.forest, Screens.handoffAgent]);
    for (const screen of Object.values(Screens)) {
      expect(SCREEN_META[screen].path).toBe(ScreenPaths[screen]);
      expect(pageSource).toContain(`Screens.${screen}`);
    }
  });

  it("never writes a screen path as a literal", () => {
    for (const path of Object.values(ScreenPaths)) {
      expect(allSource).not.toContain(`"${path}"`);
    }
    expect(allSource).toContain("ScreenPaths.forest");
    expect(allSource).toContain("ScreenPaths.handoffAgent");
    expect(allSource).toContain("ScreenPaths.resume");
  });

  it("carries no link back to the prototype files", () => {
    expect(allSource).not.toContain(".dc.html");
  });
});

describe("strings", () => {
  it("STR-001..360 — every generated key is used by a screen", () => {
    const unused = stringPaths().filter((path) => !allSource.includes(path));
    expect(unused).toEqual([]);
  });

  it("has no Korean copy inlined in a screen", () => {
    for (const [screen, source] of Object.entries(screenSource)) {
      const body = source.slice(source.indexOf("---", 3));
      expect(body.match(/[가-힣]+/g) ?? [], `inline Korean in ${screen}`).toEqual([]);
    }
  });
});

describe("copy modules", () => {
  const modules: ReadonlyArray<[ScreenId, string, Record<string, Record<string, string>>]> = [
    [Screens.resume, "ResumeCopy", ResumeCopy],
    [Screens.forest, "ForestCopy", ForestCopy],
    [Screens.handoffAgent, "HandoffAgentCopy", HandoffAgentCopy],
  ];

  it("carry only generated values — every field is a Strings.* constant", () => {
    for (const [, name, copy] of modules) {
      for (const [namespace, entries] of Object.entries(copy)) {
        const source = Strings[namespace as keyof typeof Strings] as Record<string, string>;
        for (const [key, value] of Object.entries(entries)) {
          expect(source[key], `${name}.${namespace}.${key} is not a Strings key`).toBe(value);
        }
      }
    }
  });

  it("carry no field the screen does not render", () => {
    for (const [screen, name, copy] of modules) {
      const source = screenSource[screen];
      for (const [namespace, entries] of Object.entries(copy)) {
        for (const key of Object.keys(entries)) {
          expect(source.includes(`Copy.${namespace}.${key}`), `${name}.${namespace}.${key} is unused`).toBe(true);
        }
      }
    }
  });
});

describe("tokens", () => {
  it("TOK — every token of tokens.css is reachable and no screen hard-codes one", () => {
    const tokensCss = read("../../../shared/generated/tokens.css");
    const declared = [...tokensCss.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]!);
    expect(declared).toHaveLength(14);

    const values = new Set<string>();
    const collect = (node: unknown): void => {
      if (typeof node === "string") values.add(node.toLowerCase());
      else if (node && typeof node === "object") Object.values(node).forEach(collect);
    };
    collect(DesignTokens);

    for (const source of Object.values(screenSource)) {
      const style = source.slice(source.indexOf("<style>"));
      for (const value of values) {
        // a token value may only appear through its var(--token), never spelled out
        expect(style.toLowerCase().includes(value) ? value : null, `hard-coded token value`).toBeNull();
      }
    }
  });

  it("uses the token custom properties in every screen's stylesheet", () => {
    for (const source of Object.values(screenSource)) {
      expect(source).toMatch(/var\(--(accent|ink|bg|line|card|surface|muted|hl|code-bg)\)/);
    }
  });
});
