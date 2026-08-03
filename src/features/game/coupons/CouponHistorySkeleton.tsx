const ROW_CLASS = 'flex items-center gap-4 rounded-lg border border-border/40 bg-card/40 p-4';

export type CouponHistorySkeletonProps = {
  rows?: number;
};

export function CouponHistorySkeleton({ rows = 4 }: CouponHistorySkeletonProps) {
  return (
    <ul className="animate-pulse space-y-2 p-2" aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className={ROW_CLASS}>
          <div className="h-5 w-5 shrink-0 rounded-full bg-muted/50" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <div className="h-5 w-28 rounded bg-muted/50 font-mono" />
              <div className="h-5 w-24 rounded-full bg-muted/40" />
            </div>
            <div className="h-3 w-40 rounded bg-muted/35" />
          </div>
          <div className="h-5 w-5 shrink-0 rounded bg-muted/45" />
        </li>
      ))}
    </ul>
  );
}
