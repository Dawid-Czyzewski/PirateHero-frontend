import { describe, expect, it, vi } from 'vitest';
import type { TFunction } from 'i18next';
import type { UserQuest } from '@/types/userQuests';
import { resolveQuestDisplayTexts } from './resolveQuestDisplayTexts';

describe('resolveQuestDisplayTexts', () => {
  it('uses i18n keys when code is present', () => {
    const t = vi.fn((key: string, opts?: { titles?: string }) => {
      if (key === 'quests.fight_won_1.title') return 'First Victory';
      if (key === 'quests.fight_won_1.description') return 'Win one fight.';
      if (key === 'quests.fight_won_1.rewardDescription') return 'XP reward.';
      if (key === 'questTasksPage.rewardTitleLine') return `Title: ${opts?.titles ?? ''}`;
      return key;
    }) as unknown as TFunction;

    const texts = resolveQuestDisplayTexts(
      { code: 'fight_won_1', title: 'Pierwsza wygrana', description: 'Wygraj 1 walkę' } as UserQuest,
      t
    );

    expect(texts.title).toBe('First Victory');
    expect(texts.description).toBe('Win one fight.');
    expect(texts.rewardDescription).toBe('XP reward.');
    expect(texts.rewardTitleCodes).toEqual([]);
  });

  it('appends title reward for dungeon quests', () => {
    const t = vi.fn((key: string) => {
      if (key === 'quests.dungeon_krypta.title') return 'Clear Crypt';
      if (key === 'quests.dungeon_krypta.description') return 'Finish the Crypt.';
      if (key === 'quests.dungeon_krypta.rewardDescription') return 'XP for the Crypt.';
      return key;
    }) as unknown as TFunction;

    const texts = resolveQuestDisplayTexts({ code: 'dungeon_krypta' } as UserQuest, t);

    expect(texts.rewardTitleCodes).toEqual(['crypt_hunter', 'undead_slayer']);
    expect(texts.rewardDescription).toBe('XP for the Crypt.');
  });

  it('falls back to API text when code is missing', () => {
    const t = vi.fn((key: string) => key) as unknown as TFunction;
    const texts = resolveQuestDisplayTexts(
      { title: 'Fallback title', description: 'Fallback desc' } as UserQuest,
      t
    );

    expect(texts.title).toBe('Fallback title');
    expect(texts.description).toBe('Fallback desc');
    expect(texts.rewardDescription).toBe('');
    expect(texts.rewardTitleCodes).toEqual([]);
  });
});
