import { requestJson } from '@/lib/api/requestJson';

export type TavernDicePlayResult = {
  won: boolean;
  tied: boolean;
  playerRoll: number;
  dealerRoll: number;
  goldAfter: number;
  payoutGold: number;
};

export type TavernJobOffer = {
  id: number;
  titleKey: string;
  durationMinutes: number;
  rewardGold: number;
  rewardDiamonds: number;
  started: boolean;
  completed: boolean;
};

export type TavernActiveJob = {
  id: number;
  titleKey: string;
  durationMinutes: number;
  rewardGold: number;
  rewardDiamonds: number;
  startedAt?: string | null;
  endsAt?: string | null;
  remainingSeconds: number;
  readyToComplete: boolean;
};

export type TavernStatus = {
  offers: TavernJobOffer[];
  activeJob: TavernActiveJob | null;
  unclaimedCount: number;
};

export type TavernJobCompleteResult = {
  rewardGold: number;
  rewardDiamonds: number;
  status: TavernStatus;
};

export async function fetchTavernStatus(): Promise<TavernStatus> {
  return requestJson<TavernStatus>('/users/tavern/status', { method: 'GET' });
}

export async function playTavernDice(stake: number): Promise<TavernDicePlayResult> {
  return requestJson<TavernDicePlayResult>('/games/tavern/dice/play', {
    method: 'POST',
    body: { stake },
  });
}

export async function startTavernJob(jobId: number): Promise<TavernStatus> {
  return requestJson<TavernStatus>('/users/tavern/jobs/start', {
    method: 'POST',
    body: { jobId },
  });
}

export async function completeTavernJob(): Promise<TavernJobCompleteResult> {
  return requestJson<TavernJobCompleteResult>('/users/tavern/jobs/complete', {
    method: 'POST',
  });
}

export async function cancelTavernJob(): Promise<TavernStatus> {
  return requestJson<TavernStatus>('/users/tavern/jobs/cancel', {
    method: 'POST',
  });
}
