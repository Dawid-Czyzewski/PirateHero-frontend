import type { CharacterSheet, StatKey } from "@/modules/character/characterSheet";
import { STAMINA_SECONDS_PER_POINT, waitHint, type RegenPool } from "@/modules/character/regenPool";
import type { TrainingFailure } from "@/modules/character/trainStat";

export const TRAINING_COST = 10;

export const TRAINING_GAIN = 1;

export const TRAINING_ACTION_LABEL = `Trenuj (-${TRAINING_COST} Kondychy)`;

export const TRAINING_ERRORS: Record<TrainingFailure, string> = {
  "no-stamina": "Za mało Kondychy na trening. Odpocznij chwilę i spróbuj ponownie.",
  invalid: "Tej cechy nie da się teraz trenować. Odśwież stronę i spróbuj ponownie.",
  network: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.",
  unexpected: "Serwer ma chwilowy problem. Spróbuj ponownie za moment.",
};

export function canAffordTraining(stamina: RegenPool): boolean {
  return stamina.current >= TRAINING_COST;
}

export function trainingWaitHint(stamina: RegenPool): string | null {
  return waitHint(stamina, TRAINING_COST, STAMINA_SECONDS_PER_POINT, "Wystarczy Kondychy za");
}

function shiftTraining(character: CharacterSheet, stat: StatKey, direction: 1 | -1): CharacterSheet {
  const { stamina } = character;
  const current = stamina.current - direction * TRAINING_COST;
  const regenerating = current < stamina.max;
  return {
    ...character,
    stats: { ...character.stats, [stat]: character.stats[stat] + direction * TRAINING_GAIN },
    stamina: {
      ...stamina,
      current,
      nextPointInSeconds: regenerating ? (stamina.nextPointInSeconds ?? STAMINA_SECONDS_PER_POINT) : null,
    },
  };
}

export function applyTraining(character: CharacterSheet, stat: StatKey): CharacterSheet {
  return shiftTraining(character, stat, 1);
}

export function revertTraining(character: CharacterSheet, stat: StatKey): CharacterSheet {
  return shiftTraining(character, stat, -1);
}
