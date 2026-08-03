import type { TFunction } from 'i18next';
import type { Dispatch, SetStateAction } from 'react';
import { deepClone } from '@/lib/clone/deepClone';
import type { ShipMessageDto, MyShipPayload } from '@/types/ship';
import { mapShipMessageDtoToChatMsg } from '@/features/game/ship/mapShipData';
import type { ChatMsg, ShipData } from '@/features/game/ship/shipTypes';

export function clonePayload(payload: MyShipPayload | null): MyShipPayload | null {
  if (!payload) return null;
  return deepClone(payload) as MyShipPayload;
}

export function isShipOwner(ship: ShipData | null | undefined): boolean {
  if (!ship) return false;
  const me = ship.members.find((m) => m.userId === ship.currentUserId);
  return me?.role === 'OWNER';
}

export function syncTreasuryFromMessage(
  treasury: { gold: number; diamonds: number } | undefined,
  setPayload: Dispatch<SetStateAction<MyShipPayload | null>>,
  setShip: Dispatch<SetStateAction<ShipData | null>>
): void {
  if (!treasury) return;
  const { gold, diamonds } = treasury;
  setPayload((prev) => {
    if (!prev?.ship) return prev;
    return { ...prev, ship: { ...prev.ship, gold, diamonds } };
  });
  setShip((prev) => (prev ? { ...prev, gold, diamonds } : prev));
}

export function appendShipMessageToChat(
  setChatMessages: Dispatch<SetStateAction<ChatMsg[]>>,
  dto: ShipMessageDto,
  t: TFunction,
  userId: string | number | undefined
): void {
  setChatMessages((prev) => {
    const nid = String(dto.id);
    if (prev.some((m) => m.id === nid)) return prev;
    const row = mapShipMessageDtoToChatMsg(dto, t, userId);
    return [...prev, { ...row, pending: false }].sort((a, b) => a.createdAtMs - b.createdAtMs);
  });
}
