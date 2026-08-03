import { describe, expect, it } from 'vitest';
import {
  CLUB_MAX_UPGRADE_LEVEL,
  DEFAULT_SHIP_UPGRADE_PRICING,
  buildDefaultShipUpgradePricingMatrix,
  getNextUpgradeCosts,
} from '@/features/game/ship/shipUpgradeCosts';

describe('shipUpgradeCosts', () => {
  it('first half of skills is gold-only (level 0 → 1)', () => {
    const c = getNextUpgradeCosts('skills', 0, DEFAULT_SHIP_UPGRADE_PRICING);
    expect(c.goldCost).toBe(150);
    expect(c.diamondsCost).toBe(0);
    expect(c.newLevel).toBe(1);
  });

  it('keeps gold-only through level 25 for skills', () => {
    const c = getNextUpgradeCosts('skills', 24, DEFAULT_SHIP_UPGRADE_PRICING);
    expect(c.newLevel).toBe(25);
    expect(c.diamondsCost).toBe(0);
  });

  it('requires diamonds from level 26 for skills', () => {
    const c = getNextUpgradeCosts('skills', 25, DEFAULT_SHIP_UPGRADE_PRICING);
    expect(c.newLevel).toBe(26);
    expect(c.diamondsCost).toBe(40 + 25 * 20);
  });

  it('hull is gold-only through level 7', () => {
    expect(getNextUpgradeCosts('hull', 6, DEFAULT_SHIP_UPGRADE_PRICING).diamondsCost).toBe(0);
    expect(getNextUpgradeCosts('hull', 7, DEFAULT_SHIP_UPGRADE_PRICING).diamondsCost).toBeGreaterThan(0);
  });

  it('exports max level aligned with backend', () => {
    expect(CLUB_MAX_UPGRADE_LEVEL).toBe(50);
  });

  it('uses explicit row from custom matrix', () => {
    const m = buildDefaultShipUpgradePricingMatrix();
    const matrix = {
      ...m,
      work: m.work.map((r) => (r.level === 1 ? { level: 1, gold: 200, diamonds: 500 } : r)),
    };
    const c = getNextUpgradeCosts('work', 0, matrix);
    expect(c.goldCost).toBe(200);
    expect(c.diamondsCost).toBe(500);
  });
});
