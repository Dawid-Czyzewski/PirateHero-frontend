import {
  HttpStatus,
  NETWORK_ERROR,
  hasStatus,
  sendJson,
  type ApiResult,
  type HttpMethod,
} from "@/lib/api/http";
import { refreshSession, type RefreshOutcome } from "@/lib/api/sessionRefresh";

export type { ApiNetworkError, ApiResponse, ApiResult } from "@/lib/api/http";

const AUTH_PATH_PREFIX = "/api/auth/";

function canRefreshAfter(path: string, result: ApiResult): boolean {
  return hasStatus(result, HttpStatus.unauthorized) && !path.startsWith(AUTH_PATH_PREFIX);
}

function resultWithoutRetry(outcome: Exclude<RefreshOutcome, "refreshed">, unauthorized: ApiResult): ApiResult {
  return outcome === "offline" ? NETWORK_ERROR : unauthorized;
}

async function request(method: HttpMethod, path: string, body?: unknown): Promise<ApiResult> {
  const result = await sendJson(method, path, body);
  if (!canRefreshAfter(path, result)) return result;

  const outcome = await refreshSession();
  return outcome === "refreshed" ? sendJson(method, path, body) : resultWithoutRetry(outcome, result);
}

export function getJson(path: string): Promise<ApiResult> {
  return request("GET", path);
}

export function postJson(path: string, payload: unknown): Promise<ApiResult> {
  return request("POST", path, payload);
}
