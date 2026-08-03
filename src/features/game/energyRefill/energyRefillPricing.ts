export function parseUserLevelNumber(levelName: string | undefined): number {
  const n = parseInt(String(levelName ?? '1'), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function computeEnergyRefillCost(levelName: string | undefined, refillNumber: 1 | 2): number {
  const level = parseUserLevelNumber(levelName);
  const multiplier = refillNumber === 1 ? 1 : 2;
  return level * 100 * multiplier;
}

export function nextEnergyRefillNumber(refillsUsed: number, refillsRemaining: number): 1 | 2 | null {
  if (refillsRemaining <= 0) return null;
  const n = refillsUsed + 1;
  if (n === 1 || n === 2) return n;
  return null;
}

export function getDisplayNextRefillCost(
  apiCost: number,
  levelName: string | undefined,
  refillsUsed: number,
  refillsRemaining: number
): number {
  if (apiCost > 0) return apiCost;
  const next = nextEnergyRefillNumber(refillsUsed, refillsRemaining);
  if (next === null) return 0;
  return computeEnergyRefillCost(levelName, next);
}
