import { useTranslation } from 'react-i18next';
import type { RankingTabId } from './RankingTabs';

type Props = {
  activeTab: RankingTabId;
};

export default function RankingLoadingState({ activeTab }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center py-12">
      <p className="animate-pulse text-muted-foreground">
        {activeTab === 'players' ? t('loadingPlayers') : t('loadingStateki')}
      </p>
    </div>
  );
}
