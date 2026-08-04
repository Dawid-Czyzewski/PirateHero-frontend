import { Archive } from 'lucide-react';
import type { Dispatch, DragEvent, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsPhoneLayout } from '@/hooks/useIsPhoneLayout';
import { ChestEmptySlot } from './ChestEmptySlot';
import { CHEST_SLOT_COUNT } from './characterEquipLayout';
import { InventoryItemTile } from './InventoryItemTile';
import { setShopDragImage } from './shopDragPreview';
import type { ShopItem, ShopSelectionSource, ShopSlotId } from './types';

type Props = {
  inventory: (ShopItem | null)[];
  equipped: Partial<Record<ShopSlotId, ShopItem | undefined>>;
  onHoverChestItem?: (item: ShopItem | null) => void;
  dragOverZone: string | null;
  chestSectionActive: boolean;
  suppressTooltip: boolean;
  peekDragSource: () => ShopSelectionSource | null;
  setDragOverZone: Dispatch<SetStateAction<string | null>>;
  onChestCellDragOver: (e: DragEvent, slotIndex: number) => void;
  onDropOnChest: (e: DragEvent, targetSlot: number | null) => void;
  onDragStart: (e: DragEvent, item: ShopItem, source: ShopSelectionSource) => void;
  onDragEnd: () => void;
  onDoubleClickEquip?: (item: ShopItem) => void;
  onSellInventoryItem?: (item: ShopItem) => void;
};

export function ShopChestSection({
  inventory,
  equipped,
  onHoverChestItem,
  dragOverZone,
  chestSectionActive,
  suppressTooltip,
  peekDragSource,
  setDragOverZone,
  onChestCellDragOver,
  onDropOnChest,
  onDragStart,
  onDragEnd,
  onDoubleClickEquip,
  onSellInventoryItem,
}: Props) {
  const { t } = useTranslation();
  const isPhone = useIsPhoneLayout();
  const chestFilledCount = inventory.filter((x) => x !== null).length;
  const chestOverflow = 0;

  return (
    <section
      className={`overflow-visible rounded-lg border border-border bg-card/60 p-4 sm:p-5 ${
        chestSectionActive ? 'ring-2 ring-primary/50' : ''
      }`}
      onDragOver={(e) => {
        const src = peekDragSource();
        if (src !== 'shop' && src !== 'equipped' && src !== 'inventory') return;
        if ((e.target as HTMLElement).closest('[data-chest-slot]')) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = src === 'shop' ? 'copy' : 'move';
        setDragOverZone('chest-buy');
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropOnChest(e, null);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setDragOverZone((z) => (z?.startsWith('chest') ? null : z));
        }
      }}
    >
      <h3 className="mb-4 flex flex-wrap items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
        <Archive className="h-4 w-4 shrink-0 text-primary" />
        {t('characterPage.chestTitle')}
        <span className="ml-auto text-sm font-semibold normal-case tracking-tight text-muted-foreground">
          {chestFilledCount}/{CHEST_SLOT_COUNT} {t('characterPage.slotsLabel')}
        </span>
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 sm:gap-2.5 md:gap-3">
        {Array.from({ length: CHEST_SLOT_COUNT }, (_, i) => {
          const item = inventory[i];
          if (!item) {
            return (
              <ChestEmptySlot
                key={`empty-${i}`}
                label={t('characterPage.emptySlot')}
                dropHighlight={dragOverZone === `chest-${i}`}
                onDragOver={(e) => onChestCellDragOver(e, i)}
                onDrop={(e) => {
                  e.preventDefault();
                  onDropOnChest(e, i);
                }}
              />
            );
          }
          return (
            <InventoryItemTile
              key={`${item.id}-${i}`}
              item={item}
              comparedEquipped={equipped[item.slotId] ?? null}
              suppressTooltip={suppressTooltip}
              dropHighlight={dragOverZone === `chest-${i}`}
              onDragOver={(e) => onChestCellDragOver(e, i)}
              onDrop={(e) => {
                e.preventDefault();
                onDropOnChest(e, i);
              }}
              onDragStart={(e, invItem) => {
                onDragStart(e, invItem, 'inventory');
                setShopDragImage(e, invItem, t(invItem.nameKey));
              }}
              onDragEnd={onDragEnd}
              onHoverChange={onHoverChestItem}
              onDoubleClickEquip={onDoubleClickEquip}
              onSell={onSellInventoryItem}
            />
          );
        })}
      </div>
      {chestOverflow > 0 ? (
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          {t('storePage.chestOverflow', { count: chestOverflow })}
        </p>
      ) : null}
      <p className="mt-3 text-center text-[10px] text-muted-foreground/50">
        {isPhone ? t('storePage.phoneTapHint') : t('storePage.dragHint')}
      </p>
    </section>
  );
}
