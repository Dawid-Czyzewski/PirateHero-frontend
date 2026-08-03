import { ArrowDown, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RankingTabId } from './RankingTabs';

type Props = {
  activeTab: RankingTabId;
  sortBy: string;
  sortOrder: string;
  onSort: (column: string) => void;
};

export default function RankingMobileSort({ activeTab, sortBy, sortOrder, onSort }: Props) {
  const { t } = useTranslation();

  const playersSortOptions = [
    { value: 'famePoints', label: t('rankingPage.colFame') },
    { value: 'username', label: t('rankingPage.colPlayer') },
    { value: 'level', label: t('rankingPage.colLevel') },
  ];

  const shipsSortOptions = [
    { value: 'totalFamePoints', label: t('rankingPage.colFame') },
    { value: 'title', label: t('rankingPage.colShip') },
    { value: 'memberCount', label: t('rankingPage.colCrew') },
  ];

  const sortOptions = activeTab === 'players' ? playersSortOptions : shipsSortOptions;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
      <span className="text-xs text-muted-foreground">{t('sortBy')}:</span>
      <div className="flex flex-wrap justify-center gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSort(option.value)}
            className={`flex min-h-10 items-center gap-1 rounded-md px-3 py-2 text-xs font-heading font-bold transition-colors ${
              sortBy === option.value
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-foreground hover:bg-muted/30'
            }`}
          >
            {option.label}
            {sortBy === option.value ? (
              sortOrder === 'ASC' ? (
                <ArrowUp className="h-3 w-3 shrink-0" aria-hidden />
              ) : (
                <ArrowDown className="h-3 w-3 shrink-0" aria-hidden />
              )
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
