import type { FightArenaFightResult } from '@/types/fight';

export type FightArenaRootResult = FightArenaFightResult;
export type FightArenaCompletePayload = Exclude<FightArenaRootResult, { result: 'loading' }>;

export function toFightArenaCompletePayload(
  r: FightArenaRootResult | null | undefined
): FightArenaCompletePayload | null {
  if (!r || r.result === 'loading') return null;
  return r;
}
