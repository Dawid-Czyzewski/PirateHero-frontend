import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RARITY_COLOR } from '@/data/gameItems';
import { useIsPhoneLayout } from '@/hooks/useIsPhoneLayout';
import { ShopItemTooltipPortal } from './ShopItemTooltip';
import { shopRarityToItemRarity } from './shopRarityMap';
import { shopItemImageSrc } from './shopItemImage';
import { SHOP_RARITY_STYLES } from './rarityStyles';
import type { ShopItem } from './types';

type Props = {
  item: ShopItem;
  comparedEquipped?: ShopItem | null;
  suppressTooltip?: boolean;
  dropHighlight?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, item: ShopItem) => void;
  onDragEnd?: () => void;
  onHoverChange?: (item: ShopItem | null) => void;
  onDoubleClickEquip?: (item: ShopItem) => void;
};

export function InventoryItemTile({
  item,
  comparedEquipped,
  suppressTooltip,
  dropHighlight,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  onHoverChange,
  onDoubleClickEquip,
}: Props) {
  const { t } = useTranslation();
  const isPhone = useIsPhoneLayout();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rc = SHOP_RARITY_STYLES[item.rarity];
  const ir = shopRarityToItemRarity(item.rarity);
  const showTooltip = hovered && !suppressTooltip;

  return (
    <div
      ref={anchorRef}
      data-chest-slot
      draggable={!isPhone}
      title={item.displayLabel ?? t(item.nameKey)}
      onDragOver={isPhone ? undefined : onDragOver}
      onDrop={isPhone ? undefined : onDrop}
      onDragStart={(e) => {
        if (isPhone) {
          e.preventDefault();
          return;
        }
        onDragStart(e, item);
      }}
      onDragEnd={() => onDragEnd?.()}
      onDoubleClick={() => {
        if (!isPhone) return;
        onDoubleClickEquip?.(item);
      }}
      onMouseEnter={() => {
        setHovered(true);
        onHoverChange?.(item);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverChange?.(null);
      }}
      className={`relative flex min-h-14 flex-col justify-center rounded-md border-2 p-1 transition-all hover:scale-[1.05] sm:min-h-[5.75rem] sm:p-1.5 md:min-h-[6.25rem] ${
        isPhone ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${rc.border} ${rc.bg} z-0 ${dropHighlight ? 'ring-2 ring-primary/70' : ''}`}
    >
      <ShopItemTooltipPortal
        show={showTooltip}
        anchorRef={anchorRef}
        item={item}
        comparedItem={comparedEquipped ?? null}
        priceMode="sell"
      />
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded bg-secondary/20 p-0.5 sm:h-14 sm:w-14 md:h-16 md:w-16">
        <img
          src={shopItemImageSrc(item)}
          alt=""
          className="h-full w-full object-contain pointer-events-none"
          draggable={false}
        />
      </div>
      <p className={`mt-1 truncate text-center text-[9px] font-bold leading-tight sm:text-[10px] ${RARITY_COLOR[ir]}`}>
        {item.displayLabel ?? t(item.nameKey)}
      </p>
    </div>
  );
}
