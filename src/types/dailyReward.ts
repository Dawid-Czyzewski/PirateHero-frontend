import type { QuestClaimRewardItemDto } from '@/types/questClaim';

export type DailyRewardType = 'gold' | 'diamonds' | 'experience' | 'item';

export type DailyRewardEntry = {
  type: DailyRewardType;
  amount?: number;
};

export type DailyRewardDay = {
  day: number;
  rewards: DailyRewardEntry[];
};

export type DailyRewardStatus = {
  canClaim: boolean;
  claimedToday: boolean;
  currentDay: number;
  highestClaimedDay: number;
  totalDays: number;
  schedule: DailyRewardDay[];
  todayReward: DailyRewardDay;
};

export type DailyRewardClaimResult = {
  message: string;
  claimedDay: number;
  grantedRewards: DailyRewardEntry[];
  updatedUser: {
    gold: number;
    diamonds: number;
    experiencePoints: number;
    freeSkillPointsAvailable?: number;
    level?: { id: number; name: string; expToNextLevel: number };
    storage?: import('@/types/gameUser').GameUser['storage'];
  };
  newLevel?: { id: number; name: string; expToNextLevel: number };
  rewardItem?: QuestClaimRewardItemDto;
  status: DailyRewardStatus;
};
