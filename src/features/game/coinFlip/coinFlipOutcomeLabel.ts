import type { CoinFlipChoice } from '@/types/coinFlip';

export function coinFlipOutcomeLabel(
  outcome: CoinFlipChoice,
  labels: { heads: string; tails: string }
): string {
  return outcome === 'heads' ? labels.heads : labels.tails;
}
