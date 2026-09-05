import { HANDOFF_AGENT_PAGE, incrementPageViews } from "./apiClient";

/**
 * Count one visit of this page — `ApiRoutes.incrementPageViews`.
 *
 * The counter is invisible in the design (no screen renders it), so a failure must
 * never reach the reader: the promise is swallowed. `keepalive` lets the request
 * survive a fast navigation away.
 */
export function countVisit(page: string = HANDOFF_AGENT_PAGE): void {
  void incrementPageViews(page, { keepalive: true }).catch(() => undefined);
}
