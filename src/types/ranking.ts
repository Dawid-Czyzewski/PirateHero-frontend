import type { EquippedTitleDto } from '@/types/playerTitle';

export type RankingPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PlayerShipDto = {
  id: number | string | null;
  title: string;
} | null;

export type PlayerLevelDto = {
  id: number | string | null;
  name: string | null;
} | null;

export type PlayerRankingEntry = {
  id: string;
  username: string;
  famePoints: number;
  experiencePoints: number;
  level: PlayerLevelDto;
  ship: PlayerShipDto;
  equippedTitle?: EquippedTitleDto | null;
};

export type ShipRankingEntry = {
  id: string;
  title: string;
  totalFamePoints: number;
  memberCount: number;
  memberIds: string[];
  requiresInvitation: boolean;
  maxMembers: number;
  captainUsername: string | null;
};

export type PlayersRankingPayload = {
  items: PlayerRankingEntry[];
  pagination: RankingPagination;
};

export type ShipsRankingPayload = {
  items: ShipRankingEntry[];
  pagination: RankingPagination;
};
