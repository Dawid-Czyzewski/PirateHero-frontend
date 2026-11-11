import { getJson } from "@/lib/api/apiClient";
import { HttpStatus, hasStatus, isSuccessful } from "@/lib/api/http";

export type CharacterStatus = "exists" | "missing" | "unavailable";

const MY_CHARACTER_PATH = "/api/me/character";

export async function fetchCharacterStatus(): Promise<CharacterStatus> {
  const result = await getJson(MY_CHARACTER_PATH);
  if (isSuccessful(result)) return "exists";
  return hasStatus(result, HttpStatus.notFound) ? "missing" : "unavailable";
}
