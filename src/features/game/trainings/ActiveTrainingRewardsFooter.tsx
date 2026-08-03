import { Sparkles } from 'lucide-react';
import { REWARD_XP_CLASS } from '@/features/game/missions/missionRewardClasses';

type Props = {
  skillPointsReward: number;
  statName: string;
  rewardCaption: string;
};

export function ActiveTrainingRewardsFooter({ skillPointsReward, statName, rewardCaption }: Props) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-3">
      <span className="text-xs text-white/45">{rewardCaption}</span>
      <span className="inline-flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[hsl(142,65%,48%)]" strokeWidth={2} aria-hidden />
        <span className={REWARD_XP_CLASS}>
          +{skillPointsReward} {statName}
        </span>
      </span>
    </div>
  );
}
