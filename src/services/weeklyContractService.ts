import { requestJson } from '@/lib/api/requestJson';

export type WeeklyContractType = 'missions' | 'arena_wins' | 'gold_spent';

export type WeeklyContractStatus = {
  weekStart: string;
  weekEnd: string;
  type: WeeklyContractType;
  targetValue: number;
  progress: number;
  complete: boolean;
  rewardClaimed: boolean;
  canClaim: boolean;
  rewards: { gold: number; diamonds: number };
  titleRewardCode: string;
  unclaimedCount: number;
};

export type WeeklyContractClaimResult = {
  rewards: { gold: number; diamonds: number };
  titleGranted: boolean;
  titleCode: string | null;
  updatedUser: {
    gold: number;
    diamonds: number;
    experiencePoints: number;
    freeSkillPointsAvailable: number;
    level: { name: string; expToNextLevel: number };
  };
  status: WeeklyContractStatus;
};

export async function fetchWeeklyContract(): Promise<WeeklyContractStatus> {
  return requestJson<WeeklyContractStatus>('/users/weekly-contracts/status', { method: 'GET' });
}

export async function claimWeeklyContract(): Promise<WeeklyContractClaimResult> {
  return requestJson<WeeklyContractClaimResult>('/users/weekly-contracts/claim', {
    method: 'POST',
  });
}
