import { postJson, type ApiResult } from "@/lib/api/apiClient";
import type { FieldErrors } from "@/modules/auth/validation";
import { fieldErrorsFrom, type AuthField } from "@/modules/auth/violations";

export type Credentials = { email: string; password: string };
export type Registration = Credentials & { nick: string };

export type AuthFailure = "bad-credentials" | "throttled" | "network" | "unexpected";

export type AuthResult<K extends string = AuthField> =
  | { kind: "success" }
  | { kind: "invalid"; errors: FieldErrors<K> }
  | { kind: "failure"; reason: AuthFailure };

const LOGIN_PATH = "/api/auth/login";
const REGISTER_PATH = "/api/auth/register";

const HTTP_UNAUTHORIZED = 401;
const HTTP_UNPROCESSABLE = 422;
const HTTP_TOO_MANY_REQUESTS = 429;

const SUCCESS = { kind: "success" } as const;

function failure(reason: AuthFailure): AuthResult<never> {
  return { kind: "failure", reason };
}

function isSuccessful(status: number): boolean {
  return status >= 200 && status < 300;
}

function failureOf(result: ApiResult): AuthResult<never> {
  if (result.kind === "network-error") return failure("network");
  if (result.status === HTTP_UNAUTHORIZED) return failure("bad-credentials");
  if (result.status === HTTP_TOO_MANY_REQUESTS) return failure("throttled");
  return failure("unexpected");
}

function invalidOrFailure(result: ApiResult): AuthResult {
  if (result.kind === "response" && result.status === HTTP_UNPROCESSABLE) {
    const errors = fieldErrorsFrom(result.body);
    if (Object.keys(errors).length > 0) return { kind: "invalid", errors };
  }
  return failureOf(result);
}

export async function login(credentials: Credentials): Promise<AuthResult<never>> {
  const result = await postJson(LOGIN_PATH, credentials);
  return result.kind === "response" && isSuccessful(result.status) ? SUCCESS : failureOf(result);
}

export async function registerAndLogin(registration: Registration): Promise<AuthResult> {
  const result = await postJson(REGISTER_PATH, registration);
  if (result.kind === "response" && isSuccessful(result.status)) {
    return login({ email: registration.email, password: registration.password });
  }
  return invalidOrFailure(result);
}
