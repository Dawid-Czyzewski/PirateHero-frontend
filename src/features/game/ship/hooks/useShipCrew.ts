import { useCallback } from 'react';
import type { TFunction } from 'i18next';
import {
  changeMemberRole,
  leaveShip as leaveShipRequest,
  removeMember,
} from '@/services/shipService';
import type { UserContextValue } from '@/context/userContext';
import type { ShipMessageDto } from '@/types/ship';
import type { GameUser } from '@/types/gameUser';
import {
  appendShipMessageToChat,
  clonePayload,
  isShipOwner,
  syncTreasuryFromMessage,
} from '@/features/game/ship/hooks/shipOptimistic';
import type { UseShipDataResult } from '@/features/game/ship/hooks/useShipData';
import type { ShipFeedback } from '@/features/game/ship/hooks/useShipFeedback';
import { mapShipRoleToShipApiRole } from '@/features/game/ship/mapShipData';
import type { Member } from '@/features/game/ship/shipTypes';

type Params = {
  user: GameUser | null | undefined;
  fetchUserData: UserContextValue['fetchUserData'] | undefined;
  t: TFunction;
  data: UseShipDataResult;
  setFeedback: (feedback: ShipFeedback) => void;
};

export function useShipCrew({ user, fetchUserData, t, data, setFeedback }: Params) {
  const {
    payload,
    ship,
    chatMessages,
    applyPayload,
    loadShipPack,
    setPayload,
    setShip,
    setChatMessages,
  } = data;

  const refreshProfile = useCallback(async () => {
    await fetchUserData?.();
  }, [fetchUserData]);

  const changeRole = useCallback(
    (idx: number, newRole: Member['role']) => {
      setFeedback(null);
      if (!ship || !isShipOwner(ship)) return;
      const target = ship.members[idx];
      if (!target || target.userId === ship.currentUserId) return;
      if (target.role === newRole) return;

      const previousRole = target.role;
      const apiRole = mapShipRoleToShipApiRole(newRole);
      const apiPreviousRole = mapShipRoleToShipApiRole(previousRole);

      setShip((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: prev.members.map((m, i) => (i === idx ? { ...m, role: newRole } : m)),
        };
      });
      setPayload((prev) => {
        if (!prev?.members) return prev;
        return {
          ...prev,
          members: prev.members.map((m) =>
            String(m.user?.id ?? '') === target.userId ? { ...m, role: apiRole } : m
          ),
        };
      });

      void (async () => {
        const res = await changeMemberRole(target.userId, apiRole, user, undefined, undefined);
        if (res.success === false) {
          setShip((prev) => {
            if (!prev) return prev;
            const cur = prev.members[idx];
            if (cur?.userId !== target.userId || cur.role !== newRole) return prev;
            return {
              ...prev,
              members: prev.members.map((m, i) => (i === idx ? { ...m, role: previousRole } : m)),
            };
          });
          setPayload((prev) => {
            if (!prev?.members) return prev;
            const row = prev.members.find((m) => String(m.user?.id ?? '') === target.userId);
            if (row?.role !== apiRole) return prev;
            return {
              ...prev,
              members: prev.members.map((m) =>
                String(m.user?.id ?? '') === target.userId ? { ...m, role: apiPreviousRole } : m
              ),
            };
          });
          setFeedback({ type: 'error', message: res.message });
          return;
        }
        void loadShipPack(true);
      })();
    },
    [ship, user, loadShipPack, setFeedback, setShip, setPayload]
  );

  const removeMemberByIdx = useCallback(
    (idx: number) => {
      setFeedback(null);
      if (!ship || !payload) return;
      const me = ship.members.find((m) => m.userId === ship.currentUserId);
      const target = ship.members[idx];
      if (!me || !target || target.userId === me.userId) return;
      if (me.role === 'OWNER' || (me.role === 'MANAGER' && target.role === 'MEMBER')) {
        const prevPayload = clonePayload(payload)!;
        const nextPayload = clonePayload(payload)!;
        if (nextPayload.members) {
          nextPayload.members = nextPayload.members.filter(
            (m) => String(m.user?.id ?? '') !== target.userId
          );
        }
        applyPayload(nextPayload);

        void (async () => {
          const res = await removeMember(target.userId, user, refreshProfile, undefined);
          if (res.success === false) {
            applyPayload(prevPayload);
            setFeedback({ type: 'error', message: res.message });
            return;
          }
          const cm = res.data.shipMessage;
          syncTreasuryFromMessage(cm.shipTreasury, setPayload, setShip);
          const dto: ShipMessageDto = {
            id: cm.id,
            content: cm.content,
            createdAt: cm.createdAt,
            isSystem: cm.isSystem,
            shipTreasury: cm.shipTreasury,
          };
          appendShipMessageToChat(setChatMessages, dto, t, user?.id);
          void loadShipPack(true);
        })();
      }
    },
    [
      ship,
      payload,
      user,
      refreshProfile,
      applyPayload,
      loadShipPack,
      t,
      setFeedback,
      setPayload,
      setShip,
      setChatMessages,
    ]
  );

  const leaveShip = useCallback(() => {
    setFeedback(null);
    if (!ship || isShipOwner(ship)) return;

    const prevPayloadSnapshot = clonePayload(payload);
    const prevChat = [...chatMessages];
    applyPayload(null);
    setChatMessages([]);

    void (async () => {
      const res = await leaveShipRequest(user, fetchUserData, undefined);
      if (res.success === false) {
        if (prevPayloadSnapshot) applyPayload(prevPayloadSnapshot);
        setChatMessages(prevChat);
        setFeedback({ type: 'error', message: res.message });
        return;
      }
      void loadShipPack(true);
    })();
  }, [ship, user, payload, chatMessages, applyPayload, fetchUserData, loadShipPack, setFeedback, setChatMessages]);

  return { changeRole, removeMemberByIdx, leaveShip };
}
