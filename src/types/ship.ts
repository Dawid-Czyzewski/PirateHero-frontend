export type ShipMemberRole = 'OWNER' | 'MANAGER' | 'MEMBER';

export type ShipMemberUserDto = {
  id: number | string;
  username: string;
  avatarName?: string | null;
  level?: string;
  levelId?: number;
  famePoints?: number;
};

export type ShipRosterMemberDto = {
  id: number | string;
  role?: ShipMemberRole;
  joinedAt: string;
  goldContributed?: number;
  diamondsContributed?: number;
  user: ShipMemberUserDto;
};

export type ShipMessageAuthorDto = {
  id: number | string;
  username?: string;
};

export type ShipTreasurySnapshotDto = {
  gold: number;
  diamonds: number;
};

export type ShipMessageDto = {
  id: number | string;
  content: string;
  createdAt: string;
  isSystem: boolean;
  author?: ShipMessageAuthorDto | null;
  shipId?: number | string;
  pending?: boolean;
  shipTreasury?: ShipTreasurySnapshotDto;

  clientTempId?: string;
};

export type ShipUpgradeLevelPriceDto = {
  level: number;
  gold: number;
  diamonds: number;
};

export type ShipUpgradePricingMatrixDto = {
  skills: ShipUpgradeLevelPriceDto[];
  work: ShipUpgradeLevelPriceDto[];
  missions: ShipUpgradeLevelPriceDto[];
  hull: ShipUpgradeLevelPriceDto[];
};

export type ShipSummaryDto = {
  id: number | string;
  title: string;
  description?: string | null;
  internalNotes?: string | null;
  createdAt?: string;
  gold?: number;
  diamonds?: number;
  skillsUpgrade?: number;
  workUpgrade?: number;
  missionsUpgrade?: number;
  hullUpgrade?: number;
  maxMembers?: number;
  requiresInvitation?: boolean;
  famePoints?: number;
};

export type MyShipMemberDto = {
  id: number | string;
  role?: ShipMemberRole;
  joinedAt?: string;
  goldContributed?: number;
  diamondsContributed?: number;
};

export type MyShipPayload = {
  ship: ShipSummaryDto | null;
  member?: MyShipMemberDto | null;
  members?: ShipRosterMemberDto[];
  messages?: ShipMessageDto[];
  shipUpgradePricing?: ShipUpgradePricingMatrixDto | null;
};

export type MyShipPayloadActive = Omit<MyShipPayload, 'ship'> & {
  ship: ShipSummaryDto;
};

export function isMyShipPayloadActive(
  p: MyShipPayload | null | undefined
): p is MyShipPayloadActive {
  return p != null && p.ship != null;
}

export type ShipUpgradeKind = 'skills' | 'work' | 'missions' | 'hull';

export type DepositShipMessageDto = {
  id: number | string;
  content: string;
  createdAt: string;
  isSystem: boolean;
  shipTreasury?: ShipTreasurySnapshotDto;
};

export type DepositShipSuccessData = {
  ship: {
    id: number | string;
    gold: number;
    diamonds: number;
  };
  user: {
    gold: number;
    diamonds: number;
  };
  shipMessage?: DepositShipMessageDto;
};

export type RemoveMemberSuccessData = {
  removed: true;
  shipMessage: DepositShipMessageDto;
};

export type UpdateShipSuccessData = {
  ship: {
    id: number | string;
    title: string;
    description?: string | null;
    internalNotes?: string | null;
    createdAt?: string;
    maxMembers?: number;
    hullUpgrade?: number;
  };
  shipMessage?: DepositShipMessageDto;
};

export type UpgradeShipSuccessData = {
  upgradeType: string;
  newLevel: number;
  goldCost: number;
  diamondsCost: number;
  ship: {
    id: number | string;
    gold: number;
    diamonds: number;
    skillsUpgrade: number;
    workUpgrade: number;
    missionsUpgrade: number;
    hullUpgrade?: number;
    maxMembers?: number;
  };
};

export type ShipSearchUserDto = {
  id: number | string;
  username: string;
  level?: string;
  famePoints?: number;
};
