import { postJson } from "@/lib/api/apiClient";
import { HttpStatus, isSuccessful } from "@/lib/api/http";
import type { Fight } from "@/modules/combat/fight";
import { parseFight } from "@/modules/combat/parseFight";

export type FightFailure = "not-found" | "no-fight-points" | "invalid" | "network" | "unexpected";

export type FightNpcResult = { kind: "fought"; fight: Fight } | { kind: "unauthenticated" } | { kind: "failure"; reason: FightFailure };

export const FIGHTS_PATH = "/api/me/fights";

export const FIGHT_ERRORS: Record<FightFailure, string> = {
  "not-found": "Ten przeciwnik nie jest już dostępny. Wybierz innego.",
  "no-fight-points": "Za mało punktów walki. Poczekaj, aż wróci następny punkt.",
  invalid: "Nie udało się rozpocząć tej walki. Odśwież stronę i spróbuj ponownie.",
  network: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.",
  unexpected: "Serwer ma chwilowy problem. Spróbuj ponownie za moment.",
};

const FAILURE_BY_STATUS: Partial<Record<number, FightFailure>> = {
  [HttpStatus.notFound]: "not-found",
  [HttpStatus.conflict]: "no-fight-points",
  [HttpStatus.unprocessable]: "invalid",
};

function failure(reason: FightFailure): FightNpcResult {
  return { kind: "failure", reason };
}

export async function fightNpc(npcId: string): Promise<FightNpcResult> {
  const result = await postJson(FIGHTS_PATH, { npcId });
  if (result.kind === "network-error") return failure("network");
  if (result.status === HttpStatus.unauthorized) return { kind: "unauthenticated" };

  const known = FAILURE_BY_STATUS[result.status];
  if (known) return failure(known);

  const fight = isSuccessful(result) ? parseFight(result.body) : null;
  return fight ? { kind: "fought", fight } : failure("unexpected");
}
