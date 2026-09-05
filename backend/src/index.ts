/** Public surface of @yh/backend — the views API contracted in api/openapi.yaml. */
export { ApiRoutes } from "../../shared/generated/ApiRoutes.ts";
export { ScreenPaths, Screens, type ScreenId } from "../../shared/generated/Screens.ts";

export {
  KnownPages,
  knownPageSlugs,
  pageSlugForScreen,
  PAGE_SLUG_PATTERN,
  PAGE_SLUG_MAX_LENGTH,
  isValidPageSlug,
  invalidPageMessage,
  type PageSlug,
} from "./domain/slug.ts";
export { ErrorCodes, type ApiError, type ErrorCode, type PageViews, type PageViewsList } from "./domain/types.ts";

export { getPageViews, incrementPageViews, listPageViews, operationHandlers } from "./http/handlers.ts";
export type { HandlerContext, OperationId } from "./http/handlers.ts";
export { API_BASE_PATH, apiPath, compiledRoutes, handleRequest } from "./http/router.ts";
export { RATE_LIMIT_WINDOW_SECONDS, allowIncrement, clientId } from "./http/rateLimit.ts";

export { EnvKeys, createViewsStore, getViewsStore, resetViewsStoreCache, type Env } from "./store/factory.ts";
export { MemoryViewsStore } from "./store/memory.ts";
export { UpstashViewsStore, type UpstashConfig } from "./store/upstash.ts";
export { StoreUnavailableError, type ViewsStore } from "./store/port.ts";
export { counterKey, pageIndexKey, rateLimitKey } from "./store/keys.ts";
