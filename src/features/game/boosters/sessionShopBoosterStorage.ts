import type { ShopBoosterSessionEntry } from './sessionShopBoosterEffects';

const STORAGE_PREFIX = 'famegame-session-shop-boosters-v1:';

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

export function loadSessionShopBoosters(userId: string): ShopBoosterSessionEntry[] {
  if (!userId || typeof sessionStorage === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || !('entries' in parsed)) return [];
    const entries = (parsed as { entries: unknown }).entries;
    if (!Array.isArray(entries)) return [];
    return entries
      .filter(
        (e): e is ShopBoosterSessionEntry =>
          e != null &&
          typeof e === 'object' &&
          typeof (e as ShopBoosterSessionEntry).boosterId === 'string' &&
          typeof (e as ShopBoosterSessionEntry).expiresAt === 'number'
      )
      .filter((e) => e.expiresAt > Date.now());
  } catch {
    return [];
  }
}

export function saveSessionShopBoosters(userId: string, entries: ShopBoosterSessionEntry[]): void {
  if (!userId || typeof sessionStorage === 'undefined') return;
  try {
    const alive = entries.filter((e) => e.expiresAt > Date.now());
    sessionStorage.setItem(storageKey(userId), JSON.stringify({ entries: alive }));
  } catch {
    // ignore quota / private mode
  }
}
