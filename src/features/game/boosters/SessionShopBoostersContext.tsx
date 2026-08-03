import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useUser } from '@/hooks/useUser';
import type { GameUser } from '@/types/gameUser';
import { purchaseShopBoosterApi } from '@/services/shopBoostersApi';
import { calculateCapacityWithBoosters } from '@/features/game/boosters/boosterUtils';
import { getShopBoosterById, getShopBoosterCategory } from './shopBoosterCatalog';
import type { ShopBoosterDefinition } from './shopBoosterCatalog';
import type { ShopBoosterSessionEntry } from './sessionShopBoosterEffects';
import { parseShopBoosterTrainingFlat } from './sessionShopBoosterEffects';
import { loadSessionShopBoosters, saveSessionShopBoosters } from './sessionShopBoosterStorage';

function initialShopBoosterEntries(
  user: GameUser | null | undefined,
  userId: string
): ShopBoosterSessionEntry[] {
  const t = Date.now();
  if (!userId) return [];
  if (user && Array.isArray(user.sessionShopBoosters)) {
    return user.sessionShopBoosters.filter(
      (e) =>
        typeof e.boosterId === 'string' &&
        e.boosterId !== '' &&
        typeof e.expiresAt === 'number' &&
        e.expiresAt > t
    );
  }
  return loadSessionShopBoosters(userId);
}

type SessionShopBoostersContextValue = {
  nowMs: number;
  entries: ShopBoosterSessionEntry[];
  purchaseShopBooster: (def: ShopBoosterDefinition) => Promise<boolean>;
};

const SessionShopBoostersContext = createContext<SessionShopBoostersContextValue | null>(null);

export function SessionShopBoostersProvider({ children }: { children: ReactNode }) {
  const { user, fetchUserData, updateUser } = useUser();
  const userId = user?.id ?? '';
  const [entries, setEntries] = useState<ShopBoosterSessionEntry[]>(() =>
    initialShopBoosterEntries(user, userId)
  );
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!userId) {
      setEntries([]);
      return;
    }
    if (user && Array.isArray(user.sessionShopBoosters)) {
      const alive = user.sessionShopBoosters.filter((e) => e.expiresAt > Date.now());
      setEntries(alive);
      saveSessionShopBoosters(userId, alive);
      return;
    }
    setEntries(loadSessionShopBoosters(userId));
  }, [userId, user?.id, user?.sessionShopBoosters]);

  useEffect(() => {
    if (!userId) return;
    setEntries((prev) => {
      const hadExpired = prev.some((e) => e.expiresAt <= nowMs);
      const next = prev.filter((e) => e.expiresAt > nowMs);
      if (hadExpired) {
        queueMicrotask(() => {
          void fetchUserData();
        });
      }
      return next;
    });
  }, [nowMs, userId, fetchUserData]);

  useEffect(() => {
    if (!userId) return;
    saveSessionShopBoosters(userId, entries);
  }, [userId, entries]);

  const purchaseShopBooster = useCallback(
    async (def: ShopBoosterDefinition): Promise<boolean> => {
      if (!user?.id) return false;
      const price = Number(def.price);
      const now = Date.now();

      if (def.currency === 'gold') {
        if (Number(user.gold ?? 0) < price) return false;
      } else {
        if (Number(user.diamonds ?? 0) < price) return false;
      }

      const prevEntriesSnapshot = entries.map((e) => ({ ...e }));
      const prevGold = user.gold;
      const prevDiamonds = user.diamonds;
      const prevTrainingPoints = user.trainingPoints;

      const patch: Partial<GameUser> = {};
      if (def.currency === 'gold') {
        patch.gold = Number(user.gold ?? 0) - price;
      } else {
        patch.diamonds = Number(user.diamonds ?? 0) - price;
      }

      if (def.category === 'training') {
        const cap = calculateCapacityWithBoosters(user.userCapacities, user.userBoosters);
        const maxBase = Math.max(1, Number(cap.trainingPoints) || 1);
        const newFlat = parseShopBoosterTrainingFlat(def.effect);
        const prevEntry = entries.find(
          (e) => e.expiresAt > now && getShopBoosterCategory(e.boosterId) === 'training'
        );
        const prevBooster = prevEntry ? getShopBoosterById(prevEntry.boosterId) : undefined;
        const prevFlat =
          prevBooster?.category === 'training' ? parseShopBoosterTrainingFlat(prevBooster.effect) : 0;
        const netGrant = newFlat - prevFlat;
        const newMax = maxBase + newFlat;
        const cur = Number(user.trainingPoints ?? 0) || 0;
        patch.trainingPoints = Math.min(Math.max(0, cur + netGrant), newMax);
      }

      await updateUser(patch);

      const expiresAt = now + def.durationHours * 60 * 60 * 1000;
      const cat = def.category;
      const aliveBefore = entries.filter((e) => e.expiresAt > now);
      const withoutCat = aliveBefore.filter((e) => getShopBoosterCategory(e.boosterId) !== cat);
      const nextEntries = [...withoutCat, { boosterId: def.id, expiresAt }];

      setEntries(nextEntries);
      saveSessionShopBoosters(user.id, nextEntries);

      void purchaseShopBoosterApi(def.id)
        .then(async (result) => {
          const t = Date.now();
          const alive = (result.sessionShopBoosters ?? []).filter((e) => e.expiresAt > t);
          setEntries(alive);
          saveSessionShopBoosters(user.id, alive);
          await fetchUserData();
        })
        .catch(() => {
          const rollbackEntries = prevEntriesSnapshot.filter((e) => e.expiresAt > Date.now());
          setEntries(rollbackEntries);
          saveSessionShopBoosters(user.id, rollbackEntries);
          void updateUser({
            gold: prevGold,
            diamonds: prevDiamonds,
            trainingPoints: prevTrainingPoints,
          });
        });

      return true;
    },
    [user, updateUser, entries, fetchUserData]
  );

  const value = useMemo<SessionShopBoostersContextValue>(
    () => ({
      nowMs,
      entries: entries.filter((e) => e.expiresAt > nowMs),
      purchaseShopBooster,
    }),
    [nowMs, entries, purchaseShopBooster]
  );

  return (
    <SessionShopBoostersContext.Provider value={value}>{children}</SessionShopBoostersContext.Provider>
  );
}

export function useSessionShopBoosters(): SessionShopBoostersContextValue {
  const ctx = useContext(SessionShopBoostersContext);
  if (!ctx) {
    throw new Error('useSessionShopBoosters must be used within SessionShopBoostersProvider');
  }
  return ctx;
}

export function useSessionShopBoostersOptional(): SessionShopBoostersContextValue {
  const ctx = useContext(SessionShopBoostersContext);
  const [fallbackNowMs, setFallbackNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (ctx) return;
    const id = window.setInterval(() => setFallbackNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [ctx]);

  if (ctx) return ctx;

  return {
    nowMs: fallbackNowMs,
    entries: [],
    purchaseShopBooster: async () => false,
  };
}
