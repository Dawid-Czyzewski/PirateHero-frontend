import { Coins, Map, Package, Shield, Skull, Star, Trophy, BookOpen, Crown, Gem } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserQuest, QuestRewardItem, QuestRewardItemRandom } from '@/types/userQuests';
import type { ClaimQuestRewardData } from '@/types/questClaim';
import type { CaptainQuestCompleted, CaptainQuestReward, CaptainQuestRow } from './captainQuestTypes';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  GOLD_SPENT: Coins,
  LEVEL_UP: Star,
  FIGHTS_WON: Trophy,
  FIGHTS_LOST: Skull,
  ITEMS_COLLECTED: Package,
  RARE_ITEM_COLLECTED: Package,
  EQUIPMENT_FULL: Shield,
  RARE_EQUIPMENT_FULL: Shield,
  ALL_DUNGEONS_COMPLETED: Map,
  ALL_DUNGEONS_AND_LEVEL: Map,
  LEGENDARY_ITEM_COLLECTED: Gem,
  DUNGEON_COMPLETED: Map,
  BESTIARY_ENTRIES_DISCOVERED: BookOpen,
  EPIC_ITEM_COLLECTED: Package,
  EPIC_EQUIPMENT_FULL: Shield,
  LEGENDARY_EQUIPMENT_FULL: Crown,
  ALL_DUNGEON_TITLES_UNLOCKED: Trophy,
};

const UI_RARITIES = ['common', 'rare', 'epic', 'legendary'] as const;
type UiRarity = (typeof UI_RARITIES)[number];

function isUiRarity(value: string): value is UiRarity {
  return UI_RARITIES.some((rarity) => rarity === value);
}

function isQuestRewardItemRandom(item: QuestRewardItem): item is QuestRewardItemRandom {
  return 'rarity' in item && typeof item.rarity === 'string';
}

export function mapApiRarityToUi(rarity: string | null | undefined): UiRarity {
  const key = (rarity ?? 'rare').toLowerCase();
  return isUiRarity(key) ? key : 'rare';
}

export function mapApiQuestToReward(q: UserQuest): CaptainQuestReward {
  const amount = Number(q.rewardAmount ?? 0);
  const rewardType = q.rewardType ?? '';
  const secondaryType = q.secondaryRewardType ?? '';
  const secondaryAmount = Number(q.secondaryRewardAmount ?? 0);

  if (rewardType === 'GOLD') {
    return {
      type: 'gold',
      amount,
      bonusExperience: secondaryType === 'EXPERIENCE' && secondaryAmount > 0 ? secondaryAmount : undefined,
    };
  }
  if (rewardType === 'EXPERIENCE') {
    return { type: 'experience', amount };
  }
  if (rewardType === 'diamonds') {
    return { type: 'premium', amount };
  }
  if (rewardType === 'ITEM') {
    const rewardItem = q.rewardItem;
    if (rewardItem && isQuestRewardItemRandom(rewardItem) && rewardItem.rarity === 'RARE_OR_EPIC') {
      return {
        type: 'item',
        itemNameKey: 'questTasksPage.rewards.rareOrEpicItem',
        rarity: 'epic',
      };
    }
    return {
      type: 'item',
      itemNameKey: 'questTasksPage.rewards.randomItem',
      rarity: mapApiRarityToUi(rewardItem && isQuestRewardItemRandom(rewardItem) ? rewardItem.rarity : null),
    };
  }

  return { type: 'gold', amount: 0 };
}

export function sortActiveUserQuestsForDisplay(quests: UserQuest[]): UserQuest[] {
  return [...quests].sort((a, b) => {
    const aReady = Boolean(a.isCompleted) && !a.isRewardClaimed;
    const bReady = Boolean(b.isCompleted) && !b.isRewardClaimed;
    if (aReady === bReady) {
      return 0;
    }
    return aReady ? -1 : 1;
  });
}

export function mapUserQuestToRow(q: UserQuest): CaptainQuestRow {
  const category = q.category ?? 'GOLD_SPENT';
  return {
    id: q.id,
    title: String(q.title ?? ''),
    description: String(q.description ?? ''),
    goal: Math.max(0, Number(q.targetValue ?? 0)),
    progress: Math.max(0, Number(q.currentProgress ?? 0)),
    reward: mapApiQuestToReward(q),
    Icon: CATEGORY_ICONS[category] ?? Coins,
  };
}

export function mapUserQuestToHistoryEntry(q: UserQuest): CaptainQuestCompleted | null {
  if (!q.isCompleted || !q.isRewardClaimed) {
    return null;
  }
  const raw = q.completedAt;
  const date = raw ? new Date(String(raw).replace(' ', 'T')) : new Date();
  return {
    title: String(q.title ?? ''),
    reward: mapApiQuestToReward(q),
    date: Number.isNaN(date.getTime()) ? new Date() : date,
  };
}

export function mapClaimResponseToReward(data: ClaimQuestRewardData): CaptainQuestReward {
  const amount = Number(data.rewardAmount ?? 0);
  switch (data.rewardType) {
    case 'GOLD':
      return { type: 'gold', amount };
    case 'EXPERIENCE':
      return { type: 'experience', amount };
    case 'diamonds':
      return { type: 'premium', amount };
    case 'ITEM': {
      const item = data.rewardItem;
      if (item?.name) {
        const rawImage = item.imageKey;
        const imageKey =
          typeof rawImage === 'string'
            ? rawImage.trim() || undefined
            : rawImage != null && String(rawImage).trim()
              ? String(rawImage).trim()
              : undefined;
        return {
          type: 'item',
          itemId: item.id != null ? Number(item.id) : undefined,
          itemName: item.name,
          itemType: item.type ?? null,
          imageKey,
          rarity: mapApiRarityToUi(item.rarity ?? null),
          price: item.price !== undefined && item.price !== null ? Number(item.price) : undefined,
          statistics: item.statistics ?? null,
        };
      }
      return {
        type: 'item',
        itemNameKey: 'questTasksPage.rewards.randomItem',
        rarity: 'rare',
      };
    }
    default:
      return { type: 'gold', amount: 0 };
  }
}
