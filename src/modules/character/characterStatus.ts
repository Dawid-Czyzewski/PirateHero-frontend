import { getJson } from "@/lib/api/apiClient";
import { HttpStatus, hasStatus, isSuccessful } from "@/lib/api/http";
import { MY_CHARACTER_PATH } from "@/modules/character/myCharacter";

export type CharacterStatus = "exists" | "missing" | "unavailable";

export async function fetchCharacterStatus(): Promise<CharacterStatus> {
  const result = await getJson(MY_CHARACTER_PATH);
  if (isSuccessful(result)) return "exists";
  return hasStatus(result, HttpStatus.notFound) ? "missing" : "unavailable";
}
