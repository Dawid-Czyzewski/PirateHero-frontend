import { usePageMeta } from '@/hooks/usePageMeta';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PlayerTitlesSection } from '@/features/game/titles/PlayerTitlesSection';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export default function TitlesPage() {
  const { t } = useTranslation();

  usePageMeta({
    title: t('titlesPage.seoTitle'),
    description: t('titlesPage.seoDescription'),
    openGraph: true,
  });

  return (
    <div className="w-full space-y-5 px-2 py-4 sm:px-4 lg:px-6">
      <header className="flex w-full flex-col items-start gap-2">
        <Link
          to="/game/character"
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          {t('character')}
        </Link>
        <h1 className={`${gamePageTitleH1Class} min-w-0`}>{t('titlesPage.title')}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{t('titlesPage.subtitle')}</p>
      </header>

      <PlayerTitlesSection />
    </div>
  );
}
