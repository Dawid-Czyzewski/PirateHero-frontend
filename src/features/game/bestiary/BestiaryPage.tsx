import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { BestiaryEntryCardPlaceholder } from './BestiaryEntryCard';
import { BestiaryGrid } from './BestiaryGrid';
import { useBestiaryState, type BestiaryEntryView } from './useBestiaryState';

export default function BestiaryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightEnemyId = searchParams.get('highlight');
  const { user } = useUser();
  const { entries, loading, error, reload } = useBestiaryState(user?.id);

  const discoveredCount = useMemo(
    () => entries.filter((entry) => entry.discovered).length,
    [entries]
  );

  const handleSelect = (entry: BestiaryEntryView) => {
    if (!entry.discovered) return;
    navigate(`/game/bestiary/${entry.enemyId}`);
  };

  return (
    <div className="w-full max-w-none space-y-5 py-4 sm:space-y-6 sm:py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className={gamePageTitleH1Class}>{t('bestiaryPage.title')}</h1>
        <button
          type="button"
          onClick={() => navigate('/game/dungeons')}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:border-primary/40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('bestiaryPage.backToDungeons')}
        </button>
      </div>

      {!loading && !error ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-sm text-muted-foreground">{t('bestiaryPage.hint')}</p>
          <p className="shrink-0 text-xs font-heading uppercase tracking-wider text-muted-foreground">
            {t('bestiaryPage.discoveredCount', { count: discoveredCount, total: entries.length })}
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, idx) => (
            <BestiaryEntryCardPlaceholder key={idx} />
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="space-y-3">
          <p className="text-sm text-destructive">{t('bestiaryPage.loadFailed')}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {t('premiumShopPage.catalogRetry')}
          </button>
        </div>
      ) : null}

      {!loading && !error ? (
        <BestiaryGrid
          entries={entries}
          highlightEnemyId={highlightEnemyId}
          onSelect={handleSelect}
        />
      ) : null}
    </div>
  );
}
