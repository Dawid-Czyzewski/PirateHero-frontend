import type { TFunction } from 'react-i18next';
import { MissionErrorAlert } from '@/features/game/missions/MissionErrorAlert';
import type { UseArenaGameReturn } from './useArenaGame';
import { ArenaHistoryPanel } from './ArenaHistoryPanel';
import { ArenaListHeaderActions } from './ArenaListHeaderActions';
import { ArenaOpponentCard } from './ArenaOpponentCard';
import { ArenaOpponentSkeleton } from './ArenaOpponentSkeleton';
import { ArenaPageHeader, type ArenaFightPointsStrip } from './ArenaPageHeader';

type ListSlice = UseArenaGameReturn['list'];
type PlayerStats = UseArenaGameReturn['playerStats'];

type Props = {
  t: TFunction;
  list: ListSlice;
  playerStats: PlayerStats;
  playerFamePoints: number;
  fightPointsStrip: ArenaFightPointsStrip;
  arenaError: string | null;
  onDismissArenaError: () => void;
  fightDuelCost: number;
  currentDuelPoints: number;
};

export function ArenaListView({
  t,
  list,
  playerStats,
  playerFamePoints,
  fightPointsStrip,
  arenaError,
  onDismissArenaError,
  fightDuelCost,
  currentDuelPoints,
}: Props) {
  const {
    opponents,
    isLoading,
    refreshing,
    showHistory,
    setShowHistory,
    historyLoading,
    history,
    refresh,
    startFight,
    replayBattle,
    startingFightOpponentId,
  } = list;

  const canAffordFight = currentDuelPoints >= fightDuelCost;

  return (
    <div className="w-full space-y-4 px-2 sm:px-4">
      <ArenaPageHeader
        t={t}
        playerFamePoints={playerFamePoints}
        fightPoints={fightPointsStrip}
        actions={
          <ArenaListHeaderActions
            t={t}
            showHistory={showHistory}
            onToggleHistory={() => setShowHistory((s) => !s)}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
      />

      <MissionErrorAlert
        message={arenaError}
        onDismiss={onDismissArenaError}
        closeLabel={String(t('close'))}
      />

      {showHistory && (
        <ArenaHistoryPanel
          history={history}
          onReplay={replayBattle}
          loading={historyLoading}
        />
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }, (_, i) => <ArenaOpponentSkeleton key={i} delayMs={i * 80} />)
          : opponents.map((opp, i) => (
              <ArenaOpponentCard
                key={String(opp.id)}
                t={t}
                opponent={opp}
                playerStats={playerStats}
                index={i}
                fightDuelCost={fightDuelCost}
                canAffordFight={canAffordFight}
                fightBusy={startingFightOpponentId != null}
                onFight={startFight}
              />
            ))}
      </div>

      {!isLoading && opponents.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">{t('arenaPage.noOpponents')}</p>
      )}
    </div>
  );
}
