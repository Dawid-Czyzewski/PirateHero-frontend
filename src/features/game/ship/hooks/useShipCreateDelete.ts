import { useCallback } from 'react';
import type { TFunction } from 'i18next';
import {
  createShip as createShipRequest,
  deleteShip as deleteShipRequest,
} from '@/services/shipService';
import type { UserContextValue } from '@/context/userContext';
import type { GameUser } from '@/types/gameUser';
import { CREATE_SHIP_GOLD_COST } from '@/features/game/ship/createShipConstants';
import { clonePayload, isShipOwner } from '@/features/game/ship/hooks/shipOptimistic';
import type { UseShipDataResult } from '@/features/game/ship/hooks/useShipData';
import type { ShipFeedback } from '@/features/game/ship/hooks/useShipFeedback';

type Params = {
  user: GameUser | null | undefined;
  fetchUserData: UserContextValue['fetchUserData'] | undefined;
  t: TFunction;
  data: UseShipDataResult;
  setFeedback: (feedback: ShipFeedback) => void;
  setActionLoading: (loading: boolean) => void;
};

export function useShipCreateDelete({
  user,
  fetchUserData,
  t,
  data,
  setFeedback,
  setActionLoading,
}: Params) {
  const { payload, ship, chatMessages, applyPayload, loadShipPack, setChatMessages } = data;

  const refreshProfile = useCallback(async () => {
    await fetchUserData?.();
  }, [fetchUserData]);

  const createShip = useCallback(
    async (title: string, description: string) => {
      setFeedback(null);
      const gold = Number(user?.gold ?? 0);
      if (gold < CREATE_SHIP_GOLD_COST) {
        setFeedback({ type: 'error', message: t('insufficientGold') });
        return false;
      }
      const result = await createShipRequest(
        title,
        description,
        user,
        refreshProfile,
        setActionLoading
      );
      if (result.success === false) {
        setFeedback({ type: 'error', message: result.message });
        return false;
      }
      await loadShipPack(true);
      setFeedback({ type: 'success', message: t('statekCreatedSuccessfully') });
      return true;
    },
    [user, refreshProfile, loadShipPack, t, setFeedback]
  );

  const deleteShip = useCallback(async () => {
    setFeedback(null);
    if (!isShipOwner(ship)) return;

    const prevPayloadSnapshot = clonePayload(payload);
    const prevChat = [...chatMessages];
    applyPayload(null);
    setChatMessages([]);

    const res = await deleteShipRequest(user, refreshProfile, setActionLoading);
    if (res.success === false) {
      if (prevPayloadSnapshot) applyPayload(prevPayloadSnapshot);
      setChatMessages(prevChat);
      setFeedback({ type: 'error', message: res.message });
      return;
    }
    void loadShipPack(true);
  }, [
    ship,
    user,
    payload,
    chatMessages,
    refreshProfile,
    applyPayload,
    loadShipPack,
    setFeedback,
    setChatMessages,
  ]);

  return { createShip, deleteShip };
}
