import { Star } from 'lucide-react';
import type { TFunction } from 'react-i18next';
import type { ArenaOpponent, ArenaPlayerStats } from './arenaTypes';
import { ArenaOpponentAvatar } from './ArenaOpponentAvatar';
import { ArenaOpponentStatBlock } from './ArenaOpponentStatBlock';

type Props = {
  t: TFunction;
  opponent: ArenaOpponent;
  playerStats: ArenaPlayerStats;
  index: number;
  fightDuelCost: number;
  canAffordFight: boolean;
  fightBusy?: boolean;
  onFight: (opp: ArenaOpponent) => void | Promise<unknown>;
};

export function ArenaOpponentCard({
  t,
  opponent,
  playerStats,
  index,
  fightDuelCost,
  canAffordFight,
  fightBusy = false,
  onFight,
}: Props) {
  const levelLabel = opponent.level > 99 ? '99+' : String(opponent.level);

  return (
    <div
      className="card-pirate flex min-h-0 flex-col gap-3 p-3 transition-all hover:border-primary/40 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative w-full shrink-0">
        <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-primary/35 bg-muted/30 shadow-[0_0_20px_hsl(42,90%,50%,0.08)]">
          <ArenaOpponentAvatar avatarId={opponent.avatarId} />
        </div>
        <span
          className="absolute -bottom-1 -right-1 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-black leading-none text-primary-foreground shadow-lg"
          title={String(t('arenaPage.levelShort', { level: opponent.level }))}
        >
          {levelLabel}
        </span>
      </div>

      <div className="min-w-0 text-center">
        <h3 className="line-clamp-2 min-h-[2.25rem] font-display text-sm font-semibold leading-tight sm:text-base">
          {opponent.name}
        </h3>
        <div
          className="mt-1.5 flex items-center justify-center gap-1.5 tabular-nums"
          title={`${t('famePoints')} - ${opponent.name}`}
        >
          <Star className="h-5 w-5 shrink-0 text-purple-400" strokeWidth={2} aria-hidden />
          <span className="font-heading text-sm font-bold text-purple-300 sm:text-base">
            {opponent.famePoints.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="min-h-0 max-h-[min(42vh,13rem)] flex-1 overflow-y-auto pr-0.5 sm:max-h-[min(45vh,15rem)]">
        <ArenaOpponentStatBlock t={t} opponent={opponent} playerStats={playerStats} />
      </div>

      <div className="mt-auto flex flex-col gap-1.5 border-t border-border/30 pt-2.5">
        <button
          type="button"
          onClick={() => void onFight(opponent)}
          disabled={!canAffordFight || fightBusy}
          className="min-h-11 w-full cursor-pointer rounded-lg bg-accent px-3 py-2.5 font-display text-sm font-bold text-accent-foreground shadow-md transition hover:bg-accent/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('arenaPage.fight')}
        </button>
        <span className="text-center text-[10px] font-black leading-tight text-red-400 sm:text-xs">
          {fightDuelCost} {t('duelPoints')}
        </span>
      </div>
    </div>
  );
}
