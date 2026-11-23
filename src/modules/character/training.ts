import type { CharacterSheet, Stamina, StatKey } from "@/modules/character/characterSheet";
import type { TrainingFailure } from "@/modules/character/trainStat";

export const TRAINING_COST = 10;

export const STAMINA_SECONDS_PER_POINT = 180;

export const TRAINING_ACTION_LABEL = `Trenuj (-${TRAINING_COST} Kondychy)`;

export const TRAINING_ERRORS: Record<TrainingFailure, string> = {
  "no-stamina": "Za mało Kondychy na trening. Odpocznij chwilę i spróbuj ponownie.",
  invalid: "Tej cechy nie da się teraz trenować. Odśwież stronę i spróbuj ponownie.",
  network: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.",
  unexpected: "Serwer ma chwilowy problem. Spróbuj ponownie za moment.",
};

export function canAffordTraining(stamina: Stamina): boolean {
  return stamina.current >= TRAINING_COST;
}

export function secondsUntilStamina(stamina: Stamina, required: number): number | null {
  const missing = required - stamina.current;
  if (missing <= 0) return 0;
  if (stamina.nextPointInSeconds === null) return null;
  return stamina.nextPointInSeconds + (missing - 1) * STAMINA_SECONDS_PER_POINT;
}

export function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function staminaWaitHint(stamina: Stamina, required: number): string | null {
  const seconds = secondsUntilStamina(stamina, required);
  if (seconds === null || seconds <= 0) return null;
  return `Wystarczy Kondychy za ${formatCountdown(seconds)}`;
}

export function trainingWaitHint(stamina: Stamina): string | null {
  return staminaWaitHint(stamina, TRAINING_COST);
}

export const TRAINING_GAIN = 1;

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
