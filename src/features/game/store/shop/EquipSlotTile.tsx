import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RARITY_BG, RARITY_BORDER, RARITY_COLOR, RARITY_GLOW } from '@/data/gameItems';
import { useIsPhoneLayout } from '@/hooks/useIsPhoneLayout';
import { ShopItemPhoneMenu } from './ShopItemPhoneMenu';
import { ShopItemTooltipPortal } from './ShopItemTooltip';
import { shopRarityToItemRarity } from './shopRarityMap';
import { shopItemImageSrc } from './shopItemImage';
import { SHOP_SLOT_ICONS } from './slotIcons';
import { useLongPress } from './useLongPress';
import type { ShopItem, ShopSlotId } from './types';

type Props = {
  slotId: ShopSlotId;
  item: ShopItem | undefined;
  categoryHighlight?: boolean;
  suppressTooltip?: boolean;
  onDragStart?: (e: React.DragEvent, item: ShopItem) => void;
  onDragEnd?: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  dropHighlight: boolean;
  onDoubleClickUnequip?: (item: ShopItem) => void;
  onSell?: (item: ShopItem) => void;
};

export function EquipSlotTile({
  slotId,
  item,
  categoryHighlight = false,
  suppressTooltip,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  dropHighlight,
  onDoubleClickUnequip,
  onSell,
}: Props) {
  const { t } = useTranslation();
  const isPhone = useIsPhoneLayout();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const slotLabel = t(`characterPage.slots.${slotId}`);
  const SlotIcon = SHOP_SLOT_ICONS[slotId];

  const openMenu = useCallback(() => {
    setHovered(false);
    setMenuOpen(true);
  }, []);

  const longPress = useLongPress(
    openMenu,
    isPhone && Boolean(item) && Boolean(onSell || onDoubleClickUnequip)
  );

  if (!item) {
    return (
      <div
        data-testid={`equip-slot-${slotId}`}
        onDragOver={isPhone ? undefined : onDragOver}
        onDrop={isPhone ? undefined : onDrop}
        className={`flex min-h-[64px] items-center gap-3 rounded-md border-2 border-dashed border-muted-foreground/20 bg-muted/10 p-2 opacity-90 transition-all ${
          dropHighlight ? 'scale-[1.02] border-primary bg-primary/10' : ''
        } ${categoryHighlight && !dropHighlight ? 'ring-2 ring-amber-400/60 ring-offset-2 ring-offset-background' : ''}`}
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-secondary/20">
          <SlotIcon className="h-7 w-7 text-muted-foreground/50" aria-hidden />
        </div>
        <span className="min-w-0 text-[11px] font-medium text-muted-foreground">{slotLabel}</span>
      </div>
    );
  }

  const ir = shopRarityToItemRarity(item.rarity);
  const showHoverTooltip = !isPhone && hovered && !suppressTooltip && !menuOpen;

  return (
    <div
      ref={anchorRef}
      data-testid={`equip-slot-${slotId}`}
      draggable={!isPhone}
      role="presentation"
      onDragStart={(e) => {
        if (isPhone) {
          e.preventDefault();
          return;
        }
        onDragStart?.(e, item);
      }}
      onDragEnd={() => onDragEnd?.()}
      onDragOver={isPhone ? undefined : onDragOver}
      onDrop={isPhone ? undefined : onDrop}
      onDoubleClick={() => {
        if (!isPhone) return;
        onDoubleClickUnequip?.(item);
      }}
      onMouseEnter={() => {
        if (isPhone) return;
        setHovered(true);
      }}
      onMouseLeave={() => {
        if (isPhone) return;
        setHovered(false);
      }}
      {...(isPhone ? longPress : {})}
      className={`relative z-0 flex min-h-[64px] items-center gap-3 rounded-md border-2 p-2 transition-all select-none touch-manipulation ${
        isPhone ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${RARITY_BORDER[ir]} ${RARITY_BG[ir]} ${RARITY_GLOW[ir]} ${dropHighlight ? 'ring-2 ring-primary/70' : ''} ${
        categoryHighlight && !dropHighlight ? 'ring-2 ring-amber-400/70 ring-offset-2 ring-offset-background' : ''
      } ${menuOpen ? 'ring-2 ring-primary/80' : ''}`}
    >
      <ShopItemTooltipPortal
        show={showHoverTooltip}
        anchorRef={anchorRef}
        item={item}
        comparedItem={null}
        priceMode="sell"
      />
      <ShopItemPhoneMenu
        open={menuOpen}
        anchorRef={anchorRef}
        item={item}
        onClose={() => setMenuOpen(false)}
        actions={[
          ...(onDoubleClickUnequip
            ? [
                {
                  id: 'unequip',
                  label: String(t('storePage.phoneActionUnequip')),
                  onClick: () => onDoubleClickUnequip(item),
                },
              ]
            : []),
          ...(onSell
            ? [
                {
                  id: 'sell',
                  label: String(t('storePage.phoneActionSell')),
                  variant: 'sell' as const,
                  onClick: () => onSell(item),
                },
              ]
            : []),
        ]}
      />
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-secondary/30 p-0.5">
        <img
          src={shopItemImageSrc(item)}
          alt=""
          className="h-full w-full rounded object-contain pointer-events-none"
          draggable={false}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[12px] font-bold leading-tight ${RARITY_COLOR[ir]}`}>{t(item.nameKey)}</p>
        <p className="truncate text-[10px] text-muted-foreground">
          {slotLabel} • {t(`storePage.rarity.${item.rarity}`)}
        </p>
      </div>
    </div>
  );
}
