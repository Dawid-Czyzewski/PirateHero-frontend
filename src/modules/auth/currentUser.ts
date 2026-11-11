import { getJson } from "@/lib/api/apiClient";
import { HttpStatus, hasStatus, isSuccessful } from "@/lib/api/http";

export type CurrentUser = { id: string; email: string; nick: string };

export type CurrentUserResult =
  | { kind: "authenticated"; user: CurrentUser }
  | { kind: "unauthenticated" }
  | { kind: "unavailable" };

const ME_PATH = "/api/me";

function isCurrentUser(body: unknown): body is CurrentUser {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.nick === "string"
  );
}

export async function fetchCurrentUser(): Promise<CurrentUserResult> {
  const result = await getJson(ME_PATH);
  if (isSuccessful(result) && isCurrentUser(result.body)) {
    const { id, email, nick } = result.body;
    return { kind: "authenticated", user: { id, email, nick } };
  }
  return hasStatus(result, HttpStatus.unauthorized) ? { kind: "unauthenticated" } : { kind: "unavailable" };
}
