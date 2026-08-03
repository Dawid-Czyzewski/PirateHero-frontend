export type WearableStatisticsScalars = {
  strongPoints: number;
  agilityPoints: number;
  healthPoints: number;
  criticalChancePoints: number;
  intelligencePoints: number;
};

function num(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function parseWearableStatisticsScalars(raw: unknown): WearableStatisticsScalars | null {
  if (raw == null || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const strongPoints = num(o.strongPoints ?? o.strong_points);
  const agilityPoints = num(o.agilityPoints ?? o.agility_points);
  const healthPoints = num(o.healthPoints ?? o.health_points);
  const criticalChancePoints = num(o.criticalChancePoints ?? o.critical_chance_points);
  const intelligencePoints = num(o.intelligencePoints ?? o.intelligence_points);
  if (
    strongPoints === 0 &&
    agilityPoints === 0 &&
    healthPoints === 0 &&
    criticalChancePoints === 0 &&
    intelligencePoints === 0
  ) {
    return null;
  }
  return { strongPoints, agilityPoints, healthPoints, criticalChancePoints, intelligencePoints };
}
