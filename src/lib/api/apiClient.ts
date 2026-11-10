import { apiBaseUrl } from "@/lib/config/env";

export type ApiResponse = { kind: "response"; status: number; body: unknown };
export type ApiNetworkError = { kind: "network-error" };
export type ApiResult = ApiResponse | ApiNetworkError;

const JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function postJson(path: string, payload: unknown): Promise<ApiResult> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      method: "POST",
      credentials: "include",
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    });
  } catch {
    return { kind: "network-error" };
  }
  return { kind: "response", status: response.status, body: await readBody(response) };
}
