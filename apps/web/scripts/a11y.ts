/**
 * Accessibility check over every contracted screen — axe-core through Playwright.
 * Navigates by `ScreenPaths.*`, so the run is tied to the same constants the app uses.
 *
 *   node --experimental-strip-types scripts/a11y.ts
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { Screens, ScreenPaths, type ScreenId } from "../../../shared/generated/Screens.ts";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env["A11Y_PORT"] ?? 4332);
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

const server = spawn("npx", ["astro", "dev", "--port", String(port), "--host", "127.0.0.1"], {
  cwd: appRoot,
  stdio: "inherit",
  env: { ...process.env, ASTRO_DEV_TOOLBAR: "0" },
});

let failures = 0;
try {
  await waitForServer(origin);
  const browser = await chromium.launch();
  // axe-core needs a context it can inject into, not the shortcut newPage().
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const id of Object.values(Screens) as ScreenId[]) {
    await page.goto(`${origin}${ScreenPaths[id]}`, { waitUntil: "networkidle" });
    // the design's entrance animations fade in over ~1.4s; measure the resting state
    await page.waitForTimeout(2000);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    console.log(`${id}: ${results.violations.length} violation(s)`);
    for (const violation of results.violations) {
      failures += 1;
      console.log(`  [${violation.impact}] ${violation.id} — ${violation.help}`);
      for (const node of violation.nodes.slice(0, 3)) console.log(`      ${node.target.join(" ")}`);
    }
  }

  await browser.close();
} finally {
  server.kill("SIGTERM");
}

process.exitCode = failures === 0 ? 0 : 1;
