import { requestJson } from '@/lib/api/requestJson';
import type { CoinFlipChoice, CoinFlipPlayResponse } from '@/types/coinFlip';

export async function playCoinFlip(
  stake: number,
  choice: CoinFlipChoice
): Promise<CoinFlipPlayResponse> {
  return requestJson<CoinFlipPlayResponse>('/games/coin-flip/play', {
    method: 'POST',
    body: { stake, choice },
  });
}
