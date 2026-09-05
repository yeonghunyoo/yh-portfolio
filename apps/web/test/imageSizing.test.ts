import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * `<Image>` from astro:assets stamps the intrinsic `width`/`height` on the element.
 * A rule that sets only `width` therefore leaves the attribute height in force, and
 * the shot renders at its full pixel height — the forest screenshots (1320x2868) came
 * out 2868px tall in production. Any rule that sizes such an image by width must say
 * `height:auto` next to it.
 */
const SCREENS = ["ForestScreen", "HandoffAgentScreen", "ResumeScreen"] as const;

function source(screen: string): string {
  return readFileSync(fileURLToPath(new URL(`../src/screens/${screen}.astro`, import.meta.url)), "utf8");
}

describe("screens that render astro:assets images", () => {
  for (const screen of SCREENS) {
    it(`${screen} keeps the intrinsic ratio of every <Image>`, () => {
      const text = source(screen);
      if (!text.includes("<Image")) return; // nothing to guard in this screen

      // Every class used on an <Image> must be sized with height:auto beside width.
      const classes = [...text.matchAll(/<Image[^>]*class=["']([^"']+)["']/g)].flatMap((m) =>
        (m[1] ?? "").split(/\s+/).filter(Boolean),
      );
      expect(classes.length).toBeGreaterThan(0);

      for (const name of new Set(classes)) {
        const rule = text.match(new RegExp(`\\.${name}\\{([^}]*)\\}`));
        expect(rule, `no CSS rule for .${name} in ${screen}`).not.toBeNull();
        const body = rule?.[1] ?? "";
        if (/(^|;)\s*width\s*:/.test(body)) {
          expect(body, `.${name} in ${screen} sizes width without height:auto`).toMatch(
            /(^|;)\s*height\s*:\s*auto/,
          );
        }
      }
    });
  }
});
