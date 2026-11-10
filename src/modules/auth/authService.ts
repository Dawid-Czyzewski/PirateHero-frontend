import { postJson, type ApiResult } from "@/lib/api/apiClient";
import { HttpStatus, hasStatus, isSuccessful } from "@/lib/api/http";
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
const LOGOUT_PATH = "/api/auth/logout";

const SUCCESS = { kind: "success" } as const;

function failure(reason: AuthFailure): AuthResult<never> {
  return { kind: "failure", reason };
}

function failureOf(result: ApiResult): AuthResult<never> {
  if (result.kind === "network-error") return failure("network");
  if (result.status === HttpStatus.unauthorized) return failure("bad-credentials");
  if (result.status === HttpStatus.tooManyRequests) return failure("throttled");
  return failure("unexpected");
}

function invalidOrFailure(result: ApiResult): AuthResult {
  if (hasStatus(result, HttpStatus.unprocessable)) {
    const errors = fieldErrorsFrom(result.body);
    if (Object.keys(errors).length > 0) return { kind: "invalid", errors };
  }
  return failureOf(result);
}

export async function login(credentials: Credentials): Promise<AuthResult<never>> {
  const result = await postJson(LOGIN_PATH, credentials);
  return isSuccessful(result) ? SUCCESS : failureOf(result);
}

export async function registerAndLogin(registration: Registration): Promise<AuthResult> {
  const result = await postJson(REGISTER_PATH, registration);
  if (isSuccessful(result)) {
    return login({ email: registration.email, password: registration.password });
  }
  return invalidOrFailure(result);
}

export async function logout(): Promise<void> {
  await postJson(LOGOUT_PATH, {});
}
