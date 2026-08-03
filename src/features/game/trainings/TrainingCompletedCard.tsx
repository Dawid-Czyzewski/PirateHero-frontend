import { Loader2, Sparkles } from 'lucide-react';
import { ActiveTrainingIconBadge } from '@/features/game/trainings/ActiveTrainingIconBadge';

const CARD =
  'w-full overflow-hidden rounded-xl border border-[hsl(43,40%,26%)]/55 bg-[#0a0b0e] shadow-[0_12px_40px_rgba(0,0,0,0.45)]';

const BTN_CLAIM =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[hsl(45,88%,48%)] px-5 py-2.5 font-serif text-xs font-black uppercase tracking-[0.12em] text-black shadow-sm transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55';

type Props = {
  title: string;
  skillPointsReward: number;
  statName: string;
  onClaim: () => void;
  t: (key: string) => string;
  isClaimInProgress?: boolean;
};

export function TrainingCompletedCard({
  title,
  skillPointsReward,
  statName,
  onClaim,
  t,
  isClaimInProgress = false,
}: Props) {
  return (
    <div className={CARD}>
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex gap-4">
            <ActiveTrainingIconBadge />
            <div className="min-w-0 pt-0.5">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                {t('trainingsPage.trainingCompleted')}
              </p>
              <h3 className="mt-1 font-serif text-lg font-bold uppercase leading-tight tracking-tight text-white sm:text-xl">
                {title}
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.07] pt-4">
          {skillPointsReward > 0 && statName ? (
            <span className="inline-flex items-center gap-1.5">
              <Sparkles
                className="h-4 w-4 shrink-0 text-[hsl(142,72%,50%)]"
                strokeWidth={2}
                aria-hidden
              />
              <span className="font-heading text-sm font-bold tabular-nums text-[hsl(142,71%,52%)]">
                +{skillPointsReward} {statName}
              </span>
            </span>
          ) : null}
          <button type="button" onClick={onClaim} disabled={isClaimInProgress} className={BTN_CLAIM}>
            {isClaimInProgress ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
            ) : null}
            {t('missionsPage.claimReward')}
          </button>
        </div>
      </div>
    </div>
  );
}
