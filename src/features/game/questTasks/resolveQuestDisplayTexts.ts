import type { TFunction } from 'i18next';
import type { UserQuest } from '@/types/userQuests';
import { titleCodesForQuest } from './questRewardTitles';

export type QuestDisplayTexts = {
  title: string;
  description: string;
  rewardDescription: string;
  rewardTitleCodes: string[];
};

function translateOrFallback(t: TFunction, key: string, fallback: string): string {
  const translated = t(key);
  return translated === key ? fallback : translated;
}

export function resolveQuestDisplayTexts(q: UserQuest, t: TFunction): QuestDisplayTexts {
  const code = q.code?.trim();
  const fallbackTitle = String(q.title ?? '');
  const fallbackDescription = String(q.description ?? '');
  const rewardTitleCodes = titleCodesForQuest(code);

  if (!code) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      rewardDescription: '',
      rewardTitleCodes,
    };
  }

  return {
    title: translateOrFallback(t, `quests.${code}.title`, fallbackTitle),
    description: translateOrFallback(t, `quests.${code}.description`, fallbackDescription),
    rewardDescription: translateOrFallback(t, `quests.${code}.rewardDescription`, ''),
    rewardTitleCodes,
  };
}
