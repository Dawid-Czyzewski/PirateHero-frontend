import type { ItemStats } from '@/data/gameItems';
import { CHARACTER_STAT_KEYS } from '@/features/game/character/characterSkillPoints';
import type { GameUser } from '@/types/gameUser';
import {
  applyMissionShopBoosterToRewards,
  missionGoldExpAfterShip,
  type ShopBoosterSessionEntry,
} from '@/features/game/boosters/sessionShopBoosterEffects';
import type { AvailableMissionDto } from '@/types/gameActivities';

export function shipSkillsPercentFromLevel(skillsLevel: number): number {
  return Math.max(0, skillsLevel) / 100;
}

export function applyShipSkillPercentToBaseStat(rawBase: number, p: number): number {
  const base = Math.floor(rawBase);
  if (p <= 0) return base;
  if (base <= 0) return base;
  const raw = base * (1 + p);
  const floored = Math.floor(raw + 1e-9);
  if (floored > base) return floored;
  if (raw > base + 1e-9) return base + 1;
  return base;
}

export function gameUserHasShip(user: GameUser | null | undefined): boolean {
  const c = user?.ship;
  return c != null && typeof c === 'object' && (c as { hasShip?: boolean }).hasShip === true;
}

export function shipSkillsLevelFromGameUser(user: GameUser | null | undefined): number {
  if (!gameUserHasShip(user)) return 0;
  return Math.max(0, Number(user?.shipBonuses?.skills?.level ?? 0));
}

export function resolveEffectiveShipSkillsLevelForUi(user: GameUser | null | undefined): number {
  return shipSkillsLevelFromGameUser(user);
}

export function applyShipSkillsToTotalStats(
  statsAfterShopBooster: Required<ItemStats>,
  skillsLevel: number
): Required<ItemStats> {
  const p = shipSkillsPercentFromLevel(skillsLevel);
  if (p <= 0) return { ...statsAfterShopBooster };
  const out = { ...statsAfterShopBooster };
  for (const key of CHARACTER_STAT_KEYS) {
    out[key] = applyShipSkillPercentToBaseStat(statsAfterShopBooster[key], p);
  }
  return out;
}

export function applyShipSkillsBonusFromEquipmentBase(
  equipmentTotalStats: Required<ItemStats>,
  statsAfterShopBooster: Required<ItemStats>,
  skillsLevel: number
): Required<ItemStats> {
  const p = shipSkillsPercentFromLevel(skillsLevel);
  if (p <= 0) return { ...statsAfterShopBooster };
  const out = { ...statsAfterShopBooster };
  for (const key of CHARACTER_STAT_KEYS) {
    const equipmentBase = Math.floor(equipmentTotalStats[key]);
    const shipDelta = applyShipSkillPercentToBaseStat(equipmentBase, p) - equipmentBase;
    out[key] = Math.floor(statsAfterShopBooster[key]) + shipDelta;
  }
  return out;
}

export function shipSkillsBonusDeltaForStat(
  statAfterShopBooster: number,
  skillsLevel: number
): number {
  const p = shipSkillsPercentFromLevel(skillsLevel);
  if (p <= 0) return 0;
  const base = Math.floor(statAfterShopBooster);
  return applyShipSkillPercentToBaseStat(statAfterShopBooster, p) - base;
}

export function shipTrainingFlatBonus(trainingLevel: number): number {
  return Math.max(0, trainingLevel);
}

export function missionRewardsWithShipAndShop(
  entries: ShopBoosterSessionEntry[],
  nowMs: number,
  dto: AvailableMissionDto
) {
  const hasExplicitBase = dto.baseGoldReward != null && dto.baseExpReward != null;
  const { goldAfterShip, expAfterShip } = missionGoldExpAfterShip(dto);
  if (!hasExplicitBase) {
    return {
      boostedGold: goldAfterShip,
      boostedExp: expAfterShip,
      goldBonusFlat: 0,
      expBonusFlat: 0,
      percent: 0,
    };
  }
  return applyMissionShopBoosterToRewards(entries, nowMs, goldAfterShip, expAfterShip);
}
