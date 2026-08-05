export const MISSION_SKIP_DIAMOND_COST_MAX = 5;

export function missionSkipDiamondCost(remainingMs: number): number {
  if (remainingMs <= 0) {
    return 0;
  }
  const remainingMinutes = Math.ceil(remainingMs / 60_000);
  return Math.min(MISSION_SKIP_DIAMOND_COST_MAX, Math.max(1, remainingMinutes));
}
