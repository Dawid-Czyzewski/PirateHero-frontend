import { ArrowDown, ArrowUp, Coins, Hammer } from 'lucide-react';
import { useLayoutEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { RARITY_BORDER, RARITY_COLOR, RARITY_GLOW } from '@/data/gameItems';
import type { GameItem, ItemStats } from '@/features/game/character/characterTypes';
import { translateWearableItemName, translateWearableItemFlavor } from '@/features/game/character/wearableItemDisplayName';
import { statColors, statIcons } from './characterPageConfig';

export type CharacterTooltipPosition = 'left' | 'right' | 'bottom' | 'top';

type CardProps = {
  item: GameItem;
  comparedItem?: GameItem | null;
  gold?: number;
  upgrading?: boolean;
  onUpgrade?: (itemId: string) => void | Promise<void>;
};

function CharacterItemTooltipCard({ item, comparedItem, gold = 0, upgrading = false, onUpgrade }: CardProps) {
  const { t } = useTranslation();
  const statKeys = Object.keys(statIcons) as (keyof ItemStats)[];
  const flavor = translateWearableItemFlavor(t, item.nameKey);
  const canUpgrade =
    !!onUpgrade &&
    item.upgradeLevel < item.maxUpgradeLevel &&
    item.nextUpgradeCost != null &&
    gold >= item.nextUpgradeCost;

  return (
    <div
      className={`relative isolate w-full overflow-hidden rounded-lg border-2 ${RARITY_BORDER[item.rarity]} p-3 shadow-2xl ${RARITY_GLOW[item.rarity]}`}
      style={{ backgroundColor: '#151b26', opacity: 1, backdropFilter: 'none', mixBlendMode: 'normal' }}
    >
      <div className="absolute inset-0 z-0 bg-[#151b26]" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-bold ${RARITY_COLOR[item.rarity]}`}>{translateWearableItemName(t, item)}</p>
          {item.upgradeLevel > 0 ? (
            <span className="shrink-0 rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              +{item.upgradeLevel}
            </span>
          ) : null}
        </div>
        <p className="text-[10px] text-muted-foreground">
          {t(`characterPage.slots.${item.slot}`)} • {t(`characterPage.rarity.${item.rarity}`)}
        </p>
        {flavor ? <p className="mt-1 text-[10px] italic leading-snug text-muted-foreground/90">{flavor}</p> : null}
        <div className="mt-2 space-y-1 border-t border-border/30 pt-2">
          {statKeys
            .filter((key) => {
              const val = item.stats[key] ?? 0;
              const comparedVal = comparedItem?.stats[key] ?? 0;
              return comparedItem ? val !== 0 || comparedVal !== 0 : val !== 0;
            })
            .map((key) => {
              const val = item.stats[key] ?? 0;
              const Icon = statIcons[key];
              const comparedVal = comparedItem?.stats[key] ?? 0;
              const diff = val - comparedVal;
              const diffLabel = diff > 0 ? `+${diff}` : `${diff}`;
              return (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Icon className={`h-3 w-3 ${statColors[key]}`} />
                    {t(`characterPage.stats.${key}`)}
                  </span>
                  <span className="flex items-center gap-1 font-bold tabular-nums">
                    <span>{val}</span>
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
        <div className="mt-2 flex items-center gap-1 border-t border-border/30 pt-2 text-[10px] text-muted-foreground">
          <Coins className="h-3 w-3 text-primary/60" /> {t('characterPage.sellFor')}:{' '}
          <span className="font-bold text-primary">{item.sellPrice}</span>
        </div>
        {onUpgrade ? (
          <div className="mt-2 border-t border-border/30 pt-2">
            {item.upgradeLevel >= item.maxUpgradeLevel ? (
              <p className="text-[10px] text-muted-foreground">{t('characterPage.workshop.maxLevel')}</p>
            ) : (
              <>
                <p className="mb-1.5 text-[10px] text-muted-foreground">
                  {t('characterPage.workshop.levelLine', {
                    level: item.upgradeLevel,
                    max: item.maxUpgradeLevel,
                  })}
                  {item.nextUpgradeCost != null
                    ? ` · ${t('characterPage.workshop.cost', { gold: item.nextUpgradeCost })}`
                    : ''}
                </p>
                <button
                  type="button"
                  className="pointer-events-auto inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary/90 px-2 py-1.5 text-[11px] font-bold text-primary-foreground transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canUpgrade || upgrading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void onUpgrade(item.id);
                  }}
                >
                  <Hammer className="h-3 w-3" aria-hidden />
                  {upgrading
                    ? t('characterPage.workshop.upgrading')
                    : t('characterPage.workshop.upgrade')}
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const TOOLTIP_WIDTH = 224;
const PAD = 8;
const TOOLTIP_HEIGHT_GUESS = 200;

function computeFixedStyle(
  rect: DOMRect,
  prefer: CharacterTooltipPosition
): { left: number; top: number; transform: string; width: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(TOOLTIP_WIDTH, vw - PAD * 2);

  if (prefer === 'left') {
    const left = Math.min(rect.right + PAD, vw - width - PAD);
    const top = Math.max(PAD, Math.min(rect.top, vh - TOOLTIP_HEIGHT_GUESS - PAD));
    return { left, top, transform: 'none', width };
  }
  if (prefer === 'right') {
    const left = Math.max(PAD, rect.left - width - PAD);
    const top = Math.max(PAD, Math.min(rect.top, vh - TOOLTIP_HEIGHT_GUESS - PAD));
    return { left, top, transform: 'none', width };
  }

  let left = rect.left + rect.width / 2 - width / 2;
  left = Math.max(PAD, Math.min(left, vw - width - PAD));

  const spaceAbove = rect.top;
  const placeAbove = prefer === 'top' ? spaceAbove >= TOOLTIP_HEIGHT_GUESS || spaceAbove >= vh * 0.35 : false;
  const forceAbove = prefer === 'top' && spaceAbove > 120;
  const above = prefer === 'bottom' ? false : placeAbove || forceAbove;

  if (above) {
    return {
      left,
      top: Math.max(PAD, rect.top - PAD),
      transform: 'translateY(-100%)',
      width,
    };
  }

  return {
    left,
    top: Math.min(rect.bottom + PAD, vh - PAD),
    transform: 'none',
    width,
  };
}

type PortalProps = CardProps & {
  show: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  position: CharacterTooltipPosition;
  onTooltipEnter?: () => void;
  onTooltipLeave?: () => void;
};

export function CharacterItemTooltipPortal({
  show,
  anchorRef,
  position,
  item,
  comparedItem,
  gold,
  upgrading,
  onUpgrade,
  onTooltipEnter,
  onTooltipLeave,
}: PortalProps) {
  const [style, setStyle] = useState({ left: 0, top: 0, transform: 'none', width: TOOLTIP_WIDTH });

  useLayoutEffect(() => {
    if (!show) return;
    const update = () => {
      const r = anchorRef.current?.getBoundingClientRect();
      if (r) setStyle(computeFixedStyle(r, position));
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [show, anchorRef, position]);

  if (!show) return null;

  return createPortal(
    <div
      className={onUpgrade ? 'pointer-events-auto relative' : 'pointer-events-none relative'}
      style={{
        position: 'fixed',
        left: style.left,
        top: style.top,
        width: style.width,
        zIndex: 250000,
        transform: style.transform,
      }}
      onMouseEnter={onTooltipEnter}
      onMouseLeave={onTooltipLeave}
    >
      <CharacterItemTooltipCard
        item={item}
        comparedItem={comparedItem}
        gold={gold}
        upgrading={upgrading}
        onUpgrade={onUpgrade}
      />
    </div>,
    document.body
  );
}

export function CharacterItemTooltip({
  item,
  comparedItem,
  position,
  gold,
  upgrading,
  onUpgrade,
}: CardProps & { position: CharacterTooltipPosition }) {
  const positionClass =
    position === 'top'
      ? 'bottom-full left-1/2 mb-2 -translate-x-1/2'
      : position === 'bottom'
        ? 'left-1/2 top-full mt-2 -translate-x-1/2'
        : position === 'left'
          ? 'left-full top-0 ml-2'
          : 'right-full top-0 mr-2';

  return (
    <div
      className={`absolute z-[9999] w-56 max-w-[calc(100vw-1rem)] ${onUpgrade ? 'pointer-events-auto' : 'pointer-events-none'} ${positionClass}`}
    >
      <CharacterItemTooltipCard
        item={item}
        comparedItem={comparedItem}
        gold={gold}
        upgrading={upgrading}
        onUpgrade={onUpgrade}
      />
    </div>
  );
}
