import { Coins } from 'lucide-react';
import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ShopItemTooltipCard } from './ShopItemTooltip';
import type { ShopItem } from './types';

export type ShopItemPhoneMenuAction = {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'sell';
};

type Props = {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  item: ShopItem;
  comparedItem?: ShopItem | null;
  actions: ShopItemPhoneMenuAction[];
  onClose: () => void;
};

export function ShopItemPhoneMenu({
  open,
  anchorRef,
  item,
  comparedItem = null,
  actions,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [pos, setPos] = useState({ left: 8, top: 8, width: 240, placeAbove: true });
  const sellPrice = Math.floor(item.price * 0.5);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const r = anchorRef.current?.getBoundingClientRect();
      if (!r) return;
      const pad = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(240, vw - pad * 2);
      let left = r.left + r.width / 2 - width / 2;
      left = Math.max(pad, Math.min(left, vw - width - pad));
      const spaceAbove = r.top;
      const placeAbove = spaceAbove >= Math.min(280, vh * 0.45);
      setPos({
        left,
        top: placeAbove ? Math.max(pad, r.top - pad) : Math.min(r.bottom + pad, vh - pad),
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
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[250000]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/50"
        aria-label={t('close')}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute"
        style={{
          left: pos.left,
          top: pos.top,
          width: pos.width,
          transform: pos.placeAbove ? 'translateY(-100%)' : 'none',
        }}
      >
        <ShopItemTooltipCard
          item={item}
          comparedItem={comparedItem}
          priceMode="sell"
          showPrice={false}
        />
        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-border/60 bg-[#151b26] p-2 shadow-xl">
          <p className="flex items-center justify-center gap-1 px-1 text-[11px] text-muted-foreground">
            <Coins className="h-3 w-3 text-primary/70" aria-hidden />
            {t('characterPage.sellFor')}: <span className="font-bold text-primary">{sellPrice}</span>
          </p>
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`min-h-11 w-full cursor-pointer rounded-md px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition ${
                action.variant === 'sell'
                  ? 'border border-primary/50 bg-primary/15 text-primary hover:bg-primary/25'
                  : 'border border-border/50 bg-background/40 text-foreground hover:border-primary/40'
              }`}
              onClick={() => {
                action.onClick();
                onClose();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
