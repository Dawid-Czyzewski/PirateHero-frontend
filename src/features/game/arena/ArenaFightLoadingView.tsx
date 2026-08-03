import { Loader2, Swords } from 'lucide-react';
import type { TFunction } from 'react-i18next';
import type { ArenaOpponent } from './arenaTypes';
import { ARENA_BATTLE_BACKGROUND_SRC } from './arenaConstants';
import { ArenaBattleAvatarChip } from './ArenaBattleAvatarChip';
import { ArenaBattleFighterAvatar } from './ArenaBattleFighterAvatar';
import { ArenaBattleHeader } from './ArenaBattleHeader';

type Props = {
  t: TFunction;
  opponent: ArenaOpponent;
  playerLevel: number;
  playerAvatarId: string;
  playerName?: string;
  loadingKind?: 'fight' | 'replay';
};

export function ArenaFightLoadingView({
  t,
  opponent,
  playerLevel,
  playerAvatarId,
  playerName = '',
  loadingKind = 'fight',
}: Props) {
  const leftLabel = playerName.trim() || String(t('arenaPage.you'));
  const isReplayPrepare = loadingKind === 'replay';
  const headerTitle = isReplayPrepare
    ? String(t('arenaPage.replayPreparingTitle'))
    : String(t('arenaPage.fightLoadingTitle'));
  return (
    <div className="w-full animate-fade-in" role="status" aria-busy="true" aria-live="polite">
      <ArenaBattleHeader
        t={t}
        title={headerTitle}
        isReplay={isReplayPrepare}
        showSkip={false}
        onSkip={() => {}}
      />

      <div className="mx-auto mb-3 w-full max-w-6xl rounded-xl border border-white/10 bg-black/80 px-4 py-3 shadow-lg sm:px-6 sm:py-4">
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {[
            { side: 'you' as const, name: leftLabel, level: playerLevel },
            { side: 'opp' as const, name: opponent.name, level: opponent.level },
          ].map((row) => (
            <div key={row.side} className="animate-pulse">
              <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  {row.side === 'you' ? (
                    <ArenaBattleAvatarChip avatarId={playerAvatarId} borderClass="border-emerald-500/40" />
                  ) : (
                    <ArenaBattleAvatarChip avatarId={opponent.avatarId} borderClass="border-red-500/35" />
                  )}
                  <span className="truncate font-display font-semibold text-white/70">
                    {row.name} ({t('arenaPage.levelShort', { level: row.level })})
                  </span>
                </div>
                <span className="shrink-0 tabular-nums text-white/40">···</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full border border-white/10 bg-zinc-900/80">
                <div className="h-full w-full rounded-full bg-white/15 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex h-[max(11rem,calc((100svh-14rem)/2))] w-full flex-col overflow-hidden rounded-lg border border-border/50">
        <div
          className={
            ARENA_BATTLE_BACKGROUND_SRC
              ? 'absolute inset-0 z-0 bg-cover bg-bottom bg-no-repeat'
              : 'absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black'
          }
          style={
            ARENA_BATTLE_BACKGROUND_SRC
              ? { backgroundImage: `url(${ARENA_BATTLE_BACKGROUND_SRC})` }
              : undefined
          }
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background/90 via-background/20 to-black/25"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-3xl flex-1 items-end justify-between px-4 pb-3 sm:px-8 sm:pb-4">
          <ArenaBattleFighterAvatar
            side="left"
            anim="idle"
            avatarId={playerAvatarId}
            label={leftLabel}
            showAttackFx={false}
          />
          <div className="absolute bottom-1/2 left-1/2 z-20 flex -translate-x-1/2 translate-y-1/2 flex-col items-center gap-3 px-4 text-center">
            <Swords className="h-8 w-8 animate-pulse text-primary drop-shadow-md" aria-hidden />
            <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
          </div>
          <ArenaBattleFighterAvatar
            side="right"
            anim="idle"
            avatarId={opponent.avatarId}
            label={opponent.name}
            showAttackFx={false}
          />
        </div>
      </div>
    </div>
  );
}
