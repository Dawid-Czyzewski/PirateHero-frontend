import type { RankingTabId } from './RankingTabs';

type Props = {
  activeTab: RankingTabId;
};

export function RankingTableSkeleton({ activeTab }: Props) {
  const colWidths =
    activeTab === 'players'
      ? ['w-10', 'w-36', 'w-28', 'w-20', 'w-16']
      : ['w-10', 'w-40', 'w-24', 'w-20', 'w-16'];

  return (
    <div
      className="animate-pulse space-y-3"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="hidden rounded-lg border border-border/50 md:block">
        <div className="flex gap-4 border-b border-border/40 px-4 py-3">
          {colWidths.map((w, i) => (
            <div key={i} className={`h-4 ${w} rounded bg-muted/45`} />
          ))}
        </div>
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="flex gap-4 border-b border-border/30 px-4 py-3 last:border-0">
            {colWidths.map((w, i) => (
              <div key={i} className={`h-4 ${w} rounded bg-muted/35`} />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-2 md:hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-20 rounded-lg border border-border/40 bg-muted/25" />
        ))}
      </div>
    </div>
  );
}
