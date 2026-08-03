import { useCallback } from 'react';
import type { TFunction } from 'i18next';
import { sendMessage, setInvitationRequired, updateShip } from '@/services/shipService';
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
import { mapShipMessageDtoToChatMsg } from '@/features/game/ship/mapShipData';

type Params = {
  user: GameUser | null | undefined;
  fetchUserData: UserContextValue['fetchUserData'] | undefined;
  t: TFunction;
  data: UseShipDataResult;
  setFeedback: (feedback: ShipFeedback) => void;
  setActionLoading: (loading: boolean) => void;
};

export function useShipChatNotes({
  user,
  fetchUserData,
  t,
  data,
  setFeedback,
  setActionLoading,
}: Params) {
  const {
    payload,
    ship,
    applyPayload,
    loadShipPack,
    mergeInboundMessage,
    setPayload,
    setShip,
    setChatMessages,
  } = data;

  const refreshProfile = useCallback(async () => {
    await fetchUserData?.();
  }, [fetchUserData]);

  const sendChatMessage = useCallback(
    (content: string) => {
      const text = content.trim();
      if (!text || user?.id == null) return;
      setFeedback(null);
      const tempId = `temp-${Date.now()}`;
      const optimisticDto: ShipMessageDto = {
        id: tempId,
        shipId: payload?.ship?.id,
        content: text,
        createdAt: new Date().toISOString(),
        author: { id: user.id, username: String(user.username ?? '') },
        isSystem: false,
        pending: false,
      };
      setChatMessages((prev) => {
        const row = mapShipMessageDtoToChatMsg(optimisticDto, t, user.id);
        return [...prev, { ...row, pending: true }].sort((a, b) => a.createdAtMs - b.createdAtMs);
      });

      void (async () => {
        const res = await sendMessage(text, user, undefined, undefined);
        if (res.success === false) {
          setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
          setFeedback({ type: 'error', message: res.message });
          return;
        }
        if (res.message) {
          mergeInboundMessage(res.message);
        } else {
          setChatMessages((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, pending: false } : m))
          );
        }
      })();
    },
    [user, payload?.ship?.id, t, mergeInboundMessage, setFeedback, setChatMessages]
  );

  const handleInternalNotesChange = useCallback(
    (internalNotes: string) => {
      if (!ship || !isShipOwner(ship)) return;
      const prevInternalNotes = ship.internalNotes;
      setShip((prev) => (prev ? { ...prev, internalNotes } : prev));
      setPayload((prev) => {
        if (!prev?.ship) return prev;
        return { ...prev, ship: { ...prev.ship, internalNotes } };
      });
      void (async () => {
        const res = await updateShip(
          ship.name,
          ship.description,
          internalNotes,
          user,
          refreshProfile,
          undefined
        );
        if (res.success === false) {
          setShip((prev) => (prev ? { ...prev, internalNotes: prevInternalNotes } : prev));
          setPayload((prev) => {
            if (!prev?.ship) return prev;
            return { ...prev, ship: { ...prev.ship, internalNotes: prevInternalNotes } };
          });
          setFeedback({ type: 'error', message: res.message });
          return;
        }
        const cm = res.data.shipMessage;
        if (cm) {
          syncTreasuryFromMessage(cm.shipTreasury, setPayload, setShip);
          appendShipMessageToChat(
            setChatMessages,
            {
              id: cm.id,
              content: cm.content,
              createdAt: cm.createdAt,
              isSystem: cm.isSystem,
              shipTreasury: cm.shipTreasury,
            },
            t,
            user?.id
          );
        }
        void loadShipPack(true);
      })();
    },
    [ship, user, refreshProfile, loadShipPack, t, setFeedback, setShip, setPayload, setChatMessages]
  );

  const handleToggleRequiresInvitation = useCallback(async () => {
    setFeedback(null);
    if (!ship || !payload?.ship) return;
    if (!isShipOwner(ship)) {
      setFeedback({ type: 'error', message: String(t('onlyOwnerCanChangeSettings')) });
      return;
    }

    const oldValue = ship.requiresInvitation;
    const newValue = !oldValue;
    const prevPayload = clonePayload(payload)!;
    const nextPayload = clonePayload(payload)!;
    if (nextPayload.ship) {
      nextPayload.ship.requiresInvitation = newValue;
    }
    applyPayload(nextPayload);

    const result = await setInvitationRequired(ship.shipId, newValue, setActionLoading);
    if (result.success) {
      const resolved = result.requiresInvitation ?? newValue;
      setPayload((prev) => {
        if (!prev?.ship) return prev;
        return { ...prev, ship: { ...prev.ship, requiresInvitation: resolved } };
      });
      setShip((prev) => (prev ? { ...prev, requiresInvitation: resolved } : prev));
      setFeedback({ type: 'success', message: String(t('invitationRequirementUpdated')) });
      return;
    }

    applyPayload(prevPayload);
    setFeedback({ type: 'error', message: result.message });
  }, [ship, payload, applyPayload, t, setFeedback, setPayload, setShip, setActionLoading]);

  const handleDescriptionSave = useCallback(
    async (description: string) => {
      if (!ship || !isShipOwner(ship)) return;
      const prevDescription = ship.description;
      setShip((prev) => (prev ? { ...prev, description } : prev));
      setPayload((prev) => {
        if (!prev?.ship) return prev;
        return { ...prev, ship: { ...prev.ship, description } };
      });
      const res = await updateShip(
        ship.name,
        description,
        ship.internalNotes,
        user,
        refreshProfile,
        setActionLoading
      );
      if (res.success === false) {
        setShip((prev) => (prev ? { ...prev, description: prevDescription } : prev));
        setPayload((prev) => {
          if (!prev?.ship) return prev;
          return { ...prev, ship: { ...prev.ship, description: prevDescription } };
        });
        setFeedback({ type: 'error', message: res.message });
        return;
      }
      const cm = res.data.shipMessage;
      if (cm) {
        syncTreasuryFromMessage(cm.shipTreasury, setPayload, setShip);
        appendShipMessageToChat(
          setChatMessages,
          {
            id: cm.id,
            content: cm.content,
            createdAt: cm.createdAt,
            isSystem: cm.isSystem,
            shipTreasury: cm.shipTreasury,
          },
          t,
          user?.id
        );
      }
      void loadShipPack(true);
    },
    [ship, user, refreshProfile, loadShipPack, t, setFeedback, setShip, setPayload, setChatMessages, setActionLoading]
  );

  return {
    sendChatMessage,
    handleInternalNotesChange,
    handleToggleRequiresInvitation,
    handleDescriptionSave,
  };
}
