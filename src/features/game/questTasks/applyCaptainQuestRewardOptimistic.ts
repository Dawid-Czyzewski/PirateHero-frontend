import { applyRewardToUser } from '@/services/questRewardService';
import type { GameUser } from '@/types/gameUser';
import type { CaptainQuestReward } from './captainQuestTypes';

type LevelUpResult = {
  name: string;
  expToNextLevel: number;
  excessExp: number;
};

export function applyCaptainQuestRewardOptimistic(
  user: GameUser,
  reward: CaptainQuestReward
): { updatedUser: GameUser; levelUpResult: LevelUpResult | null } {
  if (reward.type === 'item') {
    return { updatedUser: user, levelUpResult: null };
  }

  if (reward.type === 'gold') {
    let { updatedUser, levelUpResult } = applyRewardToUser(user, 'GOLD', reward.amount) as {
      updatedUser: GameUser;
      levelUpResult: LevelUpResult | null;
    };
    if (reward.bonusExperience && reward.bonusExperience > 0) {
      const secondary = applyRewardToUser(updatedUser, 'EXPERIENCE', reward.bonusExperience) as {
        updatedUser: GameUser;
        levelUpResult: LevelUpResult | null;
      };
      updatedUser = secondary.updatedUser;
      levelUpResult = secondary.levelUpResult ?? levelUpResult;
    }
    return { updatedUser, levelUpResult };
  }

  if (reward.type === 'premium') {
    return applyRewardToUser(user, 'diamonds', reward.amount) as {
      updatedUser: GameUser;
      levelUpResult: LevelUpResult | null;
    };
  }

  return applyRewardToUser(user, 'EXPERIENCE', reward.amount) as {
    updatedUser: GameUser;
    levelUpResult: LevelUpResult | null;
  };
}

export function isItemCaptainQuestReward(reward: CaptainQuestReward): boolean {
  return reward.type === 'item';
}
