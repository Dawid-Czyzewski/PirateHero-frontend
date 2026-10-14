import { requestJson } from '@/lib/api/requestJson';

export const COMPANION_FEED_GOLD_COST = 50;
export const COMPANION_MAX_LEVEL = 10;
export const COMPANION_UNLOCK_LEVEL = 5;

export type CompanionDto = {
  code: string;
  nameKey: string;
  descriptionKey: string;
  imageKey: string;
  unlocked: boolean;
  unlockedAt: string | null;
  level: number;
  lastFedAt: string | null;
  lastAbilityAt: string | null;
  canFeed: boolean;
  abilityReady: boolean;
  workGoldBonusPercent: number;
};

export type CompanionStatus = {
  companions: CompanionDto[];
  equippedCode: string | null;
  abilityReady: boolean;
  canFeed: boolean;
  unclaimedCount: number;
};

export type CompanionEquipResult = {
  equipped: boolean;
  equippedCode: string;
};

export type CompanionUnequipResult = {
  equipped: boolean;
  equippedCode: null;
};

export type CompanionAbilityResult = CompanionStatus & {
  missionRemaining?: number;
  message?: string;
};

export async function fetchCompanionStatus(): Promise<CompanionStatus> {
  return requestJson<CompanionStatus>('/users/companion/status', { method: 'GET' });
}

export async function feedCompanion(companionCode: string): Promise<CompanionStatus> {
  return requestJson<CompanionStatus>('/users/companion/feed', {
    method: 'POST',
    body: { companionCode },
  });
}

export async function equipCompanion(companionCode: string): Promise<CompanionEquipResult> {
  return requestJson<CompanionEquipResult>('/users/companion/equip', {
    method: 'POST',
    body: { companionCode },
  });
}

export async function unequipCompanion(): Promise<CompanionUnequipResult> {
  return requestJson<CompanionUnequipResult>('/users/companion/unequip', {
    method: 'POST',
  });
}

export async function useCompanionAbility(): Promise<CompanionAbilityResult> {
  return requestJson<CompanionAbilityResult>('/users/companion/ability', {
    method: 'POST',
  });
}
