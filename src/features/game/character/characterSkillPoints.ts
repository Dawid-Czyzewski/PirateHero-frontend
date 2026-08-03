import type { ItemStats } from '@/data/gameItems';

export type CharacterStatKey = keyof Required<ItemStats>;

export const CHARACTER_STAT_KEYS: CharacterStatKey[] = [
  'strength',
  'agility',
  'endurance',
  'intelligence',
  'luck',
];

export const CHARACTER_ATTRIBUTE_API_STAT: Record<CharacterStatKey, string> = {
  strength: 'STRENGTH',
  agility: 'AGILITY',
  endurance: 'ENDURANCE',
  intelligence: 'INTELLIGENCE',
  luck: 'LUCK',
};

export const CHARACTER_ATTRIBUTE_PRICE_FIELD: Record<CharacterStatKey, string> = {
  strength: 'strengthPointsPrice',
  agility: 'agilityPointsPrice',
  endurance: 'endurancePointsPrice',
  intelligence: 'intelligencePointsPrice',
  luck: 'luckPointsPrice',
};

const LEGACY_PRICE_FIELD: Partial<Record<CharacterStatKey, string>> = {
  strength: 'strongPointsPrice',
  endurance: 'healthPointsPrice',
  intelligence: 'criticalChancePointsPrice',
};

export function resolveAttributePointPrice(
  prices: Record<string, number | undefined> | null | undefined,
  key: CharacterStatKey
): number {
  const primary = CHARACTER_ATTRIBUTE_PRICE_FIELD[key];
  const legacy = LEGACY_PRICE_FIELD[key];
  const raw =
    prices?.[primary] ??
    (legacy !== undefined ? prices?.[legacy] : undefined);
  return typeof raw === 'number' && raw >= 1 ? raw : 5;
}

export const characterStatToApiValue = CHARACTER_ATTRIBUTE_API_STAT;
export const characterStatToPriceField = CHARACTER_ATTRIBUTE_PRICE_FIELD;
export const getAttributePointPrice = resolveAttributePointPrice;
