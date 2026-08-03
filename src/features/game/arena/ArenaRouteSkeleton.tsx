import { ArenaOpponentSkeleton } from './ArenaOpponentSkeleton';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export function ArenaRouteSkeleton() {
  return (
    <div
      className="w-full space-y-4 px-2 sm:px-4"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <header className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className={`${gamePageTitleH1Class} h-9 w-32 animate-pulse rounded bg-muted/50`} />
        <div className="flex gap-2">
          <div className="h-9 w-24 animate-pulse rounded-lg bg-muted/40" />
          <div className="h-9 w-24 animate-pulse rounded-lg bg-muted/40" />
        </div>
      </header>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <ArenaOpponentSkeleton key={i} delayMs={i * 80} />
        ))}
      </div>
    </div>
  );
}
