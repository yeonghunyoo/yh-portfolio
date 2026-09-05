/**
 * The contract's `StoreUnavailable` response (api/openapi.yaml → components.responses).
 * Used only by the stand-in endpoints in ./astro, i.e. when the backend package is
 * not in the checkout.
 */
export function unavailable(): Response {
  return new Response(JSON.stringify({ code: "store_unavailable", message: "views store unavailable" }), {
    status: 503,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
