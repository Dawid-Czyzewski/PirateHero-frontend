import type {
  AvailableMissionDto,
  AvailableTrainingListItemDto,
  AvailableWorkDto,
} from '@/types/gameActivities';
import type { CurrentActivityDto } from '@/types/currentActivity';
import type { WearableItemSummaryDto } from '@/types/inventory';
import type { GameShopUserState } from '@/types/gameShopState';
import type { EquippedTitleDto } from '@/types/playerTitle';

export type GameUserLevel = {
  name: string;
  expToNextLevel: number;
};

export type GameUserWearableStatistics = {
  strongPoints?: number;
  agilityPoints?: number;
  healthPoints?: number;
  criticalChancePoints?: number;
  intelligencePoints?: number;
};


export type GameUserWearableItem = WearableItemSummaryDto & {
  statistics?: GameUserWearableStatistics;
};

export type GameUserStorageSlot = {
  
  id?: number | string;
  slotNumber?: number;
  item?: GameUserWearableItem | null;
  wearableItem?: GameUserWearableItem | null;
};

export type GameUserStorage = {
  id?: string | number;
  slots: GameUserStorageSlot[];
};

export type GameUserEquipmentSlot = {
  
  type?: string;
  wearableItem?: GameUserWearableItem | null;
};

export type GameUserEquipment = {
  id?: string | number;
  userEquipmentSlots: GameUserEquipmentSlot[];
};

export type GameUserBaseStatistics = {
  strength?: number;
  agility?: number;
  endurance?: number;
  intelligence?: number;
  luck?: number;
  strongPoints?: number;
  agilityPoints?: number;
  healthPoints?: number;
  criticalChancePoints?: number;
  [key: string]: number | undefined;
};

export type ShipBonusBranch = {
  level?: number;
  percent?: number;
  multiplier?: number;
};

export type GameUserShipBonuses = {
  skills?: ShipBonusBranch;
  missions?: ShipBonusBranch;
  work?: ShipBonusBranch;
};

export type SessionShopBoosterEntry = {
  boosterId: string;
  expiresAt: number;
};

export type GameUserCapacities = {
  energyPoints?: number;
  trainingPoints?: number;
  fightPoints?: number;
};

export type GameUserBoosterTemplate = {
  name?: string;
  type?: string;
  effectAmount?: number;
  description?: string;
  tier?: number;
};

export type GameUserBooster = {
  id?: string | number;
  boosterTemplate?: GameUserBoosterTemplate;
  expiresAt?: string;
};

export type GameUserAvailableBooster = {
  id: string | number;
  boosterTemplate?: GameUserBoosterTemplate;
  price: number;
  useGold: boolean;
};

export type GameUserStoreSlot = {
  id?: string | number | null;
  slotNumber?: number;
  item?: GameUserWearableItem | null;
};

export type GameUserStore = {
  storeSlots?: GameUserStoreSlot[];
  isFreeRefreshAvailable?: boolean;
  refreshCost?: number;
};

export type GameUser = {
  id: string;
  username: string;
  avatarName?: string;
  experiencePoints: number;
  trainingPoints?: number;
  diamonds: number;
  gold: number;
  duelPoints?: number;
  famePoints?: number;
  energyPoints?: number;
  level: GameUserLevel;
  
  ship?: unknown;
  missions?: AvailableMissionDto[];
  works?: AvailableWorkDto[];
  trainings?: AvailableTrainingListItemDto[];
  currentActivity?: CurrentActivityDto;
  userBaseStatistics?: GameUserBaseStatistics;
  freeSkillPointsAvailable?: number;
  userSkillPointsPrices?: Record<string, number | undefined>;
  storage?: GameUserStorage;
  userEquipment?: GameUserEquipment;
  userCapacities?: GameUserCapacities;
  userBoosters?: GameUserBooster[];
  userAvailableBoosters?: GameUserAvailableBooster[];
  userStore?: GameUserStore;
  gameShop?: GameShopUserState;
  shipBonuses?: GameUserShipBonuses;
  sessionShopBoosters?: SessionShopBoosterEntry[];
  equippedTitle?: EquippedTitleDto | null;
};
