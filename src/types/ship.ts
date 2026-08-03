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

export type ShipChatTokenDto = {
  token: string;
  topic?: string;
  expiresAt?: string;
};

export type ShipSearchUserDto = {
  id: number | string;
  username: string;
  level?: string;
  famePoints?: number;
};

export type WsShipChatMessagePayload = {
  type: 'ship-chat-message';
  id: number | string;
  shipId: number;
  content: string;
  createdAt: string;
  isSystem?: boolean;
  author?: ShipMessageAuthorDto | null;
  shipTreasury?: ShipTreasurySnapshotDto;
};

export type WsAuthSuccessPayload = {
  type: 'auth_success';
  shipId: number;
  userId: string | null;
};

export type WsAuthErrorPayload = {
  type: 'auth_error';
  
  detail: string;
  
  message?: string;
};

export type WsProtocolErrorPayload = {
  type: 'error';
  detail: string;
};

export type WsPongPayload = {
  type: 'pong';
};

export type WsInboundPayload =
  | WsAuthSuccessPayload
  | WsAuthErrorPayload
  | WsProtocolErrorPayload
  | WsShipChatMessagePayload
  | WsPongPayload;

export function parseWsInboundPayload(raw: unknown): WsInboundPayload | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const o = raw as Record<string, unknown>;
  const t = o.type;
  if (t === 'auth_success') {
    return {
      type: 'auth_success',
      shipId: Number(o.shipId),
      userId: o.userId != null ? String(o.userId) : null,
    };
  }
  if (t === 'auth_error') {
    const detail =
      typeof o.detail === 'string'
        ? o.detail
        : typeof o.message === 'string'
          ? o.message
          : 'wsAuthFailed';
    return { type: 'auth_error', detail, message: typeof o.message === 'string' ? o.message : undefined };
  }
  if (t === 'error' && typeof o.detail === 'string') {
    return { type: 'error', detail: o.detail };
  }
  if (t === 'pong') {
    return { type: 'pong' };
  }
  if (t === 'ship-chat-message' && o.content != null && o.createdAt != null) {
    const author = o.author;
    const ct = o.shipTreasury;
    let shipTreasury: ShipTreasurySnapshotDto | undefined;
    if (
      ct &&
      typeof ct === 'object' &&
      typeof (ct as Record<string, unknown>).gold === 'number' &&
      typeof (ct as Record<string, unknown>).diamonds === 'number'
    ) {
      shipTreasury = {
        gold: (ct as { gold: number }).gold,
        diamonds: (ct as { diamonds: number }).diamonds,
      };
    }
    return {
      type: 'ship-chat-message',
      id: o.id as number | string,
      shipId: Number(o.shipId),
      content: String(o.content),
      createdAt: String(o.createdAt),
      isSystem: Boolean(o.isSystem),
      author:
        author && typeof author === 'object'
          ? (author as ShipMessageAuthorDto)
          : undefined,
      shipTreasury,
    };
  }
  return null;
}

export function wsShipChatToMessageDto(p: WsShipChatMessagePayload): ShipMessageDto {
  return {
    id: p.id,
    shipId: p.shipId,
    content: p.content,
    createdAt: p.createdAt,
    isSystem: p.isSystem ?? false,
    author: p.author ?? undefined,
    shipTreasury: p.shipTreasury,
  };
}
