import { requestJson } from '@/lib/api/requestJson';

export type WeeklyArenaFameTier = {
  tier: number;
  threshold: number;
  claimed: boolean;
  canClaim: boolean;
  rewards: { gold: number; diamonds: number };
  titleCode: string;
};

export type WeeklyArenaFameStatus = {
  weekStart: string;
  weekEnd: string;
  fameEarned: number;
  tiers: WeeklyArenaFameTier[];
  unclaimedCount: number;
};

export type WeeklyArenaFameClaimResult = {
  tier: number;
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
  status: WeeklyArenaFameStatus;
};

export async function fetchWeeklyArenaFame(): Promise<WeeklyArenaFameStatus> {
  return requestJson<WeeklyArenaFameStatus>('/users/weekly-arena-fame/status', { method: 'GET' });
}

export async function claimWeeklyArenaFameTier(tier: number): Promise<WeeklyArenaFameClaimResult> {
  return requestJson<WeeklyArenaFameClaimResult>('/users/weekly-arena-fame/claim', {
    method: 'POST',
    body: JSON.stringify({ tier }),
  });
}
