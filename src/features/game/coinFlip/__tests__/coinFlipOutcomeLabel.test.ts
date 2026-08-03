import { describe, expect, it } from 'vitest';
import { coinFlipOutcomeLabel } from '@/features/game/coinFlip/coinFlipOutcomeLabel';

describe('coinFlipOutcomeLabel', () => {
  const labels = { heads: 'Orzeł', tails: 'Reszka' };

  it('maps heads', () => {
    expect(coinFlipOutcomeLabel('heads', labels)).toBe('Orzeł');
  });

  it('maps tails', () => {
    expect(coinFlipOutcomeLabel('tails', labels)).toBe('Reszka');
  });
});
