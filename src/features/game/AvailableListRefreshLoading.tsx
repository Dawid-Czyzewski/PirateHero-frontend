import { Loader2 } from 'lucide-react';
import { MissionCompassInCircle } from '@/features/game/missions/MissionCompassInCircle';
import { TrainingDumbbellInCircle } from '@/features/game/trainings/TrainingDumbbellInCircle';
import { WorksCoinsInCircle } from '@/features/game/works/WorksCoinsInCircle';

const GHOST_ROW =
  'flex gap-3 rounded-lg border border-white/[0.05] bg-black/20 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]';

type Props = {
  variant: 'missions' | 'trainings' | 'works';
  message: string;
};

export function AvailableListRefreshLoading({ variant, message }: Props) {
  const isMissions = variant === 'missions';
  const isWorks = variant === 'works';

  const panelClass = isMissions || isWorks
    ? 'border-[hsl(43,40%,26%)]/45 bg-[hsl(220_18%_16%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(0,0,0,0.2)]'
    : 'border-emerald-900/45 bg-[hsl(220_18%_16%)] shadow-[inset_0_1px_0_0_rgba(16,185,129,0.07),0_0_0_1px_rgba(0,0,0,0.2)]';

  const glowClass = isMissions || isWorks
    ? 'bg-[hsl(43,78%,52%)]/25'
    : 'bg-[hsl(142,65%,48%)]/20';

  const spinnerClass = isMissions || isWorks
    ? 'text-[hsl(43,82%,58%)] drop-shadow-[0_0_10px_rgba(234,179,8,0.35)]'
    : 'text-[hsl(142,71%,52%)] drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]';

  const shimmerGradient = isMissions || isWorks
    ? 'from-transparent via-[hsl(43,78%,52%)]/35 to-transparent'
    : 'from-transparent via-emerald-400/30 to-transparent';

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${panelClass}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${glowClass}`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full blur-2xl opacity-60 ${glowClass}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />

      <div className="relative space-y-5 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative shrink-0">
              <div
                className={`absolute inset-0 scale-[1.35] animate-pulse rounded-full blur-md ${glowClass}`}
                aria-hidden
              />
              {isMissions ? (
                <MissionCompassInCircle className="relative z-[1] ring-2 ring-[hsl(43,50%,35%)]/30" />
              ) : isWorks ? (
                <WorksCoinsInCircle className="relative z-[1] ring-2 ring-[hsl(43,50%,35%)]/30" />
              ) : (
                <TrainingDumbbellInCircle className="relative z-[1] ring-2 ring-emerald-600/25" />
              )}
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <Loader2 className={`h-7 w-7 shrink-0 animate-spin ${spinnerClass}`} aria-hidden />
              <p className="font-heading text-sm font-medium leading-snug text-white/85">{message}</p>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-black/45 ring-1 ring-inset ring-white/[0.07] sm:max-w-xs sm:flex-1">
            <div
              className={`h-full w-[40%] rounded-full bg-gradient-to-r ${shimmerGradient} available-list-refresh-shimmer`}
              aria-hidden
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {[0, 1].map((i) => (
            <div key={i} className={GHOST_ROW}>
              <div
                className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/[0.06]"
                style={{ animationDelay: `${i * 100}ms` }}
              />
              <div className="min-w-0 flex-1 space-y-2 py-0.5">
                <div
                  className="h-3 max-w-[min(100%,14rem)] animate-pulse rounded bg-white/[0.09]"
                  style={{ animationDelay: `${i * 70}ms` }}
                />
                <div
                  className="h-2.5 max-w-[min(100%,9rem)] animate-pulse rounded bg-white/[0.05]"
                  style={{ animationDelay: `${i * 70 + 50}ms` }}
                />
              </div>
              <div
                className="hidden h-8 w-[4.5rem] shrink-0 animate-pulse rounded-md bg-white/[0.06] sm:block"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes available-list-refresh-shimmer {
          0% {
            transform: translateX(-120%);
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(320%);
            opacity: 0.5;
          }
        }
        .available-list-refresh-shimmer {
          animation: available-list-refresh-shimmer 1.45s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
