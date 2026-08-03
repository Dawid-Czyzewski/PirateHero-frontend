import type { UserPreviewData } from '@/types/preview';
import type { GameUser, GameUserBaseStatistics } from '@/types/gameUser';

export function userPreviewToGameUser(data: UserPreviewData): GameUser {
  const raw = data.userBaseStatistics as Record<string, number | undefined> | null | undefined;
  const userBaseStatistics: GameUserBaseStatistics | undefined = raw
    ? {
        strength: raw.strength ?? raw.strongPoints,
        agility: raw.agility ?? raw.agilityPoints,
        endurance: raw.endurance ?? raw.healthPoints,
        intelligence: raw.intelligence ?? raw.intelligencePoints,
        luck: raw.luck ?? raw.criticalChancePoints,
        strongPoints: raw.strongPoints,
        agilityPoints: raw.agilityPoints,
        healthPoints: raw.healthPoints,
        criticalChancePoints: raw.criticalChancePoints,
      }
    : undefined;

  const hasShipForBonuses =
    Boolean(data.ship) ||
    (data.shipBonuses?.skills != null && Number(data.shipBonuses.skills.level ?? 0) > 0);

  return {
    id: '',
    username: data.username,
    avatarName: data.avatarName ?? undefined,
    experiencePoints: 0,
    gold: 0,
    diamonds: 0,
    famePoints: Number(data.famePoints ?? 0),
    level: {
      name: data.level?.name ?? '1',
      expToNextLevel: 100,
    },
    userBaseStatistics,
    ship: hasShipForBonuses ? ({ hasShip: true } as GameUser['ship']) : undefined,
    shipBonuses: data.shipBonuses,
    sessionShopBoosters: data.sessionShopBoosters,
    equippedTitle: data.equippedTitle ?? null,
  };
}
