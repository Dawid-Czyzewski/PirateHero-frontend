import { History, RefreshCw } from 'lucide-react';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction;
  showHistory: boolean;
  onToggleHistory: () => void;
  refreshing: boolean;
  onRefresh: () => void;
};

export function ArenaListHeaderActions({
  t,
  showHistory,
  onToggleHistory,
  refreshing,
  onRefresh,
}: Props) {
  return (
    <>
      <button
        type="button"
        onClick={onToggleHistory}
        className={`cursor-pointer rounded-lg border border-white/12 bg-black/25 p-2.5 transition-colors hover:bg-black/35 ${showHistory ? 'border-primary/45 ring-1 ring-primary/25' : ''}`}
        title={String(t('arenaPage.historyTitle'))}
        aria-expanded={showHistory}
        aria-label={String(t('arenaPage.historyTitle'))}
      >
        <History className="h-4 w-4 text-primary" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="cursor-pointer rounded-lg border border-white/12 bg-black/25 p-2.5 transition-colors hover:bg-black/35 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={String(t('arenaPage.refreshList'))}
      >
        <RefreshCw className={`h-4 w-4 text-primary ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
      </button>
    </>
  );
}
