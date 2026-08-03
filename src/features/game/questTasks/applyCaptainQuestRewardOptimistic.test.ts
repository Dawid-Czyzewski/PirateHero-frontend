import { describe, expect, it } from 'vitest';
import { applyCaptainQuestRewardOptimistic } from '@/features/game/questTasks/applyCaptainQuestRewardOptimistic';
import type { GameUser } from '@/types/gameUser';

const baseUser = {
  id: 'u1',
  gold: 100,
  diamonds: 5,
  experiencePoints: 10,
  freeSkillPointsAvailable: 0,
  level: { name: '1', expToNextLevel: 100 },
} as GameUser;

describe('applyCaptainQuestRewardOptimistic', () => {
  it('adds gold immediately', () => {
    const { updatedUser, levelUpResult } = applyCaptainQuestRewardOptimistic(baseUser, {
      type: 'gold',
      amount: 50,
    });
    expect(updatedUser.gold).toBe(150);
    expect(levelUpResult).toBeNull();
  });

  it('adds diamonds immediately', () => {
    const { updatedUser } = applyCaptainQuestRewardOptimistic(baseUser, {
      type: 'premium',
      amount: 3,
    });
    expect(updatedUser.diamonds).toBe(8);
  });

  it('adds experience and can level up', () => {
    const { updatedUser, levelUpResult } = applyCaptainQuestRewardOptimistic(baseUser, {
      type: 'experience',
      amount: 100,
    });
    expect(levelUpResult).not.toBeNull();
    expect(updatedUser.freeSkillPointsAvailable).toBe(5);
  });

  it('applies gold plus bonus experience', () => {
    const { updatedUser } = applyCaptainQuestRewardOptimistic(baseUser, {
      type: 'gold',
      amount: 20,
      bonusExperience: 5,
    });
    expect(updatedUser.gold).toBe(120);
    expect(updatedUser.experiencePoints).toBe(15);
  });

  it('skips item rewards', () => {
    const { updatedUser, levelUpResult } = applyCaptainQuestRewardOptimistic(baseUser, {
      type: 'item',
      rarity: 'rare',
      itemNameKey: 'questTasksPage.rewards.randomItem',
    });
    expect(updatedUser).toBe(baseUser);
    expect(levelUpResult).toBeNull();
  });
});
