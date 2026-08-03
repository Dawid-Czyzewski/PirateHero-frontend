import { useTranslation } from 'react-i18next';
import type { ItemStats } from '@/data/gameItems';
import { Sword } from 'lucide-react';
import { CHARACTER_STAT_KEYS } from '@/features/game/character/characterSkillPoints';
import { statColors, statIcons } from '@/features/game/character/characterPageConfig';

type Props = {
  baseStats: Required<ItemStats>;
  equipmentTotals: Required<ItemStats>;
  statsAfterShopBooster: Required<ItemStats>;
  displayTotals: Required<ItemStats>;
  diffAgainstTotals?: Required<ItemStats> | null;
  shipBonuses?: { active: boolean; skillsLevel: number };
};

export function StoreAttributesPanel({
  baseStats,
  equipmentTotals,
  statsAfterShopBooster,
  displayTotals,
  diffAgainstTotals = null,
  shipBonuses,
}: Props) {
  const { t } = useTranslation();
  const ship = shipBonuses?.active ? shipBonuses : null;

  return (
    <div className="rounded-lg border border-border bg-card/60 p-4">
      <h3 className="mb-3 flex flex-wrap items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
        <Sword className="h-4 w-4 text-primary" /> {t('characterPage.attributesTitle')}
        {diffAgainstTotals ? (
          <span className="ml-auto text-[10px] font-semibold normal-case tracking-tight text-primary/90 sm:text-xs">
            {t('storePage.attributesPreviewHint')}
          </span>
        ) : null}
      </h3>
      <div className="space-y-3">
        {CHARACTER_STAT_KEYS.map((key) => {
          const Icon = statIcons[key];
          const val = displayTotals[key];
          const base = baseStats[key];
          const equipNoShop = equipmentTotals[key];
          const afterShop = statsAfterShopBooster[key];
          const bonusFromGear = equipNoShop - base;
          const bonusFromShop = afterShop - equipNoShop;
          const bonusFromShip = val - afterShop;
          const diffVsCurrent =
            diffAgainstTotals != null ? val - diffAgainstTotals[key] : null;

          return (
            <div key={key} className="relative rounded-md border border-border/60 bg-background/40 px-3 py-2">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="group/stat relative flex min-w-0 flex-1 items-center gap-2">
                  <Icon className={`h-4 w-4 shrink-0 ${statColors[key]}`} />
                  <span className="min-w-0 truncate text-sm text-foreground">{t(`characterPage.stats.${key}`)}</span>
                  <span className="ml-auto flex shrink-0 items-baseline gap-1.5">
                    <span className="font-heading text-lg font-bold tabular-nums text-foreground">{val}</span>
                    {diffVsCurrent !== null ? (
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          diffVsCurrent > 0
                            ? 'text-green-400'
                            : diffVsCurrent < 0
                              ? 'text-red-400'
                              : 'text-muted-foreground/70'
                        }`}
                      >
                        ({diffVsCurrent > 0 ? '+' : ''}
                        {diffVsCurrent})
                      </span>
                    ) : null}
                  </span>
                  <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-56 -translate-x-1/2 rounded-md border border-border bg-card p-2 text-[11px] shadow-xl group-hover/stat:block">
                    <p className="text-muted-foreground">
                      {t('characterPage.baseStatLabel')}: {base}
                    </p>
                    <p className="text-green-400">
                      +{bonusFromGear} {t('characterPage.bonusFromGear')}
                    </p>
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
