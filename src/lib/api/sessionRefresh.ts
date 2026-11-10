import { isSuccessful, sendJson, type ApiResult } from "@/lib/api/http";
import { notifySessionExpired } from "@/lib/api/sessionEvents";

export const REFRESH_PATH = "/api/auth/refresh";

export type RefreshOutcome = "refreshed" | "expired" | "offline";

let inFlight: Promise<RefreshOutcome> | null = null;

function outcomeOf(result: ApiResult): RefreshOutcome {
  if (result.kind === "network-error") return "offline";
  return isSuccessful(result) ? "refreshed" : "expired";
}

async function runRefresh(): Promise<RefreshOutcome> {
  const outcome = outcomeOf(await sendJson("POST", REFRESH_PATH, {}));
  if (outcome === "expired") notifySessionExpired();
  return outcome;
}

export function refreshSession(): Promise<RefreshOutcome> {
  inFlight ??= runRefresh().finally(() => {
    inFlight = null;
  });
  return inFlight;
}
