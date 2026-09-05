/**
 * Browser smoke check for the four interactive components of the design.
 * Not part of `npm test` (it needs a dev server); run it by hand:
 *
 *   node --experimental-strip-types scripts/smoke.ts
 */
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { Screens, ScreenPaths } from "../../../shared/generated/Screens.ts";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env["SMOKE_PORT"] ?? 4332);
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

try {
  await waitForServer(origin);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}${ScreenPaths[Screens.s0]}`, { waitUntil: "networkidle" });

  // structure
  assert.equal(await page.getAttribute("html", "lang"), "ko");
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("main").count(), 1);
  for (const id of Object.values(Screens)) {
    assert.equal(await page.locator(`section#${id}`).count(), 1, `section ${id} missing`);
  }
  console.log("ok  structure — lang, one h1, one main, six sections");

  // toggleTheme
  assert.equal(await page.getAttribute("body", "data-theme"), "light");
  await page.click("[data-theme-toggle]");
  assert.equal(await page.getAttribute("body", "data-theme"), "mint");
  assert.equal(await page.textContent("[data-theme-label]"), "Mint");
  assert.equal(await page.evaluate(() => localStorage.getItem("yh-theme")), "mint");
  await page.click("[data-theme-toggle]");
  assert.equal(await page.getAttribute("body", "data-theme"), "light");
  console.log("ok  toggleTheme — light ↔ mint, label, localStorage");

  // navScrollSpy + scrollRail
  await page.locator(`#${Screens.s3}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  assert.equal(await page.getAttribute(`[data-section-link="${Screens.s3}"]`, "data-cur"), "1");
  assert.equal(await page.getAttribute(`[data-section-link="${Screens.s3}"]`, "aria-current"), "true");
  const railTransform = await page.getAttribute("[data-scroll-rail]", "style");
  assert.ok(/scaleY\(0\.[1-9]/.test(railTransform ?? ""), `rail did not advance: ${railTransform}`);
  console.log("ok  navScrollSpy + scrollRail — current section, rail progress");

  // tokGap … tokLeave
  await page.locator('[data-tok-key="gap"]').first().hover();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('[data-tok-key="gap"][data-tok="1"]').count(), 4);
  assert.equal(await page.locator('[data-tok-key="size"][data-tok="1"]').count(), 0);
  await page.mouse.move(5, 5);
  await page.locator(`#${Screens.s3}`).hover({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(150);
  console.log("ok  tokGap — the same element lights up in all four samples");

  // lightbox + escClose
  await page.locator("[data-lightbox-open]").first().click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator("[data-lightbox][open]").count(), 1);
  const zoomSrc = await page.getAttribute("[data-lightbox-image]", "src");
  assert.ok(zoomSrc && zoomSrc.length > 0, "lightbox image has no src");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  assert.equal(await page.locator("[data-lightbox][open]").count(), 0);
  console.log("ok  lightbox — opens on click, closes on Esc");

  await browser.close();
  console.log("\nall smoke checks passed");
} finally {
  server.kill("SIGTERM");
}
