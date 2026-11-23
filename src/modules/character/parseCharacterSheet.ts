import { countsOf, isCount, isObject } from "@/lib/api/json";
import { APPEARANCE_PARTS, isValidVariant, type Appearance } from "@/modules/character/appearance";
import {
  CURRENCIES,
  STATS,
  type CharacterSheet,
  type CharacterStats,
  type Experience,
  type Stamina,
} from "@/modules/character/characterSheet";

export function parseAppearance(value: unknown): Appearance | null {
  const appearance = countsOf(value, APPEARANCE_PARTS.map(({ part }) => part));
  if (!appearance) return null;
  return APPEARANCE_PARTS.every(({ part }) => isValidVariant(part, appearance[part])) ? appearance : null;
}

export function parseStats(value: unknown): CharacterStats | null {
  return countsOf(value, STATS.map(({ key }) => key));
}

function experienceOf(value: unknown): Experience | null {
  const experience = countsOf(value, ["current", "required"] as const);
  if (!experience) return null;
  return experience.required > 0 && experience.current < experience.required ? experience : null;
}

function staminaOf(value: unknown): Stamina | null {
  const stamina = countsOf(value, ["current", "max"] as const);
  if (!stamina || !isObject(value) || stamina.max === 0 || stamina.current > stamina.max) return null;
  const { nextPointInSeconds } = value;
  if (nextPointInSeconds !== null && !(isCount(nextPointInSeconds) && nextPointInSeconds > 0)) return null;
  return { ...stamina, nextPointInSeconds };
}

export function parseCharacterSheet(body: unknown): CharacterSheet | null {
  if (!isObject(body)) return null;
  const { id, nick, level, maxHp } = body;
  if (typeof id !== "string" || typeof nick !== "string" || !isCount(level) || !isCount(maxHp)) return null;

  const stats = parseStats(body.stats);
  const wallet = countsOf(body.wallet, CURRENCIES.map(({ key }) => key));
  const appearance = parseAppearance(body.appearance);
  const experience = experienceOf(body.experience);
  const stamina = staminaOf(body.stamina);
  if (!stats || !wallet || !appearance || !experience || !stamina) return null;

  return { id, nick, level, maxHp, experience, stamina, stats, wallet, appearance };
}
