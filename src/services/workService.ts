import { requestJson } from '@/lib/api/requestJson';
import { getServiceApiErrorMessage } from '@/lib/apiError';
import type { AvailableWorkDto } from '@/types/gameActivities';

export type StartWorkResult = { success: true } | { success: false; message: string };
export type CancelWorkResult = { success: true } | { success: false; message: string };

export async function requestStartWork(workId: string | number): Promise<StartWorkResult> {
  try {
    await requestJson(`/works/${workId}/start`, { method: 'POST' });
    return { success: true };
  } catch (error) {
    console.error('Unexpected error starting work:', error);
    return {
      success: false,
      message: getServiceApiErrorMessage(error, 'Unexpected error occurred.'),
    };
  }
}

export async function requestCancelWork(workId: string | number): Promise<CancelWorkResult> {
  try {
    await requestJson(`/works/${workId}/cancel`, { method: 'POST' });
    return { success: true };
  } catch (error) {
    console.error('Cancel work error:', error);
    return {
      success: false,
      message: getServiceApiErrorMessage(error, 'Failed to cancel work'),
    };
  }
}

export async function requestCompleteWork(
  workId: string | number
): Promise<{ earnedGold: number; works: AvailableWorkDto[] }> {
  const data = await requestJson<{
    earnedGold?: number;
    works?: AvailableWorkDto[];
  }>(`/works/${workId}/complete`, { method: 'POST' });
  return {
    earnedGold: data.earnedGold ?? 0,
    works: data.works ?? [],
  };
}
