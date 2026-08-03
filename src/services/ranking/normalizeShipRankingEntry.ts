import type { ShipRankingEntry } from '@/types/ranking';

export function normalizeShipRankingEntry(item: unknown): ShipRankingEntry {
  const r = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
  const memberIds = Array.isArray(r.memberIds)
    ? (r.memberIds as unknown[]).map((id) => String(id))
    : [];
  const maxRaw = r.maxMembers;
  const maxMembers =
    typeof maxRaw === 'number' && Number.isFinite(maxRaw) && maxRaw > 0
      ? maxRaw
      : typeof maxRaw === 'string' && maxRaw !== ''
        ? Math.max(0, parseInt(maxRaw, 10) || 0)
        : 0;
  const cap = r.captainUsername;
  const captainUsername =
    cap == null
      ? null
      : typeof cap === 'string' && cap.trim() !== ''
        ? cap
        : null;

  return {
    id: String(r.id ?? ''),
    title: String(r.title ?? ''),
    totalFamePoints: typeof r.totalFamePoints === 'number' ? r.totalFamePoints : 0,
    memberCount: typeof r.memberCount === 'number' ? r.memberCount : 0,
    memberIds,
    requiresInvitation: Boolean(r.requiresInvitation),
    maxMembers: maxMembers > 0 ? maxMembers : 10,
    captainUsername,
  };
}
