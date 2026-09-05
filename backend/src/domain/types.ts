import type { PageSlug } from "./slug.ts";

/** components.schemas.PageViews */
export interface PageViews {
  page: PageSlug;
  views: number;
}

/** components.schemas.PageViewsList */
export interface PageViewsList {
  items: PageViews[];
}

/** components.schemas.Error.code */
export const ErrorCodes = {
  invalidPage: "invalid_page",
  rateLimited: "rate_limited",
  storeUnavailable: "store_unavailable",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/** components.schemas.Error */
export interface ApiError {
  code: ErrorCode;
  message: string;
}
