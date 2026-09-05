/**
 * Accessibility audit (axe-core, WCAG 2.1 A/AA) of the document, in both themes.
 * Needs a dev server, so it is not part of `npm test`:
 *
 *   node --experimental-strip-types scripts/a11y.ts
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium, type Page } from "playwright";
import { Screens, ScreenPaths } from "../../../shared/generated/Screens.ts";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env["A11Y_PORT"] ?? 4333);
const origin = `http://127.0.0.1:${port}`;

async function waitForServer(url: string, timeoutMs = 90_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* not up yet */
    }
    if (Date.now() > deadline) throw new Error(`dev server did not answer on ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function audit(page: Page, label: string): Promise<number> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  console.log(`\n${label}: ${violations.length} violation(s)`);
  for (const violation of violations) {
    console.log(`  [${violation.impact}] ${violation.id} — ${violation.help}`);
    for (const node of violation.nodes) console.log(`      ${node.target.join(" ")}`);
  }
  return violations.length;
}

const server = spawn("npx", ["astro", "dev", "--port", String(port), "--host", "127.0.0.1"], {
  cwd: appRoot,
  stdio: "inherit",
  env: { ...process.env, ASTRO_DEV_TOOLBAR: "0" },
});

let failures = 0;
try {
  await waitForServer(origin);
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${origin}${ScreenPaths[Screens.s0]}`, { waitUntil: "networkidle" });
  failures += await audit(page, "light theme");

  await page.click("[data-theme-toggle]");
  await page.waitForTimeout(400);
  failures += await audit(page, "mint theme");

  await page.goto(`${origin}/does-not-exist`, { waitUntil: "networkidle" });
  failures += await audit(page, "404 page");

  await browser.close();
} finally {
  server.kill("SIGTERM");
}

console.log(failures === 0 ? "\nno accessibility violations" : `\n${failures} violation(s)`);
process.exitCode = failures === 0 ? 0 : 1;
