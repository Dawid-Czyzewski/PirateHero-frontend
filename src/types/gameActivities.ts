import type { UserQuest } from '@/types/userQuests';

export type AvailableWorkDto = {
  id: string | number;
  title: string;
  hoursCount?: number;
  baseGold?: number;
  totalGoldAfterShip?: number;
  totalGoldPreview?: number;
  bonusPercent?: number;
  shopBoosterPercent?: number;
};

export type AvailableMissionDto = {
  id: string | number;
  title: string;
  goldReward?: number;
  expReward?: number;
  baseGoldReward?: number;
  baseExpReward?: number;
  durationInSeconds?: number;
  energyCost?: number;
  bonusPercent?: number;
  shopBoosterPercent?: number;
};

export type AvailableTrainingListItemDto = {
  id: string | number;
  title: string;
  description: string;
  durationInSeconds?: number;
  trainingPointsCost?: number;
  skillPointsReward?: number;
  statType?: string | null;
};

export type MissionCompleteNewLevelDto = {
  id?: number;
  name?: string;
  expToNextLevel?: number;
};

export type MissionCompleteApiPayload = {
  missions?: AvailableMissionDto[];
  earnedGold?: number;
  earnedExp?: number;
  bonusPercent?: number;
  diamondsSpent?: number;
  newLevel?: MissionCompleteNewLevelDto | null;
  unclaimedCount?: number;
  quests?: UserQuest[];
  hasUnclaimedRewards?: boolean;
};
