/**
 * Screenshots for the human's compare page.
 *
 * One full-page image per contracted screen, named after `Screens.*` and navigated to
 * by `ScreenPaths.*`, written to `<worktree>/.handoff/shots/<screenId>.png`.
 *
 *   node --experimental-strip-types scripts/shots.ts
 *
 * Every wait in here is bounded. A page that will not settle costs its budget and is
 * captured anyway (or reported as skipped) — the script can fail loudly, never hang.
 */
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Page } from "playwright";
import { Screens, ScreenPaths, type ScreenId } from "../../../shared/generated/Screens.ts";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const shotsDir = path.resolve(appRoot, "../../.handoff/shots");
const port = Number(process.env["SHOTS_PORT"] ?? 4331);
const origin = `http://127.0.0.1:${port}`;
const VIEWPORT = { width: 1440, height: 900 };

/** Budgets, in ms. Nothing in this script may wait longer than the sum of these. */
const SERVER_TIMEOUT_MS = 90_000;
const NAV_TIMEOUT_MS = 45_000;
const LOAD_TIMEOUT_MS = 20_000;
const SETTLE_BUDGET_MS = 20_000;
const SHOT_TIMEOUT_MS = 60_000;

/** Resolve `task`, or reject with `label` once `ms` have passed — no wait is open-ended. */
function withDeadline<T>(task: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const alarm = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} exceeded ${ms}ms`)), ms);
  });
  return Promise.race([task, alarm]).finally(() => clearTimeout(timer)) as Promise<T>;
}

async function waitForServer(url: string, timeoutMs = SERVER_TIMEOUT_MS): Promise<void> {
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

/**
 * Bring every image in and settle the page before a full-page capture.
 *
 * Astro's `<Image>` emits `loading="lazy"`. A lazy image that never enters the viewport
 * never starts its request, so `img.complete` stays false and `img.decode()` stays
 * *pending forever* — it does not reject, so it cannot be caught. Flip those images to
 * eager first, then wait on load/error events under an in-page deadline.
 */
async function settle(page: Page): Promise<void> {
  await withDeadline(
    page.evaluate(async (budgetMs: number) => {
      const deadline = Date.now() + budgetMs;
      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      for (const image of Array.from(document.querySelectorAll<HTMLImageElement>("img"))) {
        image.loading = "eager";
        image.setAttribute("decoding", "sync");
      }

      // Bound computed ONCE: it grows as images arrive, and re-reading it every
      // iteration turns the scroll pass into a moving target.
      const scroller = document.scrollingElement ?? document.documentElement;
      const bound = Math.max(scroller.scrollHeight, document.body.scrollHeight);
      const step = Math.max(200, window.innerHeight);
      for (let y = 0; y < bound && Date.now() < deadline; y += step) {
        window.scrollTo(0, y);
        await sleep(80);
      }
      window.scrollTo(0, 0);

      const settled = Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise<void>((resolve) => {
              if (image.complete) return resolve();
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
            }),
        );
      await Promise.race([Promise.all(settled), sleep(Math.max(0, deadline - Date.now()))]);
      // one more frame so the entrance animations land on their resting state
      await sleep(600);
    }, SETTLE_BUDGET_MS),
    SETTLE_BUDGET_MS + 5_000,
    "in-page settle",
  );
}

const server = spawn("npx", ["astro", "dev", "--port", String(port), "--host", "127.0.0.1"], {
  cwd: appRoot,
  stdio: "inherit",
  env: { ...process.env, ASTRO_DEV_TOOLBAR: "0" },
});

const skipped: string[] = [];

try {
  await mkdir(shotsDir, { recursive: true });
  await waitForServer(origin);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  page.setDefaultTimeout(NAV_TIMEOUT_MS);
  page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
  await page.addInitScript(() => {
    // The compare page wants the palette the design opens with, not a remembered one.
    try {
      window.localStorage.removeItem("yh-theme");
    } catch {
      /* storage disabled */
    }
  });

  for (const id of Object.values(Screens) as ScreenId[]) {
    const file = path.join(shotsDir, `${id}.png`);
    try {
      await withDeadline(
        (async () => {
          await page.goto(`${origin}${ScreenPaths[id]}`, {
            waitUntil: "domcontentloaded",
            timeout: NAV_TIMEOUT_MS,
          });
          await page.waitForLoadState("load", { timeout: LOAD_TIMEOUT_MS }).catch(() => {
            console.warn(`${id}: load event did not fire within ${LOAD_TIMEOUT_MS}ms — capturing anyway`);
          });
          await page.addStyleTag({ content: "astro-dev-toolbar { display: none }" });
          await settle(page).catch((error: unknown) => {
            console.warn(`${id}: ${String(error)} — capturing anyway`);
          });
          await page.screenshot({ path: file, fullPage: true, timeout: NAV_TIMEOUT_MS });
        })(),
        SHOT_TIMEOUT_MS,
        `screenshot of ${id}`,
      );
      console.log(`saved ${file}`);
    } catch (error) {
      skipped.push(`${id}: ${String(error)}`);
      console.error(`FAILED ${id}: ${String(error)}`);
    }
  }

  await browser.close();
} finally {
  server.kill("SIGTERM");
}

if (skipped.length > 0) {
  console.error(`SHOTS FAILED (${skipped.length}): ${skipped.join(" | ")}`);
  process.exitCode = 1;
} else {
  console.log("SHOTS DONE");
}

// The dev server is a child process with inherited stdio; if SIGTERM leaves anything
// holding the event loop, this ends the run rather than letting it sit forever.
setTimeout(() => process.exit(process.exitCode ?? 0), 3_000);
