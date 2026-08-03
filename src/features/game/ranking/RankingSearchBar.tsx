import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RankingTabId } from './RankingTabs';

type Props = {
  activeTab: RankingTabId;
  value: string;
  onChange: (value: string) => void;
};

export default function RankingSearchBar({ activeTab, value, onChange }: Props) {
  const { t } = useTranslation();
  const placeholder =
    activeTab === 'players'
      ? t('rankingPage.searchPlayerPlaceholder')
      : t('rankingPage.searchShipPlaceholder');

  return (
    <div className="relative w-full max-w-md">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25"
      />
      {value.trim() !== '' ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
          aria-label={t('rankingPage.clearSearch')}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
