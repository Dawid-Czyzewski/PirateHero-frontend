import { postJson } from "@/lib/api/apiClient";
import { HttpStatus, isSuccessful } from "@/lib/api/http";
import { violationsOf } from "@/lib/api/violations";
import { APPEARANCE_PARTS, type Appearance, type AppearancePart } from "@/modules/character/appearance";

export type AppearanceErrors = Partial<Record<AppearancePart, string>>;

export type CreateCharacterFailure = "network" | "unexpected";

export type CreateCharacterResult =
  | { kind: "created" }
  | { kind: "exists" }
  | { kind: "invalid"; errors: AppearanceErrors }
  | { kind: "failure"; reason: CreateCharacterFailure };

const CHARACTERS_PATH = "/api/characters";

const PART_LABELS = new Map<string, string>(APPEARANCE_PARTS.map(({ part, label }) => [part, label]));

function isAppearancePart(value: string): value is AppearancePart {
  return PART_LABELS.has(value);
}

function appearanceErrorsFrom(body: unknown): AppearanceErrors {
  const errors: AppearanceErrors = {};
  for (const { propertyPath } of violationsOf(body)) {
    if (isAppearancePart(propertyPath) && !errors[propertyPath]) {
      errors[propertyPath] = `${PART_LABELS.get(propertyPath)}: wybierz poprawny wariant.`;
    }
  }
  return errors;
}

const UNEXPECTED: CreateCharacterResult = { kind: "failure", reason: "unexpected" };

function invalidFrom(body: unknown): CreateCharacterResult {
  const errors = appearanceErrorsFrom(body);
  return Object.keys(errors).length > 0 ? { kind: "invalid", errors } : UNEXPECTED;
}

export async function createCharacter(appearance: Appearance): Promise<CreateCharacterResult> {
  const result = await postJson(CHARACTERS_PATH, appearance);
  if (result.kind === "network-error") return { kind: "failure", reason: "network" };
  if (result.status === HttpStatus.conflict) return { kind: "exists" };
  if (result.status === HttpStatus.unprocessable) return invalidFrom(result.body);
  return isSuccessful(result) ? { kind: "created" } : UNEXPECTED;
}
