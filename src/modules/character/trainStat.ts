import { postJson } from "@/lib/api/apiClient";
import { HttpStatus, isSuccessful } from "@/lib/api/http";
import type { CharacterSheet, StatKey } from "@/modules/character/characterSheet";
import { MY_CHARACTER_PATH } from "@/modules/character/myCharacter";
import { parseCharacterSheet } from "@/modules/character/parseCharacterSheet";

export type TrainingFailure = "no-stamina" | "invalid" | "network" | "unexpected";

export type TrainStatResult =
  | { kind: "trained"; character: CharacterSheet }
  | { kind: "missing" }
  | { kind: "unauthenticated" }
  | { kind: "failure"; reason: TrainingFailure };

export const TRAINING_PATH = `${MY_CHARACTER_PATH}/training`;

const FAILURE_BY_STATUS: Partial<Record<number, TrainingFailure>> = {
  [HttpStatus.conflict]: "no-stamina",
  [HttpStatus.unprocessable]: "invalid",
};

function failure(reason: TrainingFailure): TrainStatResult {
  return { kind: "failure", reason };
}

export async function trainStat(stat: StatKey): Promise<TrainStatResult> {
  const result = await postJson(TRAINING_PATH, { stat });
  if (result.kind === "network-error") return failure("network");
  if (result.status === HttpStatus.unauthorized) return { kind: "unauthenticated" };
  if (result.status === HttpStatus.notFound) return { kind: "missing" };

  const known = FAILURE_BY_STATUS[result.status];
  if (known) return failure(known);

  const character = isSuccessful(result) ? parseCharacterSheet(result.body) : null;
  return character ? { kind: "trained", character } : failure("unexpected");
}
