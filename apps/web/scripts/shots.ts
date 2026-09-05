/**
 * Screenshots for the human's compare page.
 *
 * One image per contracted screen, named after `Screens.*`, written to
 * `<worktree>/.handoff/shots/<screenId>.png`. The six screens are sections of one
 * document, so each shot is the section element itself — full height, not just the
 * part that fits in the viewport.
 *
 *   node --experimental-strip-types scripts/shots.ts
 */
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { Screens, ScreenPaths, type ScreenId } from "../../../shared/generated/Screens.ts";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const shotsDir = path.resolve(appRoot, "../../.handoff/shots");
const port = Number(process.env["SHOTS_PORT"] ?? 4331);
const origin = `http://127.0.0.1:${port}`;
const VIEWPORT = { width: 1440, height: 900 };

async function waitForServer(url: string, timeoutMs = 90_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
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

try {
  await mkdir(shotsDir, { recursive: true });
  await waitForServer(origin);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });

  // The sticky header and the dev toolbar float above the page; neither belongs to a
  // section, so they are hidden while the section itself is captured.
  const hideOverlays = `header { visibility: hidden } astro-dev-toolbar { display: none }`;

  const screenIds = Object.values(Screens) as ScreenId[];
  for (const id of screenIds) {
    await page.goto(`${origin}${ScreenPaths[id]}`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: hideOverlays });
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const file = path.join(shotsDir, `${id}.png`);
    await section.screenshot({ path: file });
    console.log(`saved ${file}`);
  }

  await browser.close();
} finally {
  server.kill("SIGTERM");
}
