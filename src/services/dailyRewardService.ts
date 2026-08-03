import { requestJson } from '@/lib/api/requestJson';
import type { DailyRewardClaimResult, DailyRewardStatus } from '@/types/dailyReward';

export async function fetchDailyRewardStatus(): Promise<DailyRewardStatus> {
  return requestJson<DailyRewardStatus>('/users/daily-rewards/status', { method: 'GET' });
}

export async function claimDailyReward(): Promise<DailyRewardClaimResult> {
  return requestJson<DailyRewardClaimResult>('/users/daily-rewards/claim', { method: 'POST' });
}
