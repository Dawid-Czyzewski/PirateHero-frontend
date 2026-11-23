import { isCount, isObject } from "@/lib/api/json";
import { parseAppearance, parseStats } from "@/modules/character/parseCharacterSheet";
import type { Npc } from "@/modules/combat/npc";

const SLUG = /^[a-z]+(-[a-z]+)*$/;

export function parseNpc(value: unknown): Npc | null {
  if (!isObject(value)) return null;
  const { id, nick, level, maxHp } = value;
  if (typeof id !== "string" || !SLUG.test(id) || typeof nick !== "string" || nick.trim() === "") return null;
  if (!isCount(level) || level < 1 || !isCount(maxHp) || maxHp < 1) return null;

  const stats = parseStats(value.stats);
  const look = parseAppearance(value.look);
  return stats && look ? { id, nick, level, maxHp, stats, look } : null;
}

export function parseNpcList(body: unknown): Npc[] | null {
  if (!Array.isArray(body)) return null;
  const npcs = body.map(parseNpc);
  return npcs.every((npc): npc is Npc => npc !== null) ? npcs : null;
}
