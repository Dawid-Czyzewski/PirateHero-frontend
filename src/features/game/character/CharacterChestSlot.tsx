import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RARITY_BG, RARITY_BORDER, RARITY_COLOR, RARITY_GLOW } from '@/data/gameItems';
import type { GameItem } from '@/features/game/character/characterTypes';
import { translateWearableItemName } from '@/features/game/character/wearableItemDisplayName';
import type { SlotType } from '@/data/gameItems';
import { CharacterItemTooltipPortal } from './CharacterItemTooltip';

type FilledProps = {
  index: number;
  item: GameItem;
  equippedInSlot?: GameItem | null;
  onDragCategoryChange?: (slot: SlotType | null) => void;
  onEquip: (itemId: string) => void | Promise<void>;
  onMove: (fromIndex: number, toIndex: number) => void | Promise<void>;
  onDropFromEquip: (slot: SlotType, chestIndex: number) => void | Promise<void>;
};

export function CharacterChestFilledSlot({
  index,
  item,
  equippedInSlot,
  onDragCategoryChange,
  onEquip,
  onMove,
  onDropFromEquip,
}: FilledProps) {
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      ref={anchorRef}
      className={`relative flex min-h-14 flex-col justify-center rounded-md border-2 sm:min-h-[78px] ${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]} ${RARITY_GLOW[item.rarity]} p-1 sm:p-1.5 transition-all hover:scale-[1.05] cursor-grab active:cursor-grabbing ${
        dragOver ? 'ring-2 ring-primary/70' : ''
      } ${hovered ? 'z-40' : 'z-0'}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('itemId', item.id);
        e.dataTransfer.setData('sourceType', 'chest');
        e.dataTransfer.setData('chestIndex', String(index));
        e.dataTransfer.setData('itemSlot', item.slot);
        onDragCategoryChange?.(item.slot);
      }}
      onDragEnd={() => onDragCategoryChange?.(null)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const sourceType = e.dataTransfer.getData('sourceType');
        if (sourceType === 'chest') {
          const from = Number(e.dataTransfer.getData('chestIndex'));
          if (!Number.isNaN(from)) void onMove(from, index);
        } else if (sourceType === 'equip') {
          const slot = e.dataTransfer.getData('slot') as SlotType;
          if (slot) void onDropFromEquip(slot, index);
        }
      }}
      onDoubleClick={() => void onEquip(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.image}
        alt={translateWearableItemName(t, item)}
        className="mx-auto h-9 w-9 rounded bg-secondary/20 p-0.5 object-contain sm:h-12 sm:w-12"
        width={48}
        height={48}
      />
      <p className={`mt-1 truncate text-center text-[9px] font-bold ${RARITY_COLOR[item.rarity]}`}>
        {translateWearableItemName(t, item)}
      </p>
      <CharacterItemTooltipPortal
        show={hovered}
        anchorRef={anchorRef}
        position="top"
        item={item}
        comparedItem={equippedInSlot}
      />
    </div>
  );
}

type EmptyProps = {
  index: number;
  label: string;
  onMove: (fromIndex: number, toIndex: number) => void | Promise<void>;
  onDropFromEquip: (slot: SlotType, chestIndex: number) => void | Promise<void>;
};

export function CharacterChestEmptySlot({ index, label, onMove, onDropFromEquip }: EmptyProps) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      className={`flex h-14 items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-secondary/10 text-[10px] text-muted-foreground/60 sm:h-[78px] ${
        dragOver ? 'ring-2 ring-primary/70' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const sourceType = e.dataTransfer.getData('sourceType');
        if (sourceType === 'chest') {
          const from = Number(e.dataTransfer.getData('chestIndex'));
          if (!Number.isNaN(from)) void onMove(from, index);
        } else if (sourceType === 'equip') {
          const slot = e.dataTransfer.getData('slot') as SlotType;
          if (slot) void onDropFromEquip(slot, index);
        }
      }}
    >
      {label}
    </div>
  );
}
