import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RARITY_BG, RARITY_BORDER, RARITY_COLOR, RARITY_GLOW } from '@/data/gameItems';
import type { GameItem } from '@/features/game/character/characterTypes';
import { translateWearableItemName } from '@/features/game/character/wearableItemDisplayName';
import type { SlotType } from '@/data/gameItems';
import { CharacterItemTooltipPortal } from './CharacterItemTooltip';

type Props = {
  slotType: SlotType;
  item: GameItem | null;
  activeChestDragSlot?: SlotType | null;
  tooltipSide: 'left' | 'right' | 'bottom' | 'top';
  onDrop: (itemId: string, slot: SlotType) => void | Promise<void>;
  onUnequip: (slot: SlotType) => void | Promise<void>;
  readOnly?: boolean;
  layout?: 'row' | 'tile';
};

export function CharacterEquipSlot({
  slotType,
  item,
  activeChestDragSlot = null,
  tooltipSide,
  onDrop,
  onUnequip,
  readOnly = false,
  layout = 'row',
}: Props) {
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isTile = layout === 'tile';
  const itemName = item ? translateWearableItemName(t, item) : '';
  const slotLabel = t(`characterPage.slots.${slotType}`);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (readOnly) return;
      e.preventDefault();
      if (e.dataTransfer.getData('sourceType') === 'chest') setDragOver(true);
    },
    [readOnly]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (readOnly) return;
      e.preventDefault();
      setDragOver(false);
      const droppedId = e.dataTransfer.getData('itemId');
      const sourceType = e.dataTransfer.getData('sourceType');
      if (!droppedId || sourceType !== 'chest') return;
      void onDrop(droppedId, slotType);
    },
    [readOnly, onDrop, slotType]
  );

  const isCategoryHighlight = activeChestDragSlot === slotType;

  return (
    <div
      ref={anchorRef}
      className={`relative rounded-md border-2 transition-all ${
        isTile ? 'flex min-h-[5.5rem] flex-col items-center justify-center gap-1 p-1.5' : 'min-h-[60px] p-2'
      } ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
        dragOver
          ? 'scale-[1.02] border-primary bg-primary/15'
          : item
            ? `${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]} ${RARITY_GLOW[item.rarity]}`
            : 'border-dashed border-muted-foreground/20 bg-muted/10'
      } ${isCategoryHighlight ? 'ring-2 ring-primary/70 shadow-[0_0_0_1px_rgba(250,204,21,0.35)]' : ''} ${hovered ? 'z-40' : 'z-0'}`}
      title={item ? itemName : slotLabel}
      aria-label={item ? `${slotLabel}: ${itemName}` : slotLabel}
      onDragOver={readOnly ? undefined : handleDragOver}
      onDragLeave={readOnly ? undefined : () => setDragOver(false)}
      onDrop={readOnly ? undefined : handleDrop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      draggable={!readOnly && !!item}
      onDragStart={
        readOnly
          ? undefined
          : (e) => {
              if (!item) return;
              e.dataTransfer.setData('itemId', item.id);
              e.dataTransfer.setData('sourceType', 'equip');
              e.dataTransfer.setData('slot', slotType);
            }
      }
      onDoubleClick={readOnly ? undefined : () => item && void onUnequip(slotType)}
    >
      {item ? (
        isTile ? (
          <>
            <img
              src={item.image}
              alt=""
              className="h-12 w-12 rounded bg-secondary/30 p-0.5 object-contain"
              width={48}
              height={48}
            />
            <p className="w-full truncate text-center text-[10px] font-bold text-foreground">
              {slotLabel}
            </p>
            <p className={`w-full truncate text-center text-[9px] font-semibold ${RARITY_COLOR[item.rarity]}`}>
              {t(`characterPage.rarity.${item.rarity}`)}
            </p>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <img
              src={item.image}
              alt={itemName}
              className="h-11 w-11 rounded bg-secondary/30 p-0.5 object-contain"
              width={44}
              height={44}
            />
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[11px] font-bold ${RARITY_COLOR[item.rarity]}`}>{itemName}</p>
              <p className="text-[9px] text-muted-foreground">
                {slotLabel} • {t(`characterPage.rarity.${item.rarity}`)}
              </p>
            </div>
          </div>
        )
      ) : isTile ? (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded bg-secondary/20 opacity-40">
            <span className="text-xs text-muted-foreground">?</span>
          </div>
          <span className="w-full truncate text-center text-[10px] text-muted-foreground">{slotLabel}</span>
        </>
      ) : (
        <div className="flex items-center gap-2 opacity-30">
          <div className="flex h-11 w-11 items-center justify-center rounded bg-secondary/20">
            <span className="text-[10px] text-muted-foreground">?</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{slotLabel}</span>
        </div>
      )}
      {item ? (
        <CharacterItemTooltipPortal
          show={hovered}
          anchorRef={anchorRef}
          position={isTile ? 'top' : tooltipSide}
          item={item}
          comparedItem={null}
        />
      ) : null}
    </div>
  );
}
