export function ArenaHistorySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="max-h-72 space-y-2.5 overflow-hidden pr-1" aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <li
          key={i}
          className="flex animate-pulse items-center gap-3 rounded-xl border border-border/30 bg-card/20 p-3"
        >
          <div className="h-11 w-11 shrink-0 rounded-xl bg-muted/50" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-full max-w-[12rem] rounded bg-muted/50" />
            <div className="flex gap-2">
              <div className="h-5 w-24 rounded-md bg-muted/40" />
              <div className="h-4 w-28 rounded bg-muted/35" />
            </div>
          </div>
          <div className="h-16 w-[4.5rem] shrink-0 rounded-xl bg-muted/40" />
        </li>
      ))}
    </ul>
  );
}
