import { useCallback, useEffect, useRef, useState } from 'react';
import type { TFunction } from 'i18next';
import { getMessages, getMyShip } from '@/services/shipService';
import type { ShipMessageDto, MyShipPayload } from '@/types/ship';
import { isMyShipPayloadActive } from '@/types/ship';
import type { GameUser } from '@/types/gameUser';
import {
  mapShipMessageDtoToChatMsg,
  mapShipMessagesToChatMessages,
  mapShipData,
} from '@/features/game/ship/mapShipData';
import {
  clearLastShipId,
  persistLastShipId,
  persistUserHasStatek,
} from '@/features/game/ship/statekMembershipStorage';
import type { ChatMsg, ShipData } from '@/features/game/ship/shipTypes';

export const SHIP_CHAT_POLL_MS = 3000;

export function useShipData(
  user: GameUser | null | undefined,
  t: TFunction,
  chatPollingActive = false
) {
  const [payload, setPayload] = useState<MyShipPayload | null>(null);
  const [ship, setShip] = useState<ShipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatHistoryLoading, setChatHistoryLoading] = useState(false);

  const userIdStr = user?.id != null ? String(user.id) : '';
  const chatHistoryLoadedForShipRef = useRef<string | null>(null);
  const knownMessageIdsRef = useRef<Set<string>>(new Set());
  const loadShipPackRef = useRef<(silent?: boolean) => Promise<void>>(async () => {});
  const payloadRef = useRef<MyShipPayload | null>(null);
  const shipRef = useRef<ShipData | null>(null);
  payloadRef.current = payload;
  shipRef.current = ship;

  const mergeInboundMessage = useCallback(
    (dto: ShipMessageDto) => {
      const msgShipId = dto.shipId != null ? String(dto.shipId) : '';
      const p = payloadRef.current;
      const sh = shipRef.current;
      const activeShipId =
        p != null && isMyShipPayloadActive(p) && p.ship?.id != null
          ? String(p.ship.id)
          : sh?.shipId != null
            ? String(sh.shipId)
            : '';

      let kickedSelf = false;
      if (dto.isSystem && typeof dto.content === 'string' && user?.username) {
        try {
          const parsed = JSON.parse(dto.content) as { key?: string; params?: { target?: string } };
          if (
            parsed.key === 'shipPage.chatSystem.memberKicked' &&
            parsed.params?.target != null &&
            String(parsed.params.target).toLowerCase() === String(user.username).toLowerCase()
          ) {
            kickedSelf = true;
          }
        } catch {
          
        }
      }

      if (kickedSelf && userIdStr) {
        persistUserHasStatek(userIdStr, false);
        clearLastShipId(userIdStr);
        setPayload(null);
        setShip(null);
        chatHistoryLoadedForShipRef.current = null;
        knownMessageIdsRef.current.clear();
      } else if (
        dto.shipTreasury != null &&
        msgShipId !== '' &&
        activeShipId !== '' &&
        msgShipId === activeShipId
      ) {
        const { gold, diamonds } = dto.shipTreasury;
        setPayload((prev) => {
          if (!prev?.ship) return prev;
          return {
            ...prev,
            ship: {
              ...prev.ship,
              gold,
              diamonds,
            },
          };
        });
        setShip((prev) => (prev ? { ...prev, gold, diamonds } : prev));
      }

      if (dto.isSystem && !kickedSelf) {
        void loadShipPackRef.current(true);
      }

      setChatMessages((prev) => {
        const nid = String(dto.id);
        if (prev.some((m) => m.id === nid)) {
          return prev;
        }
        const aid = dto.author?.id != null ? String(dto.author.id) : '';
        const row = mapShipMessageDtoToChatMsg(dto, t, user?.id);
        let removedTemp = false;
        const filtered = prev.filter((m) => {
          if (removedTemp) return true;
          if (m.kind !== 'user' || !String(m.id).startsWith('temp-')) return true;
          if (aid === '' || m.authorUserId !== aid) return true;
          if (m.text !== row.text) return true;
          removedTemp = true;
          return false;
        });
        return [...filtered, { ...row, pending: false }].sort(
          (a, b) => a.createdAtMs - b.createdAtMs
        );
      });
    },
    [t, user?.id, user?.username, userIdStr]
  );

  const applyPayload = useCallback(
    (p: MyShipPayload | null) => {
      if (userIdStr) {
        const active = p != null && isMyShipPayloadActive(p);
        persistUserHasStatek(userIdStr, active);
        if (active && p.ship?.id != null) {
          persistLastShipId(userIdStr, p.ship.id);
        } else {
          clearLastShipId(userIdStr);
        }
      }
      setPayload(p);
      const mapped = p != null ? mapShipData(p, user?.id) : null;
      setShip(mapped);
    },
    [user?.id, userIdStr]
  );

  const loadShipPack = useCallback(
    async (silent = false) => {
      if (!userIdStr) {
        applyPayload(null);
        setLoading(false);
        return;
      }
      if (!silent) setLoading(true);
      try {
        const data = await getMyShip();
        applyPayload(data);
      } catch (e) {
        console.error(e);
        applyPayload(null);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [applyPayload, userIdStr]
  );

  loadShipPackRef.current = loadShipPack;

  const loadChatHistoryIfNeeded = useCallback(async () => {
    if (!payload?.ship?.id) {
      setChatMessages([]);
      setChatHistoryLoading(false);
      return;
    }
    const key = String(payload.ship.id);
    if (chatHistoryLoadedForShipRef.current === key) {
      return;
    }
    chatHistoryLoadedForShipRef.current = key;
    setChatHistoryLoading(true);
    try {
      const msgs = await getMessages();
      const list = msgs ?? [];
      const sorted = [...list].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      knownMessageIdsRef.current = new Set(sorted.map((m) => String(m.id)));
      setChatMessages(mapShipMessagesToChatMessages(sorted as ShipMessageDto[], t, user?.id));
    } catch (e) {
      console.error(e);
      chatHistoryLoadedForShipRef.current = null;
    } finally {
      setChatHistoryLoading(false);
    }
  }, [payload?.ship?.id, t, user?.id]);

  const pollChatMessages = useCallback(async () => {
    if (!payload?.ship?.id) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    try {
      const msgs = await getMessages();
      if (!msgs) return;
      for (const dto of msgs) {
        const id = String(dto.id);
        if (knownMessageIdsRef.current.has(id)) continue;
        knownMessageIdsRef.current.add(id);
        mergeInboundMessage(dto);
      }
    } catch (e) {
      console.error(e);
    }
  }, [payload?.ship?.id, mergeInboundMessage]);

  useEffect(() => {
    chatHistoryLoadedForShipRef.current = null;
    knownMessageIdsRef.current.clear();
  }, [payload?.ship?.id]);

  useEffect(() => {
    void loadShipPack();
  }, [loadShipPack]);

  useEffect(() => {
    if (!chatPollingActive || !payload?.ship?.id) return;
    void pollChatMessages();
    const timer = window.setInterval(() => {
      void pollChatMessages();
    }, SHIP_CHAT_POLL_MS);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void pollChatMessages();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [chatPollingActive, payload?.ship?.id, pollChatMessages]);

  return {
    payload,
    setPayload,
    applyPayload,
    ship,
    setShip,
    loading,
    chatMessages,
    setChatMessages,
    chatHistoryLoading,
    loadShipPack,
    loadChatHistoryIfNeeded,
    mergeInboundMessage,
  };
}

export type UseShipDataResult = ReturnType<typeof useShipData>;
