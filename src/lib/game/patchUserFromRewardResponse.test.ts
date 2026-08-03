import { describe, expect, it } from 'vitest';
import { patchUserFromRewardResponse } from './patchUserFromRewardResponse';

describe('patchUserFromRewardResponse', () => {
  it('includes free skill points when present in API payload', () => {
    const patch = patchUserFromRewardResponse({
      gold: 100,
      diamonds: 5,
      experiencePoints: 20,
      freeSkillPointsAvailable: 5,
      level: { name: '3', expToNextLevel: 200 },
    });

    expect(patch.freeSkillPointsAvailable).toBe(5);
    expect(patch.level?.name).toBe('3');
  });

  it('returns empty patch for missing payload', () => {
    expect(patchUserFromRewardResponse(undefined)).toEqual({});
  });
});
