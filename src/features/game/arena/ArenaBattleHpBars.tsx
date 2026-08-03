import type { TFunction } from 'react-i18next';
import type { ArenaOpponent } from './arenaTypes';
import { ArenaBattleAvatarChip } from './ArenaBattleAvatarChip';

type Props = {
  t: TFunction;
  playerLevel: number;
  playerName?: string;
  playerSubtitle?: string;
  playerAvatarId: string;
  playerHp: number;
  playerMaxHp: number;
  opponent: ArenaOpponent;
  opponentSubtitle?: string;
  oppHp: number;
  oppMaxHp: number;
  uppercaseCombatantNames?: boolean;
};

export function ArenaBattleHpBars({
  t,
  playerLevel,
  playerName = '',
  playerSubtitle,
  playerAvatarId,
  playerHp,
  playerMaxHp,
  opponent,
  opponentSubtitle,
  oppHp,
  oppMaxHp,
  uppercaseCombatantNames,
}: Props) {
  const leftLabel = playerName.trim() || String(t('arenaPage.you'));
  const nameClass = uppercaseCombatantNames ? 'uppercase tracking-wide' : '';
  return (
    <div className="mx-auto mb-3 w-full max-w-6xl rounded-xl border border-white/10 bg-black px-4 py-3 shadow-lg sm:px-6 sm:py-4">
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div>
          <div className="mb-1.5 flex items-start justify-between gap-2 text-xs">
            <div className="flex min-w-0 items-start gap-2">
              <ArenaBattleAvatarChip avatarId={playerAvatarId} borderClass="border-emerald-500/50" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span
                  className={`truncate font-display font-semibold text-white drop-shadow-sm ${nameClass}`}
                >
                  {leftLabel} ({t('arenaPage.levelShort', { level: playerLevel })})
                </span>
                {playerSubtitle ? (
                  <span className="mt-0.5 block truncate text-[10px] font-medium leading-tight text-white/45">
                    {playerSubtitle}
                  </span>
                ) : null}
              </span>
            </div>
            <span className="shrink-0 font-semibold tabular-nums text-white/90">
              {playerHp}/{playerMaxHp}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full border border-white/15 bg-zinc-950 shadow-inner">
            <div
              className="h-full rounded-full shadow-md transition-all duration-500"
              style={{
                width: `${(playerHp / playerMaxHp) * 100}%`,
                background: 'linear-gradient(180deg, hsl(120 60% 50%), hsl(120 60% 35%))',
              }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-start justify-between gap-2 text-xs">
            <div className="flex min-w-0 items-start gap-2">
              <ArenaBattleAvatarChip
                avatarId={opponent.avatarId}
                portraitSrc={opponent.portraitSrc}
                borderClass="border-red-500/45"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span
                  className={`truncate font-display font-semibold text-white drop-shadow-sm ${nameClass}`}
                >
                  {opponent.name} ({t('arenaPage.levelShort', { level: opponent.level })})
                </span>
                {opponentSubtitle ? (
                  <span className="mt-0.5 block truncate text-[10px] font-medium leading-tight text-white/45">
                    {opponentSubtitle}
                  </span>
                ) : null}
              </span>
            </div>
            <span className="shrink-0 font-semibold tabular-nums text-white/90">
              {oppHp}/{oppMaxHp}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full border border-white/15 bg-zinc-950 shadow-inner">
            <div
              className="h-full rounded-full shadow-md transition-all duration-500"
              style={{
                width: `${(oppHp / oppMaxHp) * 100}%`,
                background: 'linear-gradient(180deg, hsl(0 65% 50%), hsl(0 65% 35%))',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
