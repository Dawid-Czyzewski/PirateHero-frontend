import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { BestiaryEntryCardPlaceholder } from './BestiaryEntryCard';
import { formatBestiaryDefeatedAt } from './bestiaryFormat';
import { useBestiaryState } from './useBestiaryState';

export default function BestiaryEntryPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { enemyId } = useParams<{ enemyId: string }>();
  const { user } = useUser();
  const { entries, loading, error, reload } = useBestiaryState(user?.id);

  const entry = entries.find((item) => item.enemyId === enemyId);

  useEffect(() => {
    if (loading || error) return;
    if (!entry || !entry.discovered) {
      navigate('/game/bestiary', { replace: true });
    }
  }, [entry, error, loading, navigate]);

  if (loading) {
    return (
      <div className="w-full max-w-none py-4 sm:py-6">
        <BestiaryEntryCardPlaceholder />
      </div>
    );
  }

  if (error || !entry || !entry.discovered) {
    return (
      <div className="w-full max-w-none space-y-4 py-4 sm:py-6">
        <p className="text-sm text-destructive">{t('bestiaryPage.loadFailed')}</p>
        <button
          type="button"
          onClick={() => void reload()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {t('premiumShopPage.catalogRetry')}
        </button>
      </div>
    );
  }

  const defeatedLabel = formatBestiaryDefeatedAt(
    entry.defeatedAt,
    i18n.language,
    t('bestiaryPage.defeatedAtUnknown')
  );

  const loreParagraphs = (() => {
    const loreContent = t(entry.loreKey, { returnObjects: true });
    if (Array.isArray(loreContent)) {
      return loreContent.filter((paragraph): paragraph is string => typeof paragraph === 'string');
    }
    const single = t(entry.loreKey);
    return single ? [single] : [];
  })();

  return (
    <div className="w-full max-w-none space-y-6 py-4 sm:space-y-8 sm:py-6">
      <button
        type="button"
        onClick={() => navigate('/game/bestiary')}
        className="inline-flex cursor-pointer items-center gap-2 font-heading text-xs uppercase tracking-wider text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t('bestiaryPage.backToBestiary')}
      </button>

      <div className="grid w-full gap-6 lg:grid-cols-[minmax(260px,380px)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(280px,420px)_minmax(0,1fr)] xl:gap-10 2xl:gap-14">
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-primary/25 bg-muted/10 shadow-[0_0_40px_hsl(42,90%,50%,0.08)]">
            <img
              src={entry.portraitSrc}
              alt=""
              className="aspect-[4/5] w-full object-cover object-center"
            />
          </div>
          <div className="space-y-2 rounded-xl border border-border/50 bg-card/50 p-4 sm:p-5">
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-primary">
              {t(entry.dungeonNameKey)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('bestiaryPage.stageLabel', { stage: entry.stage })}
            </p>
            <p className="border-t border-border/40 pt-3 text-sm text-muted-foreground">
              {t('bestiaryPage.defeatedAt')}:{' '}
              <span className="text-foreground">{defeatedLabel}</span>
            </p>
          </div>
        </aside>

        <article className="min-w-0 space-y-6">
          <header className="space-y-3 border-b border-border/40 pb-6">
            <span className="inline-flex rounded-full border border-emerald-400/35 bg-emerald-950/30 px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              {t('bestiaryPage.defeated')}
            </span>
            <h1 className={gamePageTitleH1Class}>{t(entry.nameKey)}</h1>
          </header>

          <section className="w-full rounded-2xl border border-border/50 bg-card/40 p-6 sm:p-8 lg:p-10 xl:p-12">
            <h2 className="mb-8 font-heading text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {t('bestiaryPage.loreHeading')}
            </h2>
            <div className="w-full space-y-6 text-base leading-8 text-foreground/95 sm:text-lg sm:leading-9 lg:text-xl lg:leading-10">
              {loreParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
