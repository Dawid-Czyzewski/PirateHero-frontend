import { requestJson } from '@/lib/api/requestJson';

export type BestiaryTrophyItem = {
  code: string;
  targetCount: number;
  unlocked: boolean;
  rewardClaimed: boolean;
  canClaim: boolean;
  unlockedAt: string | null;
  rewards: { gold: number; diamonds: number };
  titleRewardCode: string | null;
};

export type BestiaryTrophyStatus = {
  discoveredCount: number;
  total: number;
  trophies: BestiaryTrophyItem[];
  unclaimedCount: number;
};

export type BestiaryTrophyClaimResult = {
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
  status: BestiaryTrophyStatus;
};

export async function fetchBestiaryTrophies(): Promise<BestiaryTrophyStatus> {
  return requestJson<BestiaryTrophyStatus>('/users/bestiary/trophies', { method: 'GET' });
}

export async function claimBestiaryTrophy(code: string): Promise<BestiaryTrophyClaimResult> {
  return requestJson<BestiaryTrophyClaimResult>(`/users/bestiary/trophies/${encodeURIComponent(code)}/claim`, {
    method: 'POST',
  });
}
