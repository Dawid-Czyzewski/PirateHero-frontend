import { describe, expect, it } from 'vitest';
import type { UserQuest } from '@/types/userQuests';
import type { ClaimQuestRewardData } from '@/types/questClaim';
import {
  mapApiQuestToReward,
  mapApiRarityToUi,
  mapClaimResponseToReward,
  mapUserQuestToHistoryEntry,
  mapUserQuestToRow,
  sortActiveUserQuestsForDisplay,
} from './questApiMappers';

describe('mapApiRarityToUi', () => {
  it('normalizes rarity', () => {
    expect(mapApiRarityToUi('EPIC')).toBe('epic');
    expect(mapApiRarityToUi(undefined)).toBe('rare');
    expect(mapApiRarityToUi('UNKNOWN')).toBe('rare');
  });
});

describe('mapApiQuestToReward', () => {
  it('maps all backend reward types', () => {
    expect(mapApiQuestToReward({ rewardType: 'GOLD', rewardAmount: 10 } as UserQuest)).toEqual({
      type: 'gold',
      amount: 10,
    });
    expect(mapApiQuestToReward({ rewardType: 'EXPERIENCE', rewardAmount: 25 } as UserQuest)).toEqual({
      type: 'experience',
      amount: 25,
    });
    expect(mapApiQuestToReward({ rewardType: 'diamonds', rewardAmount: 3 } as UserQuest)).toEqual({
      type: 'premium',
      amount: 3,
    });
    expect(
      mapApiQuestToReward({
        rewardType: 'ITEM',
        rewardAmount: 1,
        rewardItem: { type: 'RANDOM_ITEM', rarity: 'RARE' },
      } as UserQuest)
    ).toEqual({
      type: 'item',
      itemNameKey: 'questTasksPage.rewards.randomItem',
      rarity: 'rare',
    });
  });
});

describe('mapUserQuestToHistoryEntry', () => {
  it('returns null unless completed and claimed', () => {
    expect(
      mapUserQuestToHistoryEntry({
        isCompleted: true,
        isRewardClaimed: false,
      } as UserQuest)
    ).toBeNull();
    const row = mapUserQuestToHistoryEntry({
      title: 'Done',
      isCompleted: true,
      isRewardClaimed: true,
      completedAt: '2025-01-10 15:30:00',
      rewardType: 'GOLD',
      rewardAmount: 5,
    } as UserQuest);
    expect(row?.title).toBe('Done');
    expect(row?.reward).toEqual({ type: 'gold', amount: 5 });
  });
});

describe('sortActiveUserQuestsForDisplay', () => {
  it('puts completed unclaimed quests first', () => {
    const quests = [
      { id: 1, title: 'In progress', isCompleted: false, isRewardClaimed: false } as UserQuest,
      { id: 2, title: 'Ready', isCompleted: true, isRewardClaimed: false } as UserQuest,
      { id: 3, title: 'Also in progress', isCompleted: false, isRewardClaimed: false } as UserQuest,
      { id: 4, title: 'Also ready', isCompleted: true, isRewardClaimed: false } as UserQuest,
    ];

    const sorted = sortActiveUserQuestsForDisplay(quests);

    expect(sorted.map((q) => q.id)).toEqual([2, 4, 1, 3]);
  });
});

describe('mapUserQuestToRow', () => {
  it('maps category to an icon', () => {
    const r = mapUserQuestToRow({
      id: 9,
      title: 'T',
      description: 'D',
      category: 'FIGHTS_WON',
      targetValue: 2,
      currentProgress: 1,
      rewardType: 'diamonds',
      rewardAmount: 1,
    } as UserQuest);
    expect(r.id).toBe(9);
    expect(r.goal).toBe(2);
    expect(r.progress).toBe(1);
    expect(r.reward.type).toBe('premium');
  });
});

describe('mapClaimResponseToReward', () => {
  it('maps item type, price and statistics from claim response', () => {
    const data = {
      rewardType: 'ITEM',
      rewardAmount: 1,
      rewardItem: {
        id: 1,
        name: 'Magic Hat',
        type: 'helmet',
        rarity: 'EPIC',
        price: 120,
        statistics: { strongPoints: 5, agilityPoints: 3, criticalChancePoints: 1, intelligencePoints: 0, healthPoints: 8 },
      },
    } as ClaimQuestRewardData;
    expect(mapClaimResponseToReward(data)).toEqual({
      type: 'item',
      itemId: 1,
      itemName: 'Magic Hat',
      itemType: 'helmet',
      rarity: 'epic',
      price: 120,
      statistics: {
        strongPoints: 5,
        agilityPoints: 3,
        criticalChancePoints: 1,
        intelligencePoints: 0,
        healthPoints: 8,
      },
    });
  });

  it('uses reward item name when present with minimal payload', () => {
    const data = {
      rewardType: 'ITEM',
      rewardAmount: 1,
      rewardItem: { id: 1, name: 'Magic Hat', rarity: 'EPIC' },
    } as ClaimQuestRewardData;
    expect(mapClaimResponseToReward(data)).toEqual({
      type: 'item',
      itemId: 1,
      itemName: 'Magic Hat',
      itemType: null,
      rarity: 'epic',
      price: undefined,
      statistics: null,
    });
  });

  it('maps imageKey from claim response when present', () => {
    const data = {
      rewardType: 'ITEM',
      rewardAmount: 1,
      rewardItem: {
        id: 2,
        name: 'Sword',
        type: 'weapon',
        rarity: 'RARE',
        imageKey: '  sword_02  ',
        price: 50,
      },
    } as ClaimQuestRewardData;
    expect(mapClaimResponseToReward(data)).toMatchObject({
      type: 'item',
      itemId: 2,
      itemName: 'Sword',
      imageKey: 'sword_02',
    });
  });
});
