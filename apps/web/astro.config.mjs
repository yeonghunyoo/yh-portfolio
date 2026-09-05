// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

/** Repo root of the worktree — design/ and shared/generated/ live there and are read-only. */
const workspaceRoot = fileURLToPath(new URL("../../", import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Three static documents, one per screen in ScreenPaths. The adapter is here so the
  // views API routes can opt out of prerendering with `prerender = false`.
  output: "static",
  adapter: vercel(),
  // Absolute site URL for canonical/Open Graph tags. Set PUBLIC_SITE_URL in the
  // deployment environment; without it the page falls back to the request origin.
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
      },
    },
    // design/ and shared/ sit above the Astro root; the dev server must be allowed to read them.
    server: { fs: { allow: [workspaceRoot] } },
  },
});
