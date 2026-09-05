import { describe, expect, it } from "vitest";
import { CodeSamples } from "../src/content/codeSamples";

/**
 * The `<pre>` blocks of the handoffAgent screen keep their line breaks, which the
 * contract's strings.json collapses away. This is the guard that the two never drift:
 * collapse the rendered segment and it must be the Strings entry, character for
 * character (after the format params are filled in).
 */
const collapse = (value: string): string => value.replace(/\s+/g, " ").trim();

function fill(template: string, params: Readonly<Record<string, string>>): string {
  return Object.entries(params).reduce(
    (text, [name, value]) => text.split(`{${name}}`).join(value),
    template,
  );
}

describe("code samples", () => {
  it("carries a segment for every <pre> chunk of the screen", () => {
    expect(Object.keys(CodeSamples).length).toBeGreaterThan(40);
  });

  it("renders exactly the Strings entry once whitespace is collapsed", () => {
    for (const [id, sample] of Object.entries(CodeSamples)) {
      if (sample.strings === null) continue;
      expect(collapse(sample.text), id).toBe(collapse(fill(sample.strings, sample.params)));
    }
  });

  it("keeps the line breaks the collapsed Strings entry cannot hold", () => {
    const multiline = Object.values(CodeSamples).filter((sample) => sample.text.includes("\n"));
    expect(multiline.length).toBeGreaterThan(10);
  });
});
