import { requestJson } from '@/lib/api/requestJson';

export type DailyChallengeType = 'missions' | 'arena_wins' | 'gold_spent';

export type DailyChallengeItem = {
  slot: number;
  type: DailyChallengeType;
  targetValue: number;
  progress: number;
  complete: boolean;
  rewardClaimed: boolean;
  canClaim: boolean;
  rewards: { gold: number; exp: number };
};

export type DailyChallengeStatus = {
  date: string;
  challenges: DailyChallengeItem[];
  bonus: {
    rewards: { gold: number; diamonds: number };
    claimed: boolean;
    canClaim: boolean;
  };
  unclaimedCount: number;
};

export type DailyChallengeClaimResult = {
  rewards: { gold: number; exp?: number; diamonds?: number };
  updatedUser: {
    gold: number;
    diamonds?: number;
    experiencePoints: number;
    freeSkillPointsAvailable?: number;
    level: { name: string; expToNextLevel: number };
  };
  status: DailyChallengeStatus;
};

export async function fetchDailyChallenges(): Promise<DailyChallengeStatus> {
  return requestJson<DailyChallengeStatus>('/users/daily-challenges', { method: 'GET' });
}

export async function claimDailyChallengeSlot(slot: number): Promise<DailyChallengeClaimResult> {
  return requestJson<DailyChallengeClaimResult>('/users/daily-challenges/claim', {
    method: 'POST',
    body: { slot },
  });
}

export async function claimDailyChallengeBonus(): Promise<DailyChallengeClaimResult> {
  return requestJson<DailyChallengeClaimResult>('/users/daily-challenges/claim-bonus', {
    method: 'POST',
  });
}
