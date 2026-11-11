import { apiBaseUrl } from "@/lib/config/env";

export type HttpMethod = "GET" | "POST";

export type ApiResponse = { kind: "response"; status: number; body: unknown };
export type ApiNetworkError = { kind: "network-error" };
export type ApiResult = ApiResponse | ApiNetworkError;

export const HttpStatus = {
  unauthorized: 401,
  notFound: 404,
  conflict: 409,
  unprocessable: 422,
  tooManyRequests: 429,
} as const;

export const NETWORK_ERROR: ApiNetworkError = { kind: "network-error" };

const ACCEPT_JSON = { Accept: "application/json" } as const;
const SEND_JSON = { ...ACCEPT_JSON, "Content-Type": "application/json" } as const;

function requestInit(method: HttpMethod, body: unknown): RequestInit {
  const init: RequestInit = { method, credentials: "include" };
  if (body === undefined) return { ...init, headers: ACCEPT_JSON };
  return { ...init, headers: SEND_JSON, body: JSON.stringify(body) };
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function isSuccessful(result: ApiResult): result is ApiResponse {
  return result.kind === "response" && result.status >= 200 && result.status < 300;
}

export function hasStatus(result: ApiResult, status: number): result is ApiResponse {
  return result.kind === "response" && result.status === status;
}

export async function sendJson(method: HttpMethod, path: string, body?: unknown): Promise<ApiResult> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, requestInit(method, body));
  } catch {
    return NETWORK_ERROR;
  }
  return { kind: "response", status: response.status, body: await readBody(response) };
}
