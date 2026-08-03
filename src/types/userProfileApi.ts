import type {
  AvailableMissionDto,
  AvailableTrainingListItemDto,
  AvailableWorkDto,
} from '@/types/gameActivities';
import type {
  GameUserAvailableBooster,
  GameUserBaseStatistics,
  GameUserBooster,
  GameUserCapacities,
  GameUserEquipment,
  GameUserLevel,
  GameUserShipBonuses,
  GameUserStorage,
  SessionShopBoosterEntry,
} from '@/types/gameUser';
import type { CurrentActivityDto } from '@/types/currentActivity';
import type { GameShopUserState } from '@/types/gameShopState';
import type { EquippedTitleDto } from '@/types/playerTitle';

export type UserProfileApiData = {
  id?: string | number;
  username?: string;
  avatarName?: string;
  avatar_name?: string;
  experiencePoints?: number;
  trainingPoints?: number;
  diamonds?: number;
  gold?: number;
  duelPoints?: number;
  famePoints?: number;
  energyPoints?: number;
  level?: GameUserLevel | { id?: number; name?: string; expToNextLevel?: number };
  missions?: AvailableMissionDto[];
  works?: AvailableWorkDto[];
  trainings?: AvailableTrainingListItemDto[];
  currentActivity?: CurrentActivityDto | null;
  userBaseStatistics?: GameUserBaseStatistics;
  freeSkillPointsAvailable?: number;
  userSkillPointsPrices?: Record<string, number | undefined>;
  storage?: GameUserStorage;
  userEquipment?: GameUserEquipment;
  userCapacities?: GameUserCapacities;
  userBoosters?: GameUserBooster[];
  userAvailableBoosters?: GameUserAvailableBooster[];
  shipBonuses?: GameUserShipBonuses;
  hasShip?: boolean;
  gameShop?: GameShopUserState;
  sessionShopBoosters?: SessionShopBoosterEntry[];
  equippedTitle?: EquippedTitleDto | null;
};
