import { useRef, useState } from 'react';
import { Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsPhoneLayout } from '@/hooks/useIsPhoneLayout';
import { ShopItemTooltipPortal } from './ShopItemTooltip';
import { shopItemImageSrc } from './shopItemImage';
import { SHOP_RARITY_STYLES } from './rarityStyles';
import { SHOP_SLOT_ICONS } from './slotIcons';
import type { ShopItem, ShopSlotId } from './types';

type Props = {
  slotId: ShopSlotId;
  item: ShopItem | null;
  canAfford?: boolean;
  categoryHighlight?: boolean;
  comparedEquipped?: ShopItem | null;
  suppressTooltip?: boolean;
  onHoverChange?: (item: ShopItem | null) => void;
  onDragStart?: (e: React.DragEvent, item: ShopItem) => void;
  onDragEnd?: () => void;
  onDoubleClickBuy?: (item: ShopItem) => void;
};

export function ShopSlotTile({
  slotId,
  item,
  canAfford = true,
  categoryHighlight = false,
  comparedEquipped,
  suppressTooltip,
  onHoverChange,
  onDragStart,
  onDragEnd,
  onDoubleClickBuy,
}: Props) {
  const { t } = useTranslation();
  const isPhone = useIsPhoneLayout();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const Icon = SHOP_SLOT_ICONS[slotId];
  const slotLabel = t(`storePage.slots.${slotId}`);

  if (!item) {
    return (
      <div
        className={`flex min-h-[4.5rem] flex-row items-center gap-3 rounded border-2 border-dashed p-3 transition-all ${
          'border-border/30 bg-muted/10'
        }`}
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-muted/20">
          <Icon className="h-7 w-7 text-muted-foreground/25" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block truncate font-display text-[11px] font-bold uppercase leading-tight text-muted-foreground/50 sm:text-xs">
            {slotLabel}
          </span>
          <span className="mt-1 block text-[11px] text-muted-foreground/35 sm:text-xs">{t('storePage.soldOut')}</span>
        </div>
      </div>
    );
  }

  const rc = SHOP_RARITY_STYLES[item.rarity];
  const showTooltip = hovered && !suppressTooltip;

  return (
    <div
      ref={anchorRef}
      draggable={canAfford && !isPhone}
      onDragStart={(e) => {
        if (!canAfford || isPhone) {
          e.preventDefault();
          return;
        }
        onDragStart?.(e, item);
      }}
      onDragEnd={() => onDragEnd?.()}
      onDoubleClick={() => {
        if (!isPhone || !canAfford) return;
        onDoubleClickBuy?.(item);
      }}
      onMouseEnter={() => {
        setHovered(true);
        onHoverChange?.(item);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverChange?.(null);
      }}
      className={`relative flex min-h-[4.5rem] flex-row items-stretch gap-3 rounded border-2 p-3 transition-all ${
        canAfford
          ? isPhone
            ? 'cursor-pointer hover:scale-[1.02]'
            : 'cursor-grab hover:scale-[1.02] active:cursor-grabbing'
          : 'cursor-not-allowed opacity-70 saturate-[0.65]'
      } ${rc.border} ${rc.bg} z-0`}
    >
      <ShopItemTooltipPortal
        show={showTooltip}
        anchorRef={anchorRef}
        item={item}
        comparedItem={comparedEquipped ?? null}
        priceMode="buy"
        canAfford={canAfford}
      />
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center self-center rounded bg-secondary/20 p-0.5">
        <img
          src={shopItemImageSrc(item)}
          alt=""
          className="h-full w-full object-contain pointer-events-none"
          draggable={false}
        />
        {item.rarity === 'legendary' ? (
          <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className="line-clamp-2 font-display text-xs font-bold leading-snug text-foreground sm:text-sm">
          {t(item.nameKey)}
        </span>
        <span className="flex items-center gap-1.5 font-display text-xs font-bold tabular-nums text-primary sm:text-sm">
          <Coins className="h-4 w-4 shrink-0 opacity-90" />
          {item.price}
        </span>
      </div>
    </div>
  );
}
