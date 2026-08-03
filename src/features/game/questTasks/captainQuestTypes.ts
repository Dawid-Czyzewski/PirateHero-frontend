import type { LucideIcon } from 'lucide-react';

export type CaptainQuestReward =
  | { type: 'gold'; amount: number; bonusExperience?: number }
  | { type: 'premium'; amount: number }
  | { type: 'experience'; amount: number }
  | {
      type: 'item';
      itemId?: number;
      itemNameKey?: string;
      itemName?: string;
      itemType?: string | null;
      imageKey?: string;
      rarity: 'common' | 'rare' | 'epic' | 'legendary';
      price?: number;
      statistics?: {
        strongPoints?: number;
        agilityPoints?: number;
        criticalChancePoints?: number;
        intelligencePoints?: number;
        healthPoints?: number;
      } | null;
    };

export type CaptainQuestRow = {
  id: string | number;
  title: string;
  description: string;
  rewardDescription?: string;
  rewardTitleCodes?: string[];
  goal: number;
  progress: number;
  reward: CaptainQuestReward;
  Icon: LucideIcon;
};

export type CaptainQuestCompleted = {
  title: string;
  reward: CaptainQuestReward;
  rewardDescription?: string;
  rewardTitleCodes?: string[];
  date: Date;
};
