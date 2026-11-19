import type { Stamina } from "@/modules/character/characterSheet";
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

export function trainingWaitHint(stamina: Stamina): string | null {
  const seconds = secondsUntilStamina(stamina, TRAINING_COST);
  if (seconds === null || seconds <= 0) return null;
  return `Wystarczy Kondychy za ${formatCountdown(seconds)}`;
}
