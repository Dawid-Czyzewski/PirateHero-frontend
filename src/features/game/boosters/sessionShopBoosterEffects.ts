import type { ItemStats } from '@/data/gameItems';
import { CHARACTER_STAT_KEYS } from '@/features/game/character/characterSkillPoints';
import type { AvailableMissionDto } from '@/types/gameActivities';
import { getShopBoosterById, getShopBoosterCategory, type ShopBoosterCategory } from './shopBoosterCatalog';

export type ShopBoosterSessionEntry = { boosterId: string; expiresAt: number };

function parseMissionPercent(effect: string): number {
  const m = effect.match(/\+(\d+)%/);
  return m ? Number(m[1]) / 100 : 0;
}

function parseTrainingFlat(effect: string): number {
  const m = effect.match(/\+(\d+)\s*pkt treningu/);
  return m ? Number(m[1]) : 0;
}

export function parseShopBoosterTrainingFlat(effect: string): number {
  return parseTrainingFlat(effect);
}

function parseWorkPercent(effect: string): number {
  const m = effect.match(/\+(\d+)%/);
  return m ? Number(m[1]) / 100 : 0;
}

function parseSkillsPercent(effect: string): number {
  const m = effect.match(/\+(\d+)%/);
  return m ? Number(m[1]) / 100 : 0;
}

export function getActiveEntryInCategory(
  entries: ShopBoosterSessionEntry[],
  category: ShopBoosterCategory,
  nowMs: number
): ShopBoosterSessionEntry | null {
  return (
    entries.find((e) => e.expiresAt > nowMs && getShopBoosterCategory(e.boosterId) === category) ?? null
  );
}

export function getMissionShopBoosterPercent(entries: ShopBoosterSessionEntry[], nowMs: number): number {
  const e = getActiveEntryInCategory(entries, 'missions', nowMs);
  const b = e ? getShopBoosterById(e.boosterId) : undefined;
  if (!b || b.category !== 'missions') return 0;
  return parseMissionPercent(b.effect);
}

export function getTrainingShopBoosterFlatBonus(entries: ShopBoosterSessionEntry[], nowMs: number): number {
  const e = getActiveEntryInCategory(entries, 'training', nowMs);
  const b = e ? getShopBoosterById(e.boosterId) : undefined;
  if (!b || b.category !== 'training') return 0;
  return parseTrainingFlat(b.effect);
}

export function getWorkShopBoosterPercent(entries: ShopBoosterSessionEntry[], nowMs: number): number {
  const e = getActiveEntryInCategory(entries, 'work', nowMs);
  const b = e ? getShopBoosterById(e.boosterId) : undefined;
  if (!b || b.category !== 'work') return 0;
  return parseWorkPercent(b.effect);
}

export function getSkillsShopBoosterPercent(entries: ShopBoosterSessionEntry[], nowMs: number): number {
  const e = getActiveEntryInCategory(entries, 'skills', nowMs);
  const b = e ? getShopBoosterById(e.boosterId) : undefined;
  if (!b || b.category !== 'skills') return 0;
  return parseSkillsPercent(b.effect);
}

export function missionsModuleGoldExpFromApiBase(
  baseGoldRaw: number,
  baseExpRaw: number,
  pctRaw: number
): {
  goldAfterShip: number;
  expAfterShip: number;
  missionsGoldDelta: number;
  missionsExpDelta: number;
} {
  const L = Math.max(0, Number(pctRaw) || 0);
  const mult = 1 + L / 100;
  const bumpOne = (baseRaw: number) => {
    const b = Math.round(Number(baseRaw));
    if (b <= 0 || L <= 0) {
      return { after: b, deltaFromBase: 0 };
    }
    let after = Math.round(b * mult);
    if (after <= b) after = b + 1;
    return { after, deltaFromBase: after - b };
  };
  const g = bumpOne(baseGoldRaw);
  const e = bumpOne(baseExpRaw);
  return {
    goldAfterShip: g.after,
    expAfterShip: e.after,
    missionsGoldDelta: g.deltaFromBase,
    missionsExpDelta: e.deltaFromBase,
  };
}

