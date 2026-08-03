import type { GameUserLevel } from '@/types/gameUser';
import type { UserQuest } from '@/types/userQuests';

export type QuestClaimRewardItemDto = {
  id: number | string;
  name: string;
  imageKey?: string | null;
  type?: string | null;
  rarity?: string | null;
  price?: number;
  statistics?: {
    strongPoints?: number;
    agilityPoints?: number;
    criticalChancePoints?: number;
    intelligencePoints?: number;
    healthPoints?: number;
  } | null;
};

export type QuestClaimStorageSlotDto = {
  id?: number | string;
  slotNumber?: number;
  item: {
    id: number | string;
    name: string;
    type?: string | null;
    rarity?: string | null;
    price?: number | null;
  } | null;
};

export type QuestClaimUpdatedUserDto = {
  gold: number;
  diamonds: number;
  experiencePoints: number;
  freeSkillPointsAvailable?: number;
  level?: GameUserLevel & { id?: number };
  storage?: {
    id?: number | string;
    slots: QuestClaimStorageSlotDto[];
  };
};

export type ClaimQuestRewardData = {
  message: string;
  rewardType: string;
  rewardAmount: number;
  updatedUser: QuestClaimUpdatedUserDto;
  newLevel?: GameUserLevel & { id?: number };
  rewardItem?: QuestClaimRewardItemDto;
  nextQuest?: UserQuest;
  unclaimedCount: number;
};
