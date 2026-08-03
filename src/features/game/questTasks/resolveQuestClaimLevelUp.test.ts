import { describe, expect, it } from 'vitest';
import { resolveNewLevelForModal } from '@/features/game/questTasks/resolveQuestClaimLevelUp';
import type { ClaimQuestRewardData } from '@/types/questClaim';

describe('resolveNewLevelForModal', () => {
  it('prefers newLevel from API response', () => {
    const data = {
      message: 'ok',
      rewardType: 'EXPERIENCE',
      rewardAmount: 100,
      updatedUser: { gold: 0, diamonds: 0, experiencePoints: 10 },
      newLevel: { name: '5', expToNextLevel: 200 },
      unclaimedCount: 0,
    } as ClaimQuestRewardData;
    const out = resolveNewLevelForModal(data, null, { name: '4', expToNextLevel: 100 }, data.updatedUser);
    expect(out).toEqual({ name: '5', expToNextLevel: 200 });
  });

  it('uses pending client-side level-up from EXP when API omits newLevel', () => {
    const data = {
      message: 'ok',
      rewardType: 'EXPERIENCE',
      rewardAmount: 50,
      updatedUser: { gold: 0, diamonds: 0, experiencePoints: 5 },
      unclaimedCount: 0,
    } as ClaimQuestRewardData;
    const pending = { name: '3', expToNextLevel: 150 };
    const out = resolveNewLevelForModal(data, pending, { name: '2', expToNextLevel: 100 }, data.updatedUser);
    expect(out).toEqual(pending);
  });

  it('detects level-up from updatedUser.level vs level before claim', () => {
    const data = {
      message: 'ok',
      rewardType: 'EXPERIENCE',
      rewardAmount: 10,
      updatedUser: {
        gold: 0,
        diamonds: 0,
        experiencePoints: 20,
        level: { name: '7', expToNextLevel: 300 },
      },
      unclaimedCount: 0,
    } as ClaimQuestRewardData;
    const out = resolveNewLevelForModal(data, null, { name: '6', expToNextLevel: 200 }, data.updatedUser);
    expect(out).toEqual({ name: '7', expToNextLevel: 300 });
  });
});
