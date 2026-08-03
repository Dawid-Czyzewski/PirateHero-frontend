import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export function DungeonsHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className={gamePageTitleH1Class}>{t('dungeons')}</h1>
      <button
        type="button"
        onClick={() => navigate('/game/bestiary')}
        className="inline-flex cursor-pointer items-center rounded-lg border border-primary/30 bg-card px-3 py-2 font-heading text-xs font-bold uppercase tracking-wider text-primary transition hover:border-primary/50 hover:bg-primary/10 sm:text-sm"
      >
        {t('bestiaryPage.openFromDungeons')}
      </button>
    </div>
  );
}
