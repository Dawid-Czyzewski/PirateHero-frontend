import { ArrowDown, ArrowUp, Coins } from 'lucide-react';
import { useLayoutEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { RARITY_BORDER, RARITY_COLOR, RARITY_GLOW } from '@/data/gameItems';
import {
  buildShopTooltipStatRows,
  shopStatLineIcon,
  shopStatLineLabel,
} from './shopTooltipStatLines';
import { shopItemImageSrc } from './shopItemImage';
import { shopRarityToItemRarity } from './shopRarityMap';
import type { ShopItem } from './types';
import { translateWearableItemFlavor } from '@/features/game/character/wearableItemDisplayName';

export type ShopItemTooltipProps = {
  item: ShopItem;
  comparedItem?: ShopItem | null;
  priceMode: 'buy' | 'sell';
  canAfford?: boolean;
  showPrice?: boolean;
};

export function ShopItemTooltipCard({
  item,
  comparedItem,
  priceMode,
  canAfford = true,
  showPrice = true,
}: ShopItemTooltipProps) {
  const { t } = useTranslation();
  const ir = shopRarityToItemRarity(item.rarity);
  const sellPrice = Math.floor(item.price * 0.5);
  const statRows = buildShopTooltipStatRows(item.stats, comparedItem?.stats ?? null);
  const flavor = translateWearableItemFlavor(t, item.nameKey);

  return (
    <div
      className={`relative isolate overflow-hidden rounded-lg border-2 p-3 shadow-2xl ${RARITY_BORDER[ir]} ${RARITY_GLOW[ir]}`}
      style={{ backgroundColor: '#151b26', opacity: 1, backdropFilter: 'none', mixBlendMode: 'normal' }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#151b26]" />
      <div className="relative z-10">
        <div className="mb-2 flex justify-center">
          <img
            src={shopItemImageSrc(item)}
            alt=""
            className="h-14 w-14 rounded bg-secondary/20 p-0.5 object-contain"
            draggable={false}
          />
        </div>
        <p className={`text-sm font-bold ${RARITY_COLOR[ir]}`}>
          {item.displayLabel ?? t(item.nameKey)}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {t(`storePage.slots.${item.slotId}`)} • {t(`storePage.rarity.${item.rarity}`)}
        </p>
        {flavor ? <p className="mt-1 text-[10px] italic leading-snug text-muted-foreground/90">{flavor}</p> : null}
        <div className="mt-2 space-y-1 border-t border-border/30 pt-2">
          {statRows
            .filter(({ value, compared }) =>
              comparedItem ? value !== 0 || compared !== 0 : value !== 0
            )
            .map(({ statId, value, compared }) => {
              const { Icon, color } = shopStatLineIcon(statId);
              const diff = value - compared;
              const diffLabel = diff > 0 ? `+${diff}` : `${diff}`;
              return (
                <div key={statId} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Icon className={`h-3 w-3 ${color}`} />
                    {shopStatLineLabel(statId, t)}
                  </span>
                  <span className="flex items-center gap-1 font-bold tabular-nums">
                    <span>{value}</span>
                    {comparedItem && diff !== 0 ? (
                      <>
                        <span
                          className={`font-semibold ${
                            diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-muted-foreground/60'
                          }`}
                        >
                          {diffLabel}
                        </span>
                        {diff > 0 && <ArrowUp className="h-2.5 w-2.5 shrink-0 text-green-400" aria-hidden />}
                        {diff < 0 && <ArrowDown className="h-2.5 w-2.5 shrink-0 text-red-400" aria-hidden />}
                      </>
                    ) : null}
                  </span>
                </div>
              );
            })}
        </div>
        {showPrice ? (
          <div className="mt-2 flex flex-col gap-1 border-t border-border/30 pt-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Coins className="h-3 w-3 text-primary/60" />
              {priceMode === 'buy' ? (
                <>
                  {t('storePage.tooltipBuy')}: <span className="font-bold text-primary">{item.price}</span>
                </>
              ) : (
                <>
                  {t('characterPage.sellFor')}: <span className="font-bold text-primary">{sellPrice}</span>
                </>
              )}
            </div>
            {priceMode === 'buy' && !canAfford ? (
              <p className="text-[10px] font-semibold text-destructive">{t('not_enough_gold')}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type PortalProps = ShopItemTooltipProps & {
  show: boolean;
  anchorRef: RefObject<HTMLElement | null>;
};

export function ShopItemTooltipPortal({ show, anchorRef, ...cardProps }: PortalProps) {
  const [pos, setPos] = useState({ left: 8, top: 8, width: 224, placeAbove: true });

  useLayoutEffect(() => {
    if (!show) return;
    const update = () => {
      const r = anchorRef.current?.getBoundingClientRect();
      if (!r) return;
      const pad = 8;
      const vw = window.innerWidth;
      const width = Math.min(224, vw - pad * 2);
      let left = r.left + r.width / 2 - width / 2;
      left = Math.max(pad, Math.min(left, vw - width - pad));
      const placeAbove = r.top >= 160;
      setPos({
        left,
        top: placeAbove ? Math.max(pad, r.top - pad) : r.bottom + pad,
        width,
        placeAbove,
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [show, anchorRef]);

  if (!show) return null;

  return createPortal(
    <div
      className="pointer-events-none"
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        width: pos.width,
        zIndex: 250000,
        transform: pos.placeAbove ? 'translateY(-100%)' : 'none',
      }}
    >
      <ShopItemTooltipCard {...cardProps} />
    </div>,
    document.body
  );
}
