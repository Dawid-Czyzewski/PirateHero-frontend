import { Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ShopSlotTile } from './ShopSlotTile';
import { setShopDragImage } from './shopDragPreview';
import type { ShopItem, ShopSelectionSource, ShopSlotId } from './types';

function ShopOfferSkeletonTile() {
  return (
    <div
      className="flex min-h-[4.5rem] flex-row items-center gap-3 rounded border-2 border-dashed border-border/25 bg-muted/10 p-3"
      aria-hidden
    >
      <div className="h-14 w-14 shrink-0 animate-pulse rounded bg-muted/40" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3.5 max-w-[85%] animate-pulse rounded bg-muted/35" />
        <div className="h-3 w-16 animate-pulse rounded bg-muted/25" />
      </div>
    </div>
  );
}

type Props = {
  gold: number;
  shopSlots: (ShopItem | null)[];
  equipped: Partial<Record<ShopSlotId, ShopItem | undefined>>;
  highlightSlotId: ShopSlotId | null;
  slotOrder: ShopSlotId[];
  refreshing: boolean;
  suppressTooltip: boolean;
  showSellOverlay: boolean;
  onHoverShopItem: (item: ShopItem | null) => void;
  peekDragSource: () => ShopSelectionSource | null;
  setDragOverZone: (z: string | null) => void;
  onDragStart: (e: React.DragEvent, item: ShopItem, source: ShopSelectionSource) => void;
  onDragEnd: () => void;
  onDropOnSellZone: (e: React.DragEvent) => void;
  onDoubleClickBuy?: (item: ShopItem) => void;
};

export function ShopOffersSection({
  gold,
  shopSlots,
  equipped,
  highlightSlotId,
  slotOrder,
  refreshing,
  suppressTooltip,
  showSellOverlay,
  onHoverShopItem,
  peekDragSource,
  setDragOverZone,
  onDragStart,
  onDragEnd,
  onDropOnSellZone,
  onDoubleClickBuy,
}: Props) {
  const { t } = useTranslation();

  return (
    <section className="card-pirate flex flex-col overflow-visible p-3 sm:p-4">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
        <Store className="h-4 w-4 shrink-0 text-primary" />
        {t('store')}
      </h2>
      <div className="relative min-h-0">
        {showSellOverlay && !refreshing ? (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center rounded border-2 border-dashed border-accent/70 bg-background/90 p-2 shadow-inner"
            onDragOver={(e) => {
              const src = peekDragSource();
              if (src === 'inventory' || src === 'equipped') {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'move';
                setDragOverZone('shop-sell');
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDropOnSellZone(e);
            }}
          >
            <p className="pointer-events-none px-2 text-center font-display text-[11px] font-bold uppercase leading-snug text-accent sm:text-sm">
              {t('storePage.dropToSell')}
            </p>
          </div>
        ) : null}
        {refreshing ? (
          <div className="space-y-3" aria-busy aria-live="polite" aria-label={t('storePage.refreshingOffer')}>
            <p className="text-center font-display text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('storePage.refreshingOffer')}
            </p>
            <div className="grid grid-cols-1 content-start gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {slotOrder.map((_, index) => (
                <div key={`shop-skel-${index}`} className="overflow-visible">
                  <ShopOfferSkeletonTile />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 content-start gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {shopSlots.map((item, index) => {
              const displaySlotId = item?.slotId ?? slotOrder[index] ?? 'helmet';
              const canAfford = item == null || gold >= item.price;
              const categoryHighlight =
                highlightSlotId != null && displaySlotId === highlightSlotId;
              return (
                <div key={item?.storeSlotId ?? `empty-${index}`} className="overflow-visible">
                  <ShopSlotTile
                    slotId={displaySlotId}
                    item={item}
                    canAfford={canAfford}
                    categoryHighlight={categoryHighlight}
                    comparedEquipped={item ? (equipped[item.slotId] ?? null) : null}
                    suppressTooltip={suppressTooltip}
                    onHoverChange={onHoverShopItem}
                    onDragStart={(e, dragItem) => {
                      onDragStart(e, dragItem, 'shop');
                      setShopDragImage(e, dragItem, t(dragItem.nameKey));
                    }}
                    onDragEnd={onDragEnd}
                    onDoubleClickBuy={onDoubleClickBuy}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
