import { calculateLevelUp } from './levelCalculationService';
import { claimQuestReward } from './questTaskService';

export const applyRewardToUser = (user, rewardType, rewardAmount) => {
  const updatedUser = { ...user };
  let levelUpResult = null;

  switch (rewardType) {
    case 'EXPERIENCE': {
      const newExp = (user.experiencePoints || 0) + rewardAmount;
      updatedUser.experiencePoints = newExp;

      levelUpResult = calculateLevelUp(user.level, user.experiencePoints || 0, rewardAmount);
      
      if (levelUpResult) {
        updatedUser.level = {
          ...user.level,
          name: levelUpResult.name,
          expToNextLevel: levelUpResult.expToNextLevel
        };
        updatedUser.experiencePoints = levelUpResult.excessExp;
        updatedUser.freeSkillPointsAvailable = (user.freeSkillPointsAvailable || 0) + 5;
      }
      break;
    }
    case 'GOLD':
      updatedUser.gold = (user.gold || 0) + rewardAmount;
      break;
    case 'diamonds':
      updatedUser.diamonds = (user.diamonds || 0) + rewardAmount;
      break;
    case 'ITEM':
      break;
    default:
      break;
  }

  return {
    updatedUser,
    levelUpResult
  };
};

export const claimReward = async (questId) => {
  return await claimQuestReward(questId);
};
