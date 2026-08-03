import type { ShipPreviewData, ShipPreviewRosterMemberDto } from '@/types/preview';
import { mapShipApiRoleToShipRole } from '@/features/game/ship/mapShipData';
import { normalizeShipUpgradePricingMatrix } from '@/features/game/ship/shipUpgradeCosts';
import type { Member, ShipData } from '@/features/game/ship/shipTypes';

function parsePreviewMemberLevel(level: string | number | undefined): number {
  if (level == null) return 1;
  const n = typeof level === 'number' ? level : Number.parseInt(String(level), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function mapShipPreviewMemberToShipMember(m: ShipPreviewRosterMemberDto): Member {
  const uid = String(m.user?.id ?? '');
  return {
    userId: uid,
    name: m.user?.username ?? uid,
    avatarName: (m.user as { avatarName?: string })?.avatarName,
    level: parsePreviewMemberLevel(m.user?.level ?? m.user?.levelId),
    role: mapShipApiRoleToShipRole(m.role),
    goldContributed: Math.max(0, Number(m.goldContributed ?? 0)),
    diamondsContributed: Math.max(0, Number(m.diamondsContributed ?? 0)),
  };
}

export function mapShipPreviewToPublicShipData(
  ship: ShipPreviewData,
  viewerUserId: string | undefined
): ShipData {
  const members = (ship.members ?? []).map(mapShipPreviewMemberToShipMember);
  return {
    shipId: String(ship.id),
    currentUserId: viewerUserId ?? '',
    requiresInvitation: Boolean(ship.requiresInvitation ?? true),
    name: ship.title ?? '',
    description: ship.description ?? '',
    internalNotes: '',
    fame: Number(ship.famePoints ?? 0),
    gold: 0,
    diamonds: 0,
    members,
    upgrades: {
      skills: Number(ship.skillsUpgrade ?? 0),
      work: Number(ship.workUpgrade ?? 0),
      quests: Number(ship.missionsUpgrade ?? 0),
      training: 0,
      hull: Number(ship.hullUpgrade ?? 0),
    },
    maxMembers: Number(ship.maxMembers ?? 10),
    upgradePricing: normalizeShipUpgradePricingMatrix(null),
  };
}
