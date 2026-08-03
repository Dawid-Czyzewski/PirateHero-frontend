import { applyShipSkillPercentToBaseStat } from '@/features/game/ship/shipBonusEffects';

function previewBaseCombatTotals(base: Record<string, unknown>) {
  const n = (v: unknown) => {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
  };
  const pick = (a: string, b: string) => (base[a] != null ? n(base[a]) : n(base[b]));
  return {
    strongPoints: pick('strongPoints', 'strength'),
    agilityPoints: pick('agilityPoints', 'agility'),
    healthPoints: pick('healthPoints', 'endurance'),
    criticalChancePoints: pick('criticalChancePoints', 'luck'),
  };
}

export const calculateTotalStats = (userData) => {
  if (!userData) return null;

  const base = (userData.userBaseStatistics || {}) as Record<string, unknown>;
  const equipmentSlots = userData.userEquipment?.userEquipmentSlots || [];
  const start = previewBaseCombatTotals(base);

  const stats = equipmentSlots.reduce(
    (acc, slot) => {
      const item = slot?.wearableItem;
      if (item?.statistics) {
        acc.strongPoints += item.statistics.strongPoints || 0;
        acc.agilityPoints += item.statistics.agilityPoints || 0;
        acc.healthPoints += item.statistics.healthPoints || 0;
        acc.criticalChancePoints += item.statistics.criticalChancePoints || 0;
      }
      return acc;
    },
    start
  );

  const clubSkills = userData.shipBonuses?.skills;
  const p = clubSkills != null ? Number(clubSkills.percent ?? clubSkills.level ?? 0) / 100 : 0;
  if (clubSkills && p > 0) {
    return {
      strongPoints: applyShipSkillPercentToBaseStat(stats.strongPoints, p),
      agilityPoints: applyShipSkillPercentToBaseStat(stats.agilityPoints, p),
      healthPoints: applyShipSkillPercentToBaseStat(stats.healthPoints, p),
      criticalChancePoints: applyShipSkillPercentToBaseStat(stats.criticalChancePoints, p),
    };
  }

  return stats;
};
