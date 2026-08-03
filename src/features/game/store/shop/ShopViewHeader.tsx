import { Gem, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export type ShopRefreshMeta = {
  isFreeRefreshAvailable: boolean;
  refreshCost: number;
};

type Props = {
  onRefresh: () => void;
  refreshing: boolean;
  refreshMeta: ShopRefreshMeta;
  diamonds: number;
};

export function ShopViewHeader({ onRefresh, refreshing, refreshMeta, diamonds }: Props) {
  const { t } = useTranslation();
  const isFree = refreshMeta.isFreeRefreshAvailable;
  const cost = Math.max(0, Number(refreshMeta.refreshCost ?? 0));
  const canRefresh = isFree || diamonds >= cost;

  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <h1 className={gamePageTitleH1Class}>
        {t('store')}
      </h1>
      <button
        type="button"
        onClick={() => {
          if (!canRefresh || refreshing) return;
          void onRefresh();
        }}
        disabled={refreshing || !canRefresh}
        title={!canRefresh && !isFree ? t('not_enough_diamonds') : t('storePage.refresh')}
        className={`card-pirate flex max-w-full cursor-pointer items-center gap-2 rounded-md border px-3 py-2 font-display text-xs font-bold uppercase transition-all ${
          refreshing || !canRefresh
            ? 'cursor-not-allowed border-border/60 opacity-50 text-muted-foreground'
            : 'border-primary/25 text-muted-foreground hover:border-primary/40 hover:text-primary'
        }`}
      >
        <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${refreshing ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">{t('storePage.refresh')}</span>
        {isFree ? (
          <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-emerald-300">
            {t('storePage.refreshFreeBadge')}
          </span>
        ) : (
          <span
            className={`inline-flex shrink-0 items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold normal-case tracking-normal tabular-nums ${
              canRefresh ? 'bg-sky-500/15 text-sky-200' : 'bg-destructive/20 text-destructive'
            }`}
          >
            <Gem className="h-3 w-3 text-sky-400" aria-hidden />
            {t('storePage.refreshCostDiamonds', { count: cost })}
          </span>
        )}
      </button>
    </header>
  );
}
