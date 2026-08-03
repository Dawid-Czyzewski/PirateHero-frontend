import { applyRewardToUser } from '@/services/questRewardService';
import type { DailyRewardEntry, DailyRewardStatus, DailyRewardType } from '@/types/dailyReward';
import type { GameUser, GameUserLevel } from '@/types/gameUser';

function toQuestRewardType(type: DailyRewardType): string {
  switch (type) {
    case 'gold':
      return 'GOLD';
    case 'diamonds':
      return 'diamonds';
    case 'experience':
      return 'EXPERIENCE';
    case 'item':
      return 'ITEM';
  }
}

export function buildOptimisticDailyRewardStatus(status: DailyRewardStatus): DailyRewardStatus {
  const claimedDay = status.currentDay;
  const nextDay = claimedDay >= status.totalDays ? 1 : claimedDay + 1;
  const nextReward = status.schedule.find((d) => d.day === nextDay);

  return {
    ...status,
    canClaim: false,
    claimedToday: true,
    currentDay: nextDay,
    highestClaimedDay: claimedDay,
    todayReward: nextReward ?? { day: nextDay, rewards: [{ type: 'gold', amount: 0 }] },
  };
}

export function applyDailyRewardEntryOptimistic(
  user: GameUser,
  reward: DailyRewardEntry
): { updatedUser: GameUser; levelUpResult: { name: string; expToNextLevel: number; excessExp: number } | null } {
  if (reward.type === 'item') {
    return { updatedUser: user, levelUpResult: null };
  }

  const { updatedUser, levelUpResult } = applyRewardToUser(
    user,
    toQuestRewardType(reward.type),
    reward.amount ?? 0
  );

  return { updatedUser, levelUpResult };
}

export function levelUpFromOptimisticExp(
  levelUpResult: { name: string; expToNextLevel: number } | null
): GameUserLevel | null {
  if (!levelUpResult) {
    return null;
  }
  return {
    name: String(levelUpResult.name),
    expToNextLevel: Number(levelUpResult.expToNextLevel ?? 100),
  };
}
