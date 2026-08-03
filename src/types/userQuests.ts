export type QuestRewardItemRandom = {
  type: 'RANDOM_ITEM';
  rarity: string;
};

export type QuestRewardItemNamed = {
  id: string | number;
  name: string;
};

export type QuestRewardItem = QuestRewardItemRandom | QuestRewardItemNamed;

export type UserQuest = {
  id: string | number;
  templateId?: string | number;
  code?: string | null;
  title?: string;
  description?: string;
  category?: string;
  romanNumber?: string;
  targetValue?: number;
  currentProgress?: number;
  progressPercentage?: number;
  isCompleted?: boolean;
  isRewardClaimed?: boolean;
  completedAt?: string | null;
  rewardType?: string;
  rewardAmount?: number;
  secondaryRewardType?: string;
  secondaryRewardAmount?: number;
  rewardItem?: QuestRewardItem | null;
};

export type UserQuestsResponse = {
  quests: UserQuest[];
  hasUnclaimedRewards?: boolean;
  unclaimedCount?: number;
};
