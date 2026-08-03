import type { TFunction } from 'i18next';
import type { ShipRosterMemberDto, ShipSummaryDto, MyShipPayload } from '@/types/ship';
import { normalizeShipUpgradePricingMatrix } from '@/features/game/ship/shipUpgradeCosts';
import { isMyShipPayloadActive } from '@/types/ship';
import type { ChatMsg, Member, ShipData } from '@/features/game/ship/shipTypes';

export function mapShipApiRoleToShipRole(role: string | undefined): Member['role'] {
  const r = String(role ?? '').toUpperCase();
  if (r === 'OWNER' || r === 'MANAGER') return r;
  return 'MEMBER';
}

export function mapShipRoleToShipApiRole(role: Member['role']): 'OWNER' | 'MANAGER' | 'MEMBER' {
  return role;
}

function parseUserLevel(level: string | number | undefined): number {
  if (level == null) return 1;
  const n = typeof level === 'number' ? level : Number.parseInt(String(level), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function mapShipMemberToShipMember(m: ShipRosterMemberDto): Member {
  const uid = String(m.user?.id ?? '');
  return {
    userId: uid,
    name: m.user?.username ?? uid,
    avatarName: (m.user as { avatarName?: string })?.avatarName,
    level: parseUserLevel(m.user?.level),
    role: mapShipApiRoleToShipRole(m.role),
    goldContributed: Number(m.goldContributed ?? 0),
    diamondsContributed: Number(m.diamondsContributed ?? 0),
  };
}

export function mapShipData(
  payload: MyShipPayload,
  currentUserId: string | number | undefined
): ShipData | null {
  if (!isMyShipPayloadActive(payload)) {
    return null;
  }
  const ship: ShipSummaryDto = payload.ship;
  const membersRaw = payload.members ?? [];
  const members = membersRaw.map(mapShipMemberToShipMember);
  const uid = currentUserId != null ? String(currentUserId) : '';
  const upgradePricing = normalizeShipUpgradePricingMatrix(payload.shipUpgradePricing ?? null);

  return {
    shipId: String(ship.id),
    currentUserId: uid,
    requiresInvitation: Boolean(ship.requiresInvitation ?? true),
    name: ship.title ?? '',
    description: ship.description ?? '',
    internalNotes: ship.internalNotes ?? '',
    fame: Number(ship.famePoints ?? 0),
    gold: Number(ship.gold ?? 0),
    diamonds: Number(ship.diamonds ?? 0),
    members,
    upgrades: {
      skills: Number(ship.skillsUpgrade ?? 0),
      work: Number(ship.workUpgrade ?? 0),
      quests: Number(ship.missionsUpgrade ?? 0),
      training: 0,
      hull: Number(ship.hullUpgrade ?? 0),
    },
    maxMembers: Number(ship.maxMembers ?? 10),
    upgradePricing,
  };
}

function chatTimeLabel(d: Date): string {
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function resolveShipMessageBody(msg: { content: string; isSystem?: boolean }, t: TFunction): string {
  if (!msg.isSystem) {
    return msg.content;
  }
  try {
    const translationData = JSON.parse(msg.content) as { key?: string; params?: Record<string, unknown> };
    if (translationData.key && translationData.params) {
      return t(translationData.key, translationData.params);
    }
  } catch {
    
  }
  return msg.content;
}

export function mapShipMessageDtoToChatMsg(
  msg: {
    id: number | string;
    content: string;
    createdAt: string;
    isSystem?: boolean;
    author?: { id?: number | string; username?: string } | null;
    pending?: boolean;
  },
  t: TFunction,
  currentUserId: string | number | undefined
): ChatMsg {
  const d = new Date(msg.createdAt);
  const isSystem = Boolean(msg.isSystem);
  const body = resolveShipMessageBody(msg, t);
  const uid = currentUserId != null ? String(currentUserId) : '';
  const authorId = msg.author?.id != null ? String(msg.author.id) : '';
  const isOwn = !isSystem && authorId !== '' && authorId === uid;
  const youLabel = String(t('shipPage.chatYou'));
  return {
    id: String(msg.id),
    kind: isSystem ? 'system' : 'user',
    author: isSystem ? String(t('shipPage.chatSystemAuthor')) : isOwn ? youLabel : msg.author?.username ?? '',
    text: body,
    time: chatTimeLabel(d),
    createdAtMs: d.getTime(),
    authorUserId: !isSystem && authorId !== '' ? authorId : undefined,
    pending: Boolean(msg.pending),
    isOwn,
  };
}

export function mapShipMessagesToChatMessages(
  messages: Array<{
    id: number | string;
    content: string;
    createdAt: string;
    isSystem?: boolean;
    author?: { id?: number | string; username?: string } | null;
    pending?: boolean;
  }>,
  t: TFunction,
  currentUserId?: string | number | null
): ChatMsg[] {
  return messages.map((msg) => mapShipMessageDtoToChatMsg(msg, t, currentUserId ?? undefined));
}

export function mapShipUpgradeKeyToApiType(key: string): 'skills' | 'work' | 'missions' | 'hull' {
  if (key === 'quests') return 'missions';
  if (key === 'hull') return 'hull';
  if (key === 'skills' || key === 'work') return key;
  return 'missions';
}
