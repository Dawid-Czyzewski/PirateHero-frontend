import type { GameOutletContext } from '@/pages/game/GameOutletContext';


export type FightsPageProps = {
  onQuestsUpdated?: GameOutletContext['onQuestsUpdated'];
};

export type MissionsPageProps = {
  goBack: GameOutletContext['goBackToMenu'];
  onQuestsUpdated: GameOutletContext['onQuestsUpdated'];
};

export type QuestTasksPageProps = {
  goBack: GameOutletContext['goBackToMenu'];
  onRewardClaimed: GameOutletContext['onRewardClaimed'];
};

export type StorePageProps = {
  onQuestsUpdated?: GameOutletContext['onQuestsUpdated'];
};

export type CharacterPageProps = {
  onPreviewProfile?: (userId: string) => void;
};

export type ShipPreviewPageProps = {
  shipId: string;
  onBack: GameOutletContext['goBackToMenu'];
  onViewProfile: (userId: string) => void;
  onNavigateToShip: () => void;
  onJoinRequestCancelled?: GameOutletContext['checkUnreadNotifications'];
};

export type UserPreviewPageProps = {
  userId: string;
  onBack: GameOutletContext['goBackToMenu'];
  onViewShip: (shipId: string) => void;
};

export type StatekPageProps = {
  onViewProfile?: (userId: string) => void;
  onViewShip?: (shipId: string) => void;
  onNavigateToRanking?: () => void;
};

export type RankingPageProps = {
  onViewProfile?: (userId: string) => void;
  onViewShip?: (shipId: string) => void;
};
