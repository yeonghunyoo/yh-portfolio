// @ts-check
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

/** Repo root of the worktree — design/ and shared/generated/ live there and are read-only. */
const workspaceRoot = fileURLToPath(new URL("../../", import.meta.url));

// The views API handlers live in the backend package at <repo>/backend (exports
// "./astro/views-index" and "./astro/views-page"). It is developed on its own branch,
// so it can be missing from a checkout of this app alone; when it is, the alias points
// at local stand-ins that answer the contract's 503 store_unavailable, and the build
// still succeeds. Nothing else in the app imports @yh/backend.
const backendSrc = fileURLToPath(new URL("../../backend/src", import.meta.url));
const backendRoot = existsSync(backendSrc)
  ? backendSrc
  : fileURLToPath(new URL("./src/lib/backend-unmounted", import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Three static documents, one per screen in ScreenPaths. The adapter is here so the
  // views API routes can opt out of prerendering with `prerender = false`.
  output: "static",
  adapter: vercel(),
  // The entry screen is the site root. The contract also names it `/resume`
  // (ScreenPaths.resume), so that path keeps working but sends the reader to the one
  // canonical home instead of serving a second copy of the same document. Written
  // literally because this file cannot import the generated constants.
  redirects: { "/resume": "/" },
  // Absolute site URL for canonical/Open Graph tags. Every page here is prerendered,
  // so this is read at build time and baked in — there is no request-time fallback.
  // PUBLIC_SITE_URL must be set in each deployed environment, or Astro's default
  // (http://localhost:4321) ends up in every canonical and og:url.
  site: process.env.PUBLIC_SITE_URL || undefined,
  trailingSlash: "ignore",
  // The dev toolbar injects its own shadow DOM; the screenshot and smoke scripts
  // switch it off with ASTRO_DEV_TOOLBAR=0 so they see only the page.
  devToolbar: { enabled: process.env.ASTRO_DEV_TOOLBAR !== "0" },
  build: { inlineStylesheets: "auto" },
  vite: {
    resolve: {
      alias: {
        "@generated": fileURLToPath(new URL("../../shared/generated", import.meta.url)),
        "@design-assets": fileURLToPath(new URL("../../design/assets", import.meta.url)),
        "@yh/backend": backendRoot,
      },
    },
    // design/ and shared/ sit above the Astro root; the dev server must be allowed to read them.
    server: { fs: { allow: [workspaceRoot] } },
  },
});
