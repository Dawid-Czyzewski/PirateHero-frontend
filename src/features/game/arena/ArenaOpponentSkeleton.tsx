import { CHARACTER_STAT_KEYS } from '@/features/game/character/characterSkillPoints';

type Props = { delayMs: number };

export function ArenaOpponentSkeleton({ delayMs }: Props) {
  return (
    <div
      className="card-pirate flex min-h-0 flex-col gap-3 p-3 animate-fade-in"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="relative w-full shrink-0">
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted/60" />
        <div className="absolute -bottom-1 -right-1 h-7 w-7 animate-pulse rounded-full bg-muted/80" />
      </div>
      <div className="space-y-2 text-center">
        <div className="mx-auto h-4 w-24 animate-pulse rounded bg-muted/60" />
        <div className="mx-auto flex justify-center gap-1.5">
          <div className="h-5 w-5 animate-pulse rounded bg-muted/50" />
          <div className="h-4 w-14 animate-pulse rounded bg-muted/50" />
        </div>
      </div>
      <div className="flex max-h-[13rem] flex-1 flex-col gap-1.5 py-0.5">
        {CHARACTER_STAT_KEYS.map((k) => (
          <div key={k} className="h-3.5 w-full animate-pulse rounded bg-muted/35" />
        ))}
      </div>
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted/60" />
    </div>
  );
}
