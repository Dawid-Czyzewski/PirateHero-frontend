import { useCallback } from 'react';
import type { GameUser } from '@/types/gameUser';
import { requestJson } from '@/lib/api/requestJson';
import { getServiceApiErrorMessage } from '@/lib/apiError';
import type { UserContextValue } from '@/context/userContext';
import {
  CHARACTER_ATTRIBUTE_API_STAT,
  CHARACTER_ATTRIBUTE_PRICE_FIELD,
  resolveAttributePointPrice,
  type CharacterStatKey,
} from './characterSkillPoints';

type Params = {
  user: GameUser | null | undefined;
  setUser: UserContextValue['setUser'];
  fetchUserData: UserContextValue['fetchUserData'];
};

export function useInventoryAttributeAllocation({ user, setUser, fetchUserData }: Params) {
  return useCallback(
    (stat: CharacterStatKey) => {
      if (!user?.id) return;

      let rollback: GameUser | null = null;

      setUser((current) => {
        if (!current?.id) return current;
        const freePoints = current.freeSkillPointsAvailable ?? 0;
        const price = resolveAttributePointPrice(current.userSkillPointsPrices, stat);
        const canUseFreePoint = freePoints > 0;
        const canBuyWithGold = (current.gold ?? 0) >= price;
        if (!canUseFreePoint && !canBuyWithGold) return current;

        rollback = current;

        const nextBaseStats = { ...(current.userBaseStatistics ?? {}) };
        nextBaseStats[stat] = (nextBaseStats[stat] ?? 0) + 1;

        if (canUseFreePoint) {
          return {
            ...current,
            userBaseStatistics: nextBaseStats,
            freeSkillPointsAvailable: Math.max(0, freePoints - 1),
          };
        }

        const nextPrices = { ...(current.userSkillPointsPrices ?? {}) };
        const priceField = CHARACTER_ATTRIBUTE_PRICE_FIELD[stat];
        nextPrices[priceField] = price + 1;

        return {
          ...current,
          userBaseStatistics: nextBaseStats,
          gold: Math.max(0, (current.gold ?? 0) - price),
          userSkillPointsPrices: nextPrices,
        };
      });

      if (!rollback) return;
      const snapshot = rollback;

      void (async () => {
        try {
          await requestJson(`/users/${snapshot.id}/add-skill-point`, {
            method: 'POST',
            body: { stat: CHARACTER_ATTRIBUTE_API_STAT[stat] },
          });
          void fetchUserData();
        } catch (e) {
          setUser(snapshot);
          void fetchUserData();
          console.error(getServiceApiErrorMessage(e, 'Failed to allocate attribute point'));
        }
      })();
    },
    [user?.id, fetchUserData, setUser]
  );
}
