import { type ScreenId } from "@generated/Screens";
import { incrementPageViews, pageSlug } from "./apiClient";

/**
 * Count one visit of a screen — `ApiRoutes.incrementPageViews`.
 *
 * The counter is invisible in the design (no screen renders a view count), so a
 * failure must never reach the reader: the promise is swallowed. `keepalive` lets the
 * request survive a fast navigation away.
 */
export function countVisit(screen: ScreenId): void {
  void incrementPageViews(pageSlug(screen), { keepalive: true }).catch(() => undefined);
}
