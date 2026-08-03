import type { DragEvent } from 'react';
import type { ShopSelectionSource } from './types';

type Props = {
  peekDragSource: () => ShopSelectionSource | null;
  setDragOverZone: (z: string | null) => void;
  onDropOnChest: (e: DragEvent, targetSlot: number | null) => void;
};

export function ShopChestBridge({ peekDragSource, setDragOverZone, onDropOnChest }: Props) {
  return (
    <div
      className="h-4 shrink-0"
      aria-hidden
      onDragOver={(e) => {
        const src = peekDragSource();
        if (src === 'shop' || src === 'equipped' || src === 'inventory') {
          e.preventDefault();
          e.dataTransfer.dropEffect = src === 'shop' ? 'copy' : 'move';
          setDragOverZone('chest-buy');
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropOnChest(e, null);
      }}
    />
  );
}
