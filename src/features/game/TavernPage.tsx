import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Beer } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { TavernDicePanel } from '@/features/game/tavern/TavernDicePanel';
import { TavernJobsPanel } from '@/features/game/tavern/TavernJobsPanel';

type TavernTab = 'dice' | 'jobs';

export default function TavernPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TavernTab>('dice');

  usePageMeta({
    title: t('tavernPage.seoTitle'),
    description: t('tavernPage.seoDescription'),
    openGraph: true,
  });

  return (
    <section className="mx-auto w-full max-w-lg space-y-4" aria-label={t('tavernPage.pageAriaLabel')}>
      <div className="flex items-center gap-2">
        <Beer className="h-5 w-5 text-primary" aria-hidden />
        <h1 className={gamePageTitleH1Class}>{t('tavernPage.title')}</h1>
      </div>

      <div
        className="sticky top-0 z-10 -mx-1 grid grid-cols-2 gap-1 border-b border-border/40 bg-[hsl(220,25%,9%)]/95 px-1 py-2 backdrop-blur-sm"
        role="tablist"
        aria-label={t('tavernPage.tabsAria')}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'dice'}
          onClick={() => setTab('dice')}
          className={`rounded-lg px-3 py-3 text-sm font-bold uppercase tracking-wide transition ${
            tab === 'dice'
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground'
          }`}
        >
          {t('tavernPage.tabs.dice')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'jobs'}
          onClick={() => setTab('jobs')}
          className={`rounded-lg px-3 py-3 text-sm font-bold uppercase tracking-wide transition ${
            tab === 'jobs'
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground'
          }`}
        >
          {t('tavernPage.tabs.jobs')}
        </button>
      </div>

      <div role="tabpanel" className="pt-1">
        {tab === 'dice' ? <TavernDicePanel /> : <TavernJobsPanel />}
      </div>
    </section>
  );
}
