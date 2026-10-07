import { requestJson } from '@/lib/api/requestJson';

export type TreasureMapStep = {
  slot: number;
  type: string;
  target: number;
  progress: number;
  complete: boolean;
  unlocked: boolean;
  current: boolean;
};

export type TreasureMapStatus = {
  weekStart: string;
  weekEnd: string;
  currentStep: number;
  completed: boolean;
  chestClaimed: boolean;
  canClaim: boolean;
  rewards: { gold: number; diamonds: number };
  steps: TreasureMapStep[];
  unclaimedCount: number;
};

export type TreasureMapClaimResult = {
  rewards: { gold: number; diamonds: number };
  item: { id: number; nameKey: string | null; rarity: string | null; type: string | null } | null;
  updatedUser: {
    gold: number;
    diamonds: number;
    experiencePoints: number;
    freeSkillPointsAvailable: number;
    level: { name: string; expToNextLevel: number };
  };
  status: TreasureMapStatus;
};

export async function fetchTreasureMap(): Promise<TreasureMapStatus> {
  return requestJson<TreasureMapStatus>('/users/treasure-map/status', { method: 'GET' });
}

export async function claimTreasureMapChest(): Promise<TreasureMapClaimResult> {
  return requestJson<TreasureMapClaimResult>('/users/treasure-map/claim', { method: 'POST' });
}