export function missionGoldExpAfterShip(dto: AvailableMissionDto): {
  goldAfterShip: number;
  expAfterShip: number;
} {
  const baseG = dto.baseGoldReward;
  const baseE = dto.baseExpReward;
  if (
    baseG != null &&
    baseE != null &&
    Number.isFinite(Number(baseG)) &&
    Number.isFinite(Number(baseE))
  ) {
    const r = missionsModuleGoldExpFromApiBase(Number(baseG), Number(baseE), Number(dto.bonusPercent ?? 0));
    return {
      goldAfterShip: r.goldAfterShip,
      expAfterShip: r.expAfterShip,
    };
  }
  return {
    goldAfterShip: Math.round(Number(dto.goldReward ?? 0)),
    expAfterShip: Math.round(Number(dto.expReward ?? 0)),
  };
}

export function missionMissionsModuleDeltas(dto: AvailableMissionDto): {
  missionsGoldDelta: number;
  missionsExpDelta: number;
} {
  const baseG = dto.baseGoldReward;
  const baseE = dto.baseExpReward;
  if (
    baseG != null &&
    baseE != null &&
    Number.isFinite(Number(baseG)) &&
    Number.isFinite(Number(baseE))
  ) {
    const r = missionsModuleGoldExpFromApiBase(Number(baseG), Number(baseE), Number(dto.bonusPercent ?? 0));
    return { missionsGoldDelta: r.missionsGoldDelta, missionsExpDelta: r.missionsExpDelta };
  }
  return { missionsGoldDelta: 0, missionsExpDelta: 0 };
}

export function missionShopBoosterRewardsForDisplay(
  entries: ShopBoosterSessionEntry[],
  nowMs: number,
  dto: AvailableMissionDto
): { boostedGold: number; boostedExp: number; goldBonusFlat: number; expBonusFlat: number; percent: number } {
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

export function applyMissionShopBoosterToRewards(
  entries: ShopBoosterSessionEntry[],
  nowMs: number,
  goldAfterShip: number,
  expAfterShip: number
): { boostedGold: number; boostedExp: number; goldBonusFlat: number; expBonusFlat: number; percent: number } {
  const p = getMissionShopBoosterPercent(entries, nowMs);
  const goldBonusFlat = Math.floor(goldAfterShip * p);
  const expBonusFlat = Math.floor(expAfterShip * p);
  return {
    boostedGold: goldAfterShip + goldBonusFlat,
    boostedExp: expAfterShip + expBonusFlat,
    goldBonusFlat,
    expBonusFlat,
    percent: p * 100,
  };
}

export function applyWorkShopBoosterToGold(
  entries: ShopBoosterSessionEntry[],
  nowMs: number,
  baseGold: number
): { boostedGold: number; bonusFlat: number; percent: number } {
  const p = getWorkShopBoosterPercent(entries, nowMs);
  const bonusFlat = Math.floor(baseGold * p);
  return { boostedGold: baseGold + bonusFlat, bonusFlat, percent: p * 100 };
}

export function applySkillsShopBoosterToStat(
  entries: ShopBoosterSessionEntry[],
  nowMs: number,
  statBeforeBooster: number
): number {
  const p = getSkillsShopBoosterPercent(entries, nowMs);
  if (!p) return Math.floor(statBeforeBooster);
  return Math.floor(statBeforeBooster * (1 + p));
}

export function applySkillsShopBoosterToTotalStats(
  entries: ShopBoosterSessionEntry[],
  nowMs: number,
  statsBeforeBooster: Required<ItemStats>
): Required<ItemStats> {
  const out = { ...statsBeforeBooster };
  for (const key of CHARACTER_STAT_KEYS) {
    out[key] = applySkillsShopBoosterToStat(entries, nowMs, statsBeforeBooster[key]);
  }
  return out;
}

export function skillsShopBoosterBonusDelta(
  entries: ShopBoosterSessionEntry[],
  nowMs: number,
  statBeforeBooster: number
): number {
  const boosted = applySkillsShopBoosterToStat(entries, nowMs, statBeforeBooster);
  const base = Math.floor(statBeforeBooster);
  return boosted - base;
}
