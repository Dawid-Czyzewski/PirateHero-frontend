import { useEffect } from 'react';
import type { SlotType } from '@/data/gameItems';

export function useClearChestDragOnWindow(setActiveChestDragSlot: (slot: SlotType | null) => void) {
  useEffect(() => {
    const clear = () => setActiveChestDragSlot(null);
    window.addEventListener('dragend', clear);
    window.addEventListener('drop', clear);
    return () => {
      window.removeEventListener('dragend', clear);
      window.removeEventListener('drop', clear);
    };
  }, [setActiveChestDragSlot]);
}
