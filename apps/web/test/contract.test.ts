import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DesignTokens } from "@generated/DesignTokens";
import { Strings } from "@generated/Strings";
import {
  OPENAPI_DRAFT,
  SECRET_NUDGE,
  TRANSLATION_SAMPLES,
  assertCodeSamplesMatchStrings,
} from "../src/lib/codeBlocks";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const srcRoot = path.join(appRoot, "src");
const tokensCss = fileURLToPath(new URL("../../../shared/generated/tokens.css", import.meta.url));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Comments explain the design in the designer's words; only real code counts here. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("//"))
    .join("\n");
}

const sourceFiles = walk(srcRoot);
const sourceText = sourceFiles
  .filter((file) => file.endsWith(".astro") || file.endsWith(".ts"))
  .map((file) => stripComments(readFileSync(file, "utf8")))
  .join("\n");
const styleText = sourceFiles
  .filter((file) => file.endsWith(".astro") || file.endsWith(".css"))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

describe("Strings.Shared", () => {
  it("STR-001..STR-207 · every contracted key is used by the app", () => {
    const unused = Object.keys(Strings.Shared).filter(
      (key) => !new RegExp(`\\b${key}\\b`).test(sourceText),
    );
    expect(unused).toEqual([]);
  });

  it("has the 207 keys the checklist counts", () => {
    expect(Object.keys(Strings.Shared)).toHaveLength(207);
  });

  it("never inlines a contracted string as literal copy", () => {
    // Any Korean text in the app must come through Strings.*, so no source file may
    // repeat a contracted value verbatim. The code samples are the documented
    // exception: they keep their line breaks (see codeBlocks.ts).
    const sampleText = [
      ...TRANSLATION_SAMPLES.flatMap((sample) => sample.parts.map((part) => part.text)),
      OPENAPI_DRAFT,
      SECRET_NUDGE,
    ].join("\n");

    const inlined = Object.entries(Strings.Shared)
      .filter(([, value]) => /[가-힣]/.test(value) && value.length > 6)
      .filter(([, value]) => sourceText.includes(value) && !sampleText.includes(value))
      .map(([key]) => key);

    expect(inlined).toEqual([]);
  });
});

describe("DesignTokens", () => {
  const tokenNames = readFileSync(tokensCss, "utf8")
    .split("\n")
    .map((line) => line.match(/^\s*(--[a-z-]+):/)?.[1])
    .filter((name): name is string => Boolean(name));

  it("TOK · declares the 14 contracted tokens", () => {
    expect(tokenNames).toHaveLength(14);
  });

  it("TOK · every token is consumed by the stylesheets", () => {
    const unused = tokenNames.filter((name) => !styleText.includes(`var(${name})`));
    expect(unused).toEqual([]);
  });

  it("TOK · the generated colours are never re-typed by hand", () => {
    const values = [
      DesignTokens.accent,
      DesignTokens.bg,
      DesignTokens.card,
      DesignTokens.ink,
      DesignTokens.muted,
      DesignTokens.surface,
      DesignTokens.Code.bg,
      DesignTokens.Code.ink,
      DesignTokens.Code.dim,
      DesignTokens.Accent.ink,
    ];
    const lowerStyles = styleText.toLowerCase();
    const retyped = values.filter((value) => lowerStyles.includes(value.toLowerCase()));
    expect(retyped).toEqual([]);
  });

  it("keeps hex colours out of components — only the untokenised light palette", () => {
    const offenders = sourceFiles
      .filter((file) => file.endsWith(".astro") || file.endsWith(".ts"))
      .filter((file) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(appRoot, file));
    expect(offenders).toEqual([]);
  });
});

describe("code samples", () => {
  it("collapse to exactly the contracted Strings values", () => {
    expect(() => assertCodeSamplesMatchStrings()).not.toThrow();
  });

  it("tie the same five elements together across all four samples", () => {
    const toks = TRANSLATION_SAMPLES.map((sample) =>
      sample.parts.flatMap((part) => (part.tok ? [part.tok] : [])),
    );
    expect(toks).toHaveLength(4);
    for (const sample of toks) {
      // the reading order differs per language; the set of highlighted elements does not
      expect([...sample].sort()).toEqual(["click", "color", "gap", "size", "text"]);
    }
  });

  it("keep the line breaks the contracted constants lost", () => {
    expect(SECRET_NUDGE.split("\n").length).toBeGreaterThan(5);
    expect(OPENAPI_DRAFT.split("\n").length).toBeGreaterThan(5);
    expect(Strings.Shared.wranglerTomlUiReplacewithd1).not.toContain("\n");
  });
});
