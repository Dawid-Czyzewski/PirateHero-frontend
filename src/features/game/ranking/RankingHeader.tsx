import { useTranslation } from 'react-i18next';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export default function RankingHeader() {
  const { t } = useTranslation();

  return <h1 className={gamePageTitleH1Class}>{t('ranking')}</h1>;
}
