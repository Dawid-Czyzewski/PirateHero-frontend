export const gameRouteImports = {
  missions: () => import('@/features/game/MissionsPage'),
  questTasks: () => import('@/features/game/QuestTasksPage'),
  store: () => import('@/features/game/StorePage'),
  character: () => import('@/features/game/CharacterPage'),
  fights: () => import('@/features/game/FightsPage'),
  dungeons: () => import('@/features/game/dungeons/DungeonsPage'),
  bestiary: () => import('@/features/game/bestiary/BestiaryPage'),
  bestiaryEntry: () => import('@/features/game/bestiary/BestiaryEntryPage'),
  ship: () => import('@/features/game/ShipPage'),
  userPreview: () => import('@/features/game/UserPreviewPage'),
  shipPreview: () => import('@/features/game/ShipPreviewPage'),
  ranking: () => import('@/features/game/RankingPage'),
  notifications: () => import('@/pages/NotificationsPage'),
  boosters: () => import('@/features/game/BoostersPage'),
  coupons: () => import('@/features/game/CouponPage'),
  coinFlip: () => import('@/features/game/CoinFlipPage'),
  premiumShop: () => import('@/features/game/PremiumShopPage'),
  settings: () => import('@/features/game/SettingsPage'),
  titles: () => import('@/features/game/TitlesPage'),
} as const;

export const eagerGameRouteImports: Array<
  (typeof gameRouteImports)[keyof typeof gameRouteImports]
> = [
  gameRouteImports.missions,
  gameRouteImports.questTasks,
  gameRouteImports.store,
  gameRouteImports.character,
  gameRouteImports.dungeons,
  gameRouteImports.bestiary,
  gameRouteImports.userPreview,
  gameRouteImports.shipPreview,
  gameRouteImports.ranking,
  gameRouteImports.notifications,
  gameRouteImports.boosters,
  gameRouteImports.coupons,
  gameRouteImports.premiumShop,
  gameRouteImports.coinFlip,
  gameRouteImports.settings,
  gameRouteImports.titles,
];

export const deferredGameRouteImports = {
  fights: gameRouteImports.fights,
  ship: gameRouteImports.ship,
} as const;

export const arenaRouteImport = deferredGameRouteImports.fights;
