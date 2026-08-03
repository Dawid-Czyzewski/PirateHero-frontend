import { Plus, Sword } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ItemStats } from '@/data/gameItems';
import { statColors, statIcons } from './characterPageConfig';
import {
  CHARACTER_STAT_KEYS,
  type CharacterStatKey,
  resolveAttributePointPrice,
} from './characterSkillPoints';

type Props = {
  baseStats: Required<ItemStats>;
  equipmentTotalStats: Required<ItemStats>;
  statsAfterShopBooster: Required<ItemStats>;
  displayTotalStats: Required<ItemStats>;
  shipBonuses?: {
    active: boolean;
    skillsLevel: number;
  };

  attributeUpgrade?: {
    freePoints: number;
    gold: number;
    prices: Record<string, number | undefined> | undefined;
    onAllocatePoint: (stat: CharacterStatKey) => void;
  };
};

export function CharacterAttributesPanel({
  baseStats,
  equipmentTotalStats,
  statsAfterShopBooster,
  displayTotalStats,
  shipBonuses,
  attributeUpgrade,
}: Props) {
  const { t } = useTranslation();
  const ship = shipBonuses?.active ? shipBonuses : null;

  return (
    <div className="rounded-lg border border-border bg-card/60 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
        <Sword className="h-4 w-4 text-primary" /> {t('characterPage.attributesTitle')}
      </h3>
      {attributeUpgrade && attributeUpgrade.freePoints > 0 && (
        <p className="mb-2 text-[11px] font-medium text-primary">
          {t('characterPage.freeAttributePoints', { count: attributeUpgrade.freePoints })}
        </p>
      )}
      <div className="space-y-3">
        {CHARACTER_STAT_KEYS.map((key) => {
          const Icon = statIcons[key];
          const val = displayTotalStats[key];
          const base = baseStats[key];
          const equipTotal = equipmentTotalStats[key];
          const afterShop = statsAfterShopBooster[key];
          const bonusFromGear = equipTotal - base;
          const bonusFromShop = afterShop - equipTotal;
          const bonusFromShip = val - afterShop;
          const price = attributeUpgrade
            ? resolveAttributePointPrice(attributeUpgrade.prices, key)
            : 0;
          const canFree = attributeUpgrade ? attributeUpgrade.freePoints > 0 : false;
          const canGold = attributeUpgrade ? attributeUpgrade.gold >= price : false;
          const canAdd = attributeUpgrade ? canFree || canGold : false;
          const plusTitle = !attributeUpgrade
            ? ''
            : canFree
              ? t('characterPage.attributeUpgradeFree')
              : canGold
                ? t('characterPage.attributeUpgradeBuy', { price })
                : t('characterPage.attributeNotEnoughGold', {
                    price,
                    gold: attributeUpgrade.gold,
                  });

          return (
            <div
              key={key}
              className="relative rounded-md border border-border/60 bg-background/40 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="group/stat relative flex min-w-0 flex-1 items-center gap-2">
                  <Icon className={`h-4 w-4 shrink-0 ${statColors[key]}`} />
                  <span className="min-w-0 truncate text-sm text-foreground">
                    {t(`characterPage.stats.${key}`)}
                  </span>
                  <span className="ml-auto shrink-0 font-heading text-lg font-bold tabular-nums text-foreground">
                    {val}
                  </span>
                  <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md border border-border bg-card p-2 text-left text-[11px] leading-snug shadow-xl group-hover/stat:block">
                    <p className="text-muted-foreground">
                      {t('characterPage.baseStatLabel')}: {base}
                    </p>
                    {bonusFromGear !== 0 ? (
                      <p className="text-green-400">
                        <span className="font-semibold tabular-nums">{bonusFromGear}</span>{' '}
                        {t('characterPage.bonusFromGear')}
                      </p>
                    ) : null}
                    {bonusFromShop > 0 ? (
                      <p className="text-sky-300">
                        {t('characterPage.bonusFromShopBooster', { delta: bonusFromShop })}
                      </p>
                    ) : null}
                    {ship && ship.skillsLevel > 0 ? (
                      <p className="text-violet-300">
                        {t('characterPage.bonusFromShipSkills', { delta: bonusFromShip })}
                      </p>
                    ) : null}
                  </div>
                </div>
                {attributeUpgrade ? (
                  <div className="group/plus relative inline-flex shrink-0">
                    <button
                      type="button"
                      disabled={!canAdd}
                      aria-label={plusTitle}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-bold shadow-sm transition ${
                        canAdd
                          ? 'cursor-pointer border-primary/60 bg-primary/20 text-primary hover:bg-primary/30'
                          : 'cursor-not-allowed border-border/40 bg-muted/20 text-muted-foreground'
                      }`}
                      onClick={() => {
                        if (!canAdd) return;
                        attributeUpgrade.onAllocatePoint(key);
                      }}
                    >
                      <Plus className="h-5 w-5" strokeWidth={2.5} />
                    </button>
                    <div
                      role="tooltip"
                      className="pointer-events-none invisible absolute bottom-full left-1/2 z-[60] mb-2 w-max max-w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-border/80 bg-popover px-3 py-2 text-center text-xs font-medium leading-snug text-popover-foreground shadow-lg opacity-0 ring-1 ring-black/5 transition-none duration-0 group-hover/plus:visible group-hover/plus:opacity-100 dark:ring-white/10"
                    >
                      {plusTitle}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
