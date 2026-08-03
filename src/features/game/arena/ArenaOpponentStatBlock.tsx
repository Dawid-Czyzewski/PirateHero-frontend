import type { TFunction } from 'react-i18next';
import { statColors, statIcons } from '@/features/game/character/characterPageConfig';
import { CHARACTER_STAT_KEYS, type CharacterStatKey } from '@/features/game/character/characterSkillPoints';
import type { ArenaOpponent, ArenaPlayerStats } from './arenaTypes';

type Props = {
  t: TFunction;
  opponent: ArenaOpponent;
  playerStats: ArenaPlayerStats;
  compact?: boolean;
};

export function ArenaOpponentStatBlock({ t, opponent: opp, playerStats, compact }: Props) {
  const totalShift = CHARACTER_STAT_KEYS.reduce(
    (acc, key) => acc + (playerStats[key] - opp[key]),
    0
  );
  const totalClass =
    totalShift > 0
      ? 'text-emerald-400'
      : totalShift < 0
        ? 'text-red-400'
        : 'text-muted-foreground';
  const totalStr = totalShift === 0 ? '0' : totalShift > 0 ? `+${totalShift}` : `${totalShift}`;

  const rowText = compact ? 'text-[10px]' : 'text-xs sm:text-sm';
  const iconSz = compact ? 'h-3 w-3' : 'h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]';
  const deltaText = compact ? 'text-[10px]' : 'text-xs sm:text-sm';
  const totalText = compact ? 'text-[10px]' : 'text-xs sm:text-sm';
  const rowGap = compact ? 'gap-1' : 'gap-1.5';

  const headerText = compact ? 'text-[9px]' : 'text-[10px] sm:text-xs';

  return (
    <div className={`flex flex-col ${compact ? 'gap-0.5' : 'gap-1'} ${compact ? '' : 'mt-0.5'}`}>
      <div
        className={`flex min-w-0 items-center ${rowGap} ${headerText} font-heading uppercase tracking-wide text-muted-foreground`}
        aria-hidden
      >
        <span className={`${iconSz} shrink-0`} />
        <span className="min-w-0 flex-1" />
        <span className="shrink-0 tabular-nums">{t('arenaPage.statColOpponent')}</span>
        <span className="shrink-0" />
        <span className="shrink-0 tabular-nums">{t('arenaPage.you')}</span>
        <span className="shrink-0" />
        <span className="shrink-0 min-w-[2rem] text-right tabular-nums">{t('arenaPage.statColDelta')}</span>
      </div>
      {CHARACTER_STAT_KEYS.map((key: CharacterStatKey) => {
        const Icon = statIcons[key];
        const ov = opp[key];
        const pv = playerStats[key];
        const shift = pv - ov;
        const shiftClass =
          shift > 0 ? 'text-emerald-400' : shift < 0 ? 'text-red-400' : 'text-muted-foreground';
        const shiftStr = shift === 0 ? '=' : shift > 0 ? `+${shift}` : `${shift}`;
        return (
          <div key={key} className={`flex min-w-0 items-center ${rowGap} ${rowText}`}>
            <Icon className={`${iconSz} shrink-0 ${statColors[key]}`} aria-hidden />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {t(`characterPage.stats.${key}`)}
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-foreground">{ov}</span>
            <span className="shrink-0 text-muted-foreground" aria-hidden>
              ·
            </span>
            <span className="shrink-0 tabular-nums text-foreground/90">{pv}</span>
            <span className="shrink-0 text-muted-foreground" aria-hidden>
              ·
            </span>
            <span
              className={`shrink-0 min-w-[2rem] text-right font-bold tabular-nums ${deltaText} ${shiftClass}`}
            >
              {shiftStr}
            </span>
          </div>
        );
      })}
      <div
        className={`mt-1.5 flex items-center justify-end gap-2 border-t border-border/50 pt-2 font-bold tabular-nums ${totalText} ${totalClass}`}
      >
        <span className="font-heading uppercase tracking-wide text-muted-foreground">
          {t('arenaPage.statCompareTotalLabel')}
        </span>
        <span>{totalStr}</span>
      </div>
    </div>
  );
}
