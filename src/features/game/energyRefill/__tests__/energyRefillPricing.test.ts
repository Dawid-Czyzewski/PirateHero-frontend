import { describe, expect, it } from 'vitest';
import {
  computeEnergyRefillCost,
  getDisplayNextRefillCost,
  parseUserLevelNumber,
} from '@/features/game/energyRefill/energyRefillPricing';

describe('energyRefillPricing', () => {
  it('parses level and matches backend formula', () => {
    expect(parseUserLevelNumber('3')).toBe(3);
    expect(parseUserLevelNumber(undefined)).toBe(1);
    expect(computeEnergyRefillCost('3', 1)).toBe(300);
    expect(computeEnergyRefillCost('3', 2)).toBe(600);
  });

  it('getDisplayNextRefillCost falls back when API sends 0', () => {
    expect(getDisplayNextRefillCost(0, '2', 0, 2)).toBe(200);
    expect(getDisplayNextRefillCost(0, '2', 1, 1)).toBe(400);
    expect(getDisplayNextRefillCost(500, '2', 1, 1)).toBe(500);
  });
});
