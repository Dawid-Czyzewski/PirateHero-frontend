import type { GameUserShipBonuses, SessionShopBoosterEntry } from '@/types/gameUser';
import type { EquippedTitleDto } from '@/types/playerTitle';

export type UserPreviewLevelDto = {
  id?: number | string;
  name: string;
};

export type UserPreviewStatisticsDto = {
  healthPoints?: number;
  strongPoints?: number;
  agilityPoints?: number;
  criticalChancePoints?: number;
};

export type UserPreviewWearableDto = {
  id: number | string;
  name: string;
  type?: string;
  rarity?: string;
  statistics?: UserPreviewStatisticsDto | null;
};

export type UserPreviewEquipmentSlotDto = {
  slotType?: string;
  wearableItem: UserPreviewWearableDto | null;
};

export type UserPreviewShipDto = {
  id: number | string;
  title: string;
  membersCount?: number;
  maxMembers?: number;
  hullUpgrade?: number;
  famePoints?: number;
};

export type UserPreviewData = {
  id: number | string;
  username: string;
  avatarName?: string | null;
  famePoints: number;
  level: UserPreviewLevelDto | null;
  userBaseStatistics: UserPreviewStatisticsDto | null;
  userEquipment: { userEquipmentSlots: UserPreviewEquipmentSlotDto[] } | null;
  ship: UserPreviewShipDto | null;
  hasInvitation: boolean;
  shipBonuses?: GameUserShipBonuses;
  sessionShopBoosters?: SessionShopBoosterEntry[];
  equippedTitle?: EquippedTitleDto | null;
};

export type ShipPreviewMemberUserDto = {
  id: number | string;
  username: string;
  level?: string;
  levelId?: number | string;
};

export type ShipPreviewRosterMemberDto = {
  id: number | string;
  role?: string;
  joinedAt: string;
  goldContributed?: number;
  diamondsContributed?: number;
  user: ShipPreviewMemberUserDto;
};

export type ShipPreviewData = {
  id: number | string;
  title: string;
  description?: string | null;
  createdAt: string;
  skillsUpgrade?: number;
  workUpgrade?: number;
  missionsUpgrade?: number;
  hullUpgrade?: number;
  maxMembers?: number;
  requiresInvitation?: boolean;
  famePoints?: number;
  members: ShipPreviewRosterMemberDto[];
  membersCount: number;
  hasPendingRequest: boolean;
  isOwner: boolean;
  isFull: boolean;
};
