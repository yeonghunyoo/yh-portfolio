/**
 * Structural stand-in for Astro's `APIContext` / `APIRoute`. Declared here so the
 * backend package does not depend on the web app's astro version — the exported
 * handlers still satisfy `APIRoute` when the web app imports them.
 */
export interface AstroApiContext {
  request: Request;
  params: Record<string, string | undefined>;
  locals?: { runtime?: { env?: Record<string, string | undefined> } };
}

export type AstroApiRoute = (context: AstroApiContext) => Promise<Response>;
