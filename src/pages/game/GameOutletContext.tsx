export type GameOutletContext = {
  onQuestsUpdated: (unclaimedCountFromBackend?: number) => Promise<void>;
  onRewardClaimed: (unclaimedCountFromBackend?: number) => Promise<void>;
  checkUnreadNotifications: () => Promise<void>;
  navigateToUserPreview: (userId: string) => void;
  navigateToShipPreview: (shipId: string) => void;
  goBackToMenu: () => void;
};
