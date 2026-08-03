import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { SlotType } from '@/data/gameItems';
import type { GameUser } from '@/types/gameUser';
import type { GameItem } from '@/features/game/character/characterTypes';
import { requestJson } from '@/lib/api/requestJson';
import { getServiceApiErrorMessage } from '@/lib/apiError';

type Params = {
  user: GameUser | null | undefined;
  catalog: Map<string, GameItem>;
  equipped: Partial<Record<SlotType, string>>;
  chestSlots: Array<string | null>;
  setEquipped: Dispatch<SetStateAction<Partial<Record<SlotType, string>>>>;
  setChestSlots: Dispatch<SetStateAction<Array<string | null>>>;
  fetchUserData: () => Promise<unknown>;
};

export function useInventoryEquipmentActions({
  user,
  catalog,
  equipped,
  chestSlots,
  setEquipped,
  setChestSlots,
  fetchUserData,
}: Params) {
  const equipItem = useCallback(
    async (itemId: string, targetSlot?: SlotType) => {
      if (!user?.userEquipment?.id) return;
      const item = catalog.get(itemId);
      if (!item) return;
      const slot = targetSlot || item.slot;
      if (slot !== item.slot) return;
      const previousEquipped = { ...equipped };
      const previousChestSlots = [...chestSlots];

      const nextEquipped = { ...previousEquipped, [slot]: itemId };
      const nextChestSlots = [...previousChestSlots];
      const sourceIndex = nextChestSlots.findIndex((id) => id === itemId);
      const replacedItem = previousEquipped[slot] ?? null;
      if (sourceIndex !== -1) {
        nextChestSlots[sourceIndex] = replacedItem;
      } else if (replacedItem) {
        const empty = nextChestSlots.findIndex((id) => id === null);
        if (empty !== -1) nextChestSlots[empty] = replacedItem;
      }
      setEquipped(nextEquipped);
      setChestSlots(nextChestSlots);

      try {
        await requestJson(`/user_equipments/${user.userEquipment.id}/equip`, {
          method: 'POST',
          body: { itemId: Number(itemId) },
        });
        await fetchUserData();
      } catch (e) {
        setEquipped(previousEquipped);
        setChestSlots(previousChestSlots);
        console.error(getServiceApiErrorMessage(e, 'Failed to equip item'));
      }
    },
    [user, catalog, equipped, chestSlots, setEquipped, setChestSlots, fetchUserData]
  );

  const unequipItem = useCallback(
    async (slot: SlotType) => {
      if (!user?.userEquipment?.id) return;
      const currentItemId = equipped[slot];
      if (!currentItemId) return;
      const previousEquipped = { ...equipped };
      const previousChestSlots = [...chestSlots];
      const nextEquipped = { ...equipped };
      delete nextEquipped[slot];
      const nextChestSlots = [...chestSlots];
      const empty = nextChestSlots.findIndex((id) => id === null);
      if (empty !== -1) nextChestSlots[empty] = currentItemId;
      setEquipped(nextEquipped);
      setChestSlots(nextChestSlots);

      try {
        await requestJson(`/user_equipments/${user.userEquipment.id}/unequip`, {
          method: 'POST',
          body: { slotType: slot },
        });
        await fetchUserData();
      } catch (e) {
        setEquipped(previousEquipped);
        setChestSlots(previousChestSlots);
        console.error(getServiceApiErrorMessage(e, 'Failed to unequip item'));
      }
    },
    [user, equipped, chestSlots, setEquipped, setChestSlots, fetchUserData]
  );

  const unequipItemToChestSlot = useCallback(
    async (slot: SlotType, chestIndex: number) => {
      if (!user?.userEquipment?.id || !user.storage?.id) return;
      const wornId = equipped[slot] ?? null;
      if (!wornId) return;
      const previousEquipped = { ...equipped };
      const previousChestSlots = [...chestSlots];
      const firstFreeIndex = previousChestSlots.findIndex((id) => id === null);
      const sameTypeIndex =
        firstFreeIndex === -1
          ? previousChestSlots.findIndex((id) => {
              if (!id) return false;
              const chestItem = catalog.get(id);
              return chestItem?.slot === slot;
            })
          : -1;
      const backendFromIndex = firstFreeIndex !== -1 ? firstFreeIndex : sameTypeIndex;
      const nextEquipped = { ...equipped };
      delete nextEquipped[slot];
      const nextChestSlots = [...chestSlots];
      const displaced = nextChestSlots[chestIndex];
      nextChestSlots[chestIndex] = wornId;
      if (displaced) {
        const empty = nextChestSlots.findIndex((id) => id === null);
        if (empty !== -1 && empty !== chestIndex) nextChestSlots[empty] = displaced;
      }
      setEquipped(nextEquipped);
      setChestSlots(nextChestSlots);

      try {
        await requestJson(`/user_equipments/${user.userEquipment.id}/unequip`, {
          method: 'POST',
          body: { slotType: slot },
        });
        if (backendFromIndex !== -1 && backendFromIndex !== chestIndex) {
          await requestJson(
            `/storage/${user.storage.id}/move-item/${backendFromIndex + 1}/${chestIndex + 1}`,
            { method: 'POST' }
          );
        }
        await fetchUserData();
      } catch (e) {
        setEquipped(previousEquipped);
        setChestSlots(previousChestSlots);
        console.error(getServiceApiErrorMessage(e, 'Failed to unequip or move item'));
      }
    },
    [user, equipped, chestSlots, catalog, setEquipped, setChestSlots, fetchUserData]
  );

  return { equipItem, unequipItem, unequipItemToChestSlot };
}
