import { describe, expect, it } from 'vitest';
import {
  missionGoldExpAfterShip,
  missionMissionsModuleDeltas,
} from '@/features/game/boosters/sessionShopBoosterEffects';
import type { AvailableMissionDto } from '@/types/gameActivities';

describe('missionsModuleGoldExpAfterShip', () => {
  it('gives minimum +1 vs base when % > 0 but round leaves total unchanged', () => {
    const dto: AvailableMissionDto = {
      id: 1,
      title: 't.m',
      goldReward: 90,
      expReward: 500,
      baseGoldReward: 15,
      baseExpReward: 91,
      bonusPercent: 1,
      durationInSeconds: 300,
      energyCost: 5,
    };
    const { goldAfterShip, expAfterShip } = missionGoldExpAfterShip(dto);
    expect(goldAfterShip).toBe(16);
    expect(expAfterShip).toBe(92);
  });

  it('splits display base as afterShip minus ship delta (podstawa + statek spójne)', () => {
    const dto: AvailableMissionDto = {
      id: 3,
      title: 't',
      goldReward: 0,
      expReward: 0,
      baseGoldReward: 15,
      baseExpReward: 91,
      bonusPercent: 1,
      durationInSeconds: 300,
      energyCost: 5,
    };
    const { goldAfterShip, expAfterShip } = missionGoldExpAfterShip(dto);
    const { missionsGoldDelta, missionsExpDelta } = missionMissionsModuleDeltas(dto);
    expect(goldAfterShip - missionsGoldDelta).toBe(15);
    expect(expAfterShip - missionsExpDelta).toBe(91);
  });

  it('keeps geometric growth when rounded total already rises', () => {
    const dto: AvailableMissionDto = {
      id: 2,
      title: 't.m2',
      goldReward: 0,
      expReward: 0,
      baseGoldReward: 100,
      baseExpReward: 200,
      bonusPercent: 10,
      durationInSeconds: 300,
      energyCost: 5,
    };
    expect(missionGoldExpAfterShip(dto)).toEqual({ goldAfterShip: 110, expAfterShip: 220 });
  });
});
