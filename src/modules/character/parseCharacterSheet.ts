import { APPEARANCE_PARTS, isValidVariant, type Appearance } from "@/modules/character/appearance";
import { CURRENCIES, STATS, type CharacterSheet } from "@/modules/character/characterSheet";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function isCount(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}

function countsOf<K extends string>(value: unknown, keys: readonly K[]): Record<K, number> | null {
  if (!isObject(value) || !keys.every((key) => isCount(value[key]))) return null;
  return Object.fromEntries(keys.map((key) => [key, value[key]])) as Record<K, number>;
}

function appearanceOf(value: unknown): Appearance | null {
  const appearance = countsOf(value, APPEARANCE_PARTS.map(({ part }) => part));
  if (!appearance) return null;
  return APPEARANCE_PARTS.every(({ part }) => isValidVariant(part, appearance[part])) ? appearance : null;
}

export function parseCharacterSheet(body: unknown): CharacterSheet | null {
  if (!isObject(body)) return null;
  const { id, nick, level, maxHp } = body;
  if (typeof id !== "string" || typeof nick !== "string" || !isCount(level) || !isCount(maxHp)) return null;

  const stats = countsOf(body.stats, STATS.map(({ key }) => key));
  const wallet = countsOf(body.wallet, CURRENCIES.map(({ key }) => key));
  const appearance = appearanceOf(body.appearance);
  if (!stats || !wallet || !appearance) return null;

  return { id, nick, level, maxHp, stats, wallet, appearance };
}
