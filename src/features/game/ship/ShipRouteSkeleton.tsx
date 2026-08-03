import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export function ShipRouteSkeleton() {
  return (
    <div
      className="w-full max-w-none animate-pulse space-y-5 py-4 sm:py-6"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className={`${gamePageTitleH1Class} h-9 w-36 rounded bg-muted/50`} />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-9 w-24 rounded-lg bg-muted/40" />
        ))}
      </div>
      <div className="rounded-xl border border-border/40 bg-card/25 p-5 space-y-4">
        <div className="h-5 w-48 rounded bg-muted/45" />
        <div className="h-32 w-full rounded-lg bg-muted/30" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-24 rounded-lg bg-muted/35" />
          <div className="h-24 rounded-lg bg-muted/35" />
        </div>
      </div>
    </div>
  );
}
