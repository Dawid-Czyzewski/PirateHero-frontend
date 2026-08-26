import type { GameUserWearableItem } from '@/types/gameUser';
import type { GameItem, ItemRarity, ItemStats, SlotType } from './characterTypes';
import { resolveItemImageUrl } from './itemImages';
import { parseWearableStatisticsScalars } from './wearableItemStatisticsScalars';

function normalizeRarity(raw: string | undefined): ItemRarity {
  const r = String(raw ?? 'COMMON').toLowerCase();
  if (r === 'uncommon') {
    return 'rare';
  }
  if (r === 'common' || r === 'rare' || r === 'epic' || r === 'legendary') {
    return r;
  }
  return 'common';
}

function normalizeSlot(raw: string | undefined): SlotType | null {
  const s = String(raw ?? '').toLowerCase();
  if (
    s === 'helmet' ||
    s === 'weapon' ||
    s === 'armor' ||
    s === 'amulet' ||
    s === 'ring' ||
    s === 'boots'
  ) {
    return s;
  }
  return null;
}

function buildStatsFromWearable(w: GameUserWearableItem): ItemStats {
  const parsed = parseWearableStatisticsScalars(w.statistics);
  if (!parsed) {
    return {};
  }
  const out: ItemStats = {};
  if (parsed.strongPoints !== 0) {
    out.strength = parsed.strongPoints;
  }
  if (parsed.agilityPoints !== 0) {
    out.agility = parsed.agilityPoints;
  }
  if (parsed.healthPoints !== 0) {
    out.endurance = parsed.healthPoints;
  }
  if (parsed.intelligencePoints !== 0) {
    out.intelligence = parsed.intelligencePoints;
  }
  if (parsed.criticalChancePoints !== 0) {
    out.luck = parsed.criticalChancePoints;
  }
  return out;
}

export function mapWearableToGameItem(w: GameUserWearableItem): GameItem | null {
  const id = w.id != null ? String(w.id) : '';
  if (!id) {
    return null;
  }
  const slot = normalizeSlot(w.type);
  if (!slot) {
    return null;
  }
  const publicCode = w.publicCode ?? id;
  const nameKeyRaw = w.nameKey;
  const nameKey =
    typeof nameKeyRaw === 'string' && nameKeyRaw.trim() !== '' ? nameKeyRaw.trim() : undefined;
  const displayName = typeof w.name === 'string' && w.name.trim() !== '' ? w.name.trim() : undefined;

  return {
    id,
    publicCode,
    nameKey,
    displayName,
    slot,
    rarity: normalizeRarity(w.rarity),
    level: typeof w.level === 'number' ? w.level : 1,
    sellPrice: typeof w.price === 'number' ? w.price : 0,
    image: resolveItemImageUrl(w.imageKey),
    stats: buildStatsFromWearable(w),
    upgradeLevel: typeof w.upgradeLevel === 'number' ? w.upgradeLevel : 0,
    maxUpgradeLevel: typeof w.maxUpgradeLevel === 'number' ? w.maxUpgradeLevel : 3,
    nextUpgradeCost:
      typeof w.nextUpgradeCost === 'number'
        ? w.nextUpgradeCost
        : w.nextUpgradeCost === null
          ? null
          : null,
    specialization: typeof w.specialization === 'string' ? w.specialization : null,
    canSpecialize: w.canSpecialize === true,
    specializationCost:
      typeof w.specializationCost === 'number'
        ? w.specializationCost
        : w.specializationCost === null
          ? null
          : null,
  };
}
