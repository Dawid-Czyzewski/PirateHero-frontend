import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Beer, Dices, ScrollText } from 'lucide-react';
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
    <section className="w-full space-y-6" aria-label={t('tavernPage.pageAriaLabel')}>
      <div>
        <div className="flex items-center gap-2">
          <Beer className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <h1 className={gamePageTitleH1Class}>{t('tavernPage.title')}</h1>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t('tavernPage.subtitle')}</p>
      </div>

      <div
        className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1.5"
        role="tablist"
        aria-label={t('tavernPage.tabsAria')}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'dice'}
          onClick={() => setTab('dice')}
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-3 font-heading text-[11px] uppercase tracking-wide transition sm:text-xs ${
            tab === 'dice'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
          }`}
        >
          <Dices className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {t('tavernPage.tabs.dice')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'jobs'}
          onClick={() => setTab('jobs')}
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-3 font-heading text-[11px] uppercase tracking-wide transition sm:text-xs ${
            tab === 'jobs'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
          }`}
        >
          <ScrollText className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {t('tavernPage.tabs.jobs')}
        </button>
      </div>

      <div role="tabpanel">{tab === 'dice' ? <TavernDicePanel /> : <TavernJobsPanel />}</div>
    </section>
  );
}
