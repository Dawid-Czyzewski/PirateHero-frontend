import { useTranslation } from 'react-i18next';
import type { RankingTabId } from './RankingTabs';

type Props = {
  activeTab: RankingTabId;
  searchQuery?: string;
};

export default function RankingEmptyState({ activeTab, searchQuery }: Props) {
  const { t } = useTranslation();
  const trimmed = searchQuery?.trim() ?? '';

  return (
    <div className="rounded-lg border border-border py-12 text-center text-muted-foreground">
      {trimmed !== ''
        ? t('rankingPage.noSearchResults', { query: trimmed })
        : activeTab === 'players'
          ? t('noPlayersInRanking')
          : t('noStatekiInRanking')}
    </div>
  );
}
