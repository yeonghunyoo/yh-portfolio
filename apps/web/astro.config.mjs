// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

/** Repo root of the worktree — design/ and shared/generated/ live there and are read-only. */
const workspaceRoot = fileURLToPath(new URL("../../", import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Static page (screens s0–s5 are sections of one document, ScreenPaths all "/").
  // The adapter is here so the views API routes can opt out with `prerender = false`.
  output: "static",
  adapter: vercel(),
  // Absolute site URL for canonical/Open Graph tags. Set PUBLIC_SITE_URL in the
  // deployment environment; without it the page falls back to the request origin.
  site: process.env.PUBLIC_SITE_URL || undefined,
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
  vite: {
    resolve: {
      alias: {
        "@generated": fileURLToPath(new URL("../../shared/generated", import.meta.url)),
        "@design-uploads": fileURLToPath(new URL("../../design/uploads", import.meta.url)),
        "@design-fonts": fileURLToPath(new URL("../../design/fonts", import.meta.url)),
      },
    },
    // design/ and shared/ sit above the Astro root; the dev server must be allowed to read them.
    server: { fs: { allow: [workspaceRoot] } },
  },
});
