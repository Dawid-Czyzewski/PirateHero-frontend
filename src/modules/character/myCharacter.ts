import { getJson } from "@/lib/api/apiClient";
import { HttpStatus, isSuccessful } from "@/lib/api/http";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { parseCharacterSheet } from "@/modules/character/parseCharacterSheet";

export type MyCharacterResult =
  | { kind: "loaded"; character: CharacterSheet }
  | { kind: "missing" }
  | { kind: "unauthenticated" }
  | { kind: "unavailable" };

export const MY_CHARACTER_PATH = "/api/me/character";

const UNAVAILABLE: MyCharacterResult = { kind: "unavailable" };

export async function fetchMyCharacter(): Promise<MyCharacterResult> {
  const result = await getJson(MY_CHARACTER_PATH);
  if (result.kind === "network-error") return UNAVAILABLE;
  if (result.status === HttpStatus.notFound) return { kind: "missing" };
  if (result.status === HttpStatus.unauthorized) return { kind: "unauthenticated" };

  const character = isSuccessful(result) ? parseCharacterSheet(result.body) : null;
  return character ? { kind: "loaded", character } : UNAVAILABLE;
}
