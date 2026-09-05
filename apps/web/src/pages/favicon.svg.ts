import type { APIRoute } from "astro";
import { DesignTokens } from "@generated/DesignTokens";

/**
 * The favicon is generated from the design tokens instead of being drawn by hand,
 * so the brand mark can never drift from `DesignTokens.accent`.
 */
export const prerender = true;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img">
  <rect width="32" height="32" rx="8" fill="${DesignTokens.accent}"/>
  <path d="M11 9v14M21 9v14M11 16h10" stroke="${DesignTokens.Accent.ink}" stroke-width="3" stroke-linecap="round"/>
</svg>
`;

export const GET: APIRoute = () =>
  new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=86400",
    },
  });
