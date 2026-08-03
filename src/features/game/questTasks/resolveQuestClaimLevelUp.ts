import type { GameUserLevel } from '@/types/gameUser';

type LevelUpModalResponse = {
  newLevel?: GameUserLevel & { id?: number };
};

function levelNumber(level: GameUserLevel | undefined): number {
  const n = parseInt(String(level?.name ?? '1'), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function resolveNewLevelForModal(
  responseData: LevelUpModalResponse,
  pendingFromExpReward: GameUserLevel | null,
  levelBeforeClaim: GameUserLevel | undefined,
  updatedUserPayload: { level?: GameUserLevel } | null | undefined
): GameUserLevel | null {
  if (responseData.newLevel) {
    const l = responseData.newLevel;
    return {
      name: String(l.name),
      expToNextLevel: Number(l.expToNextLevel ?? 100),
    };
  }
  if (pendingFromExpReward) {
    return pendingFromExpReward;
  }
  const serverLevel = updatedUserPayload?.level;
  if (serverLevel && levelBeforeClaim && levelNumber(serverLevel) > levelNumber(levelBeforeClaim)) {
    return {
      name: String(serverLevel.name),
      expToNextLevel: Number(serverLevel.expToNextLevel ?? 100),
    };
  }
  return null;
}
