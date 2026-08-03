import { ChevronDown, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopBoosterDefinition } from '@/features/game/boosters/shopBoosterCatalog';
import { shopBoosterEffectLabel, shopBoosterName } from '@/features/game/boosters/shopBoosterI18n';
import { formatBoosterActiveLabels, resolveDateLocale } from '@/features/game/boosters/boostersPageFormat';

type ActiveEntry = { booster: ShopBoosterDefinition; expiresAt: number };

type Props = {
  visibleActive: ActiveEntry[];
  nowMs: number;
  expanded: boolean;
  onToggleExpanded: () => void;
};

export function BoostersPageActiveSection({ visibleActive, nowMs, expanded, onToggleExpanded }: Props) {
  const { t, i18n } = useTranslation();
  const dateLocale = resolveDateLocale(i18n.language);

  if (visibleActive.length === 0) return null;

  return (
    <section aria-label={t('boostersPage.activeSectionAria')} className="space-y-2">
      <button
        type="button"
        id="active-boosters-toggle"
        aria-expanded={expanded}
        aria-controls="active-boosters-list"
        onClick={onToggleExpanded}
        className="group flex w-full max-w-full cursor-pointer items-center gap-2 rounded-lg py-1 text-left transition hover:bg-white/5"
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-yellow-400/90 transition-transform duration-200 ${
            expanded ? 'rotate-0' : '-rotate-90'
          }`}
          aria-hidden
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
          {t('boostersPage.activeSectionToggle')}
        </span>
        <span className="text-[11px] font-medium tabular-nums text-gray-500">({visibleActive.length})</span>
      </button>
      {expanded ? (
        <div id="active-boosters-list" role="region" aria-labelledby="active-boosters-toggle" className="flex flex-col gap-2">
          {visibleActive.map((entry) => {
            const labels = formatBoosterActiveLabels(entry.expiresAt, nowMs, dateLocale);
            return (
              <article
                key={`${entry.booster.id}-${entry.expiresAt}`}
                className="flex max-w-full flex-col gap-1 rounded-lg border border-yellow-400/30 bg-yellow-500/10 px-3 py-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Timer className="h-4 w-4 shrink-0 text-yellow-300" />
                  <span className="font-semibold text-yellow-100">{shopBoosterName(t, entry.booster)}</span>
                </div>
                <span className="min-w-0 text-xs text-yellow-200/85">
                  {shopBoosterEffectLabel(t, entry.booster)}
                </span>
                {labels ? (
                  <span className="shrink-0 whitespace-nowrap text-[11px] text-yellow-300/95">
                    {t('boostersPage.activeUntilLine', { until: labels.until, countdown: labels.countdown })}
                  </span>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
