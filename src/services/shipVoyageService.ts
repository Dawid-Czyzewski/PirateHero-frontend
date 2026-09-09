import { requestJson } from '@/lib/api/requestJson';

export type ShipVoyageOffer = {
  durationSeconds: number;
  hours: number;
  goldCost: number;
  estimatedGoldPool: number;
  estimatedExpPool: number;
  estimatedShipFame: number;
};

export type ShipActiveVoyage = {
  id: number;
  durationSeconds: number;
  goldCost: number;
  enrolledCount: number;
  startedAt: string | null;
  endsAt: string | null;
  remainingSeconds: number;
  readyToComplete: boolean;
  viewerEnrolled: boolean;
};

export type ShipVoyageStatus = {
  shipId: number;
  isOwner: boolean;
  treasuryGold: number;
  missionsUpgrade: number;
  offers: ShipVoyageOffer[];
  activeVoyage: ShipActiveVoyage | null;
};

export type ShipVoyageCompleteResult = {
  rewards: {
    personalGold: number;
    personalExp: number;
    treasuryGold: number;
    shipFame: number;
    goldPool: number;
  };
  payouts: Array<{
    userId: string;
    username: string;
    gold: number;
    exp: number;
    levelUp: boolean;
  }>;
  status: ShipVoyageStatus;
  updatedShip: { gold: number; famePoints: number };
  updatedUser: {
    gold: number;
    experiencePoints: number;
    diamonds: number;
    freeSkillPointsAvailable: number;
    level: { name: string; expToNextLevel: number };
  };
};

export async function fetchShipVoyageStatus(): Promise<ShipVoyageStatus> {
  return requestJson<ShipVoyageStatus>('/ships/voyages/status', { method: 'GET' });
}

export async function startShipVoyage(durationSeconds: number): Promise<ShipVoyageStatus> {
  return requestJson<ShipVoyageStatus>('/ships/voyages/start', {
    method: 'POST',
    body: JSON.stringify({ durationSeconds }),
  });
}

export async function completeShipVoyage(): Promise<ShipVoyageCompleteResult> {
  return requestJson<ShipVoyageCompleteResult>('/ships/voyages/complete', { method: 'POST' });
}

export async function cancelShipVoyage(): Promise<{
  refundedGold: number;
  status: ShipVoyageStatus;
  updatedShip: { gold: number; famePoints: number };
}> {
  return requestJson('/ships/voyages/cancel', { method: 'POST' });
}
