import { getJson } from "@/lib/api/apiClient";
import { HttpStatus, isSuccessful } from "@/lib/api/http";
import { byLevel, type Npc } from "@/modules/combat/npc";
import { parseNpcList } from "@/modules/combat/parseNpc";

export type NpcsResult = { kind: "loaded"; npcs: Npc[] } | { kind: "unauthenticated" } | { kind: "unavailable" };

export const NPCS_PATH = "/api/npcs";

const UNAVAILABLE: NpcsResult = { kind: "unavailable" };

export async function fetchNpcs(): Promise<NpcsResult> {
  const result = await getJson(NPCS_PATH);
  if (result.kind === "network-error") return UNAVAILABLE;
  if (result.status === HttpStatus.unauthorized) return { kind: "unauthenticated" };

  const npcs = isSuccessful(result) ? parseNpcList(result.body) : null;
  return npcs ? { kind: "loaded", npcs: byLevel(npcs) } : UNAVAILABLE;
}
