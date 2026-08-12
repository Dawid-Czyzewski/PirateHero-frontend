export const queryKeys = {
  currentUserRoot: () => ['currentUser'] as const,
  currentUser: (userId: string | null) =>
    [...queryKeys.currentUserRoot(), userId] as const,
  userQuests: (userId: string | null | undefined) =>
    ['userQuests', userId ?? 'none'] as const,
  dailyReward: () => ['dailyRewardStatus'] as const,
  dailyChallenges: () => ['dailyChallenges'] as const,
  unreadNotificationsCount: () => ['unreadNotificationsCount'] as const,
  dungeonProgress: () => ['dungeonProgress'] as const,
  shipNotifications: () => ['shipNotifications'] as const,
  bestiaryRoot: () => ['bestiary'] as const,
  bestiary: (userId: string | null | undefined) =>
    [...queryKeys.bestiaryRoot(), userId ?? 'none'] as const,
};
