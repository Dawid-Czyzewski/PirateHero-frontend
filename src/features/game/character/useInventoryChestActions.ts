import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { GameUser } from '@/types/gameUser';
import { requestJson } from '@/lib/api/requestJson';
import { getServiceApiErrorMessage } from '@/lib/apiError';

type Params = {
  user: GameUser | null | undefined;
  chestSlots: Array<string | null>;
  setChestSlots: Dispatch<SetStateAction<Array<string | null>>>;
  fetchUserData: () => Promise<unknown>;
};

export function useInventoryChestActions({
  user,
  chestSlots,
  setChestSlots,
  fetchUserData,
}: Params) {
  return useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex || !user?.storage?.id) return;
      const previousChestSlots = [...chestSlots];
      const nextChestSlots = [...chestSlots];
      const temp = nextChestSlots[fromIndex];
      nextChestSlots[fromIndex] = nextChestSlots[toIndex];
      nextChestSlots[toIndex] = temp;
      setChestSlots(nextChestSlots);

      try {
        await requestJson(
          `/storage/${user.storage.id}/move-item/${fromIndex + 1}/${toIndex + 1}`,
          { method: 'POST' }
        );
        await fetchUserData();
      } catch (e) {
        setChestSlots(previousChestSlots);
        console.error(getServiceApiErrorMessage(e, 'Failed to move item in storage'));
      }
    },
    [user, chestSlots, fetchUserData, setChestSlots]
  );
}
