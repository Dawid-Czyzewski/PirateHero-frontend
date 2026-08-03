import { describe, expect, it } from 'vitest';
import {
  missionGoldExpAfterShip,
  missionShopBoosterRewardsForDisplay,
  type ShopBoosterSessionEntry,
} from '@/features/game/boosters/sessionShopBoosterEffects';

const entries: ShopBoosterSessionEntry[] = [];
const nowMs = Date.now();

describe('mission shop booster rewards', () => {
  it('missionGoldExpAfterShip uses base fields and ship percent like backend', () => {
    const dto = {
      id: 1,
      title: 'm',
      baseGoldReward: 100,
      baseExpReward: 200,
      bonusPercent: 10,
      goldReward: 999,
      expReward: 999,
    };
    const { goldAfterShip, expAfterShip } = missionGoldExpAfterShip(dto);
    expect(goldAfterShip).toBe(110);
    expect(expAfterShip).toBe(220);
  });

  it('missionShopBoosterRewardsForDisplay does not stack shop on API totals when base missing', () => {
    const dto = {
      id: 1,
      title: 'm',
      goldReward: 500,
      expReward: 600,
      bonusPercent: 0,
    };
    const r = missionShopBoosterRewardsForDisplay(entries, nowMs, dto);
    expect(r.boostedGold).toBe(500);
    expect(r.boostedExp).toBe(600);
    expect(r.goldBonusFlat).toBe(0);
  });
});
