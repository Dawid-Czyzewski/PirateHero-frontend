import type { TFunction } from 'react-i18next';
import type { ArenaDungeonVictoryRewards, ArenaOpponent } from './arenaTypes';
import type { UseArenaGameReturn } from './useArenaGame';
import { ArenaBattleField } from './ArenaBattleField';
import { ArenaBattleHeader } from './ArenaBattleHeader';
import { ArenaBattleHpBars } from './ArenaBattleHpBars';
import { ArenaBattleInlineResult } from './ArenaBattleInlineResult';
import { ArenaBattleLogPanel } from './ArenaBattleLogPanel';
import { ArenaBattleReplayEndModal } from '@/features/game/arena/ArenaBattleReplayEndModal';
import { ArenaBattleVictoryModal } from './ArenaBattleVictoryModal';

type BattleSlice = UseArenaGameReturn['battle'];

type Props = {
  t: TFunction;
  playerLevel: number;
  playerAvatarId: string;
  playerUsername?: string;
  battleOpp: ArenaOpponent;
  battle: BattleSlice;
  battleDismissLabel?: string;
  defeatDismissLabel?: string;
  backgroundSrc?: string;
  dungeonVictoryRewards?: ArenaDungeonVictoryRewards;
  hideVictoryRewards?: boolean;
  hideFameOnDefeat?: boolean;
  opponentSubtitle?: string;
  battleHeaderTitle?: string | null;
  onCloseBattle?: () => void;
};

export function ArenaBattleView({
  t,
  playerLevel,
  playerAvatarId,
  playerUsername = '',
  battleOpp,
  battle,
  battleDismissLabel,
  defeatDismissLabel,
  backgroundSrc,
  dungeonVictoryRewards,
  hideVictoryRewards = false,
  hideFameOnDefeat = false,
  opponentSubtitle,
  battleHeaderTitle,
  onCloseBattle,
}: Props) {
  const {
    battleResult,
    battlePhase,
    playerHp,
    oppHp,
    playerAnim,
    oppAnim,
    floatingDmg,
    isReplay,
    currentLogIndex,
    skipBattle,
    closeBattle,
  } = battle;

  const dismissBattle = onCloseBattle ?? closeBattle;

  if (!battleResult) return null;

  const showWinModal = battlePhase === 'result' && battleResult.won && !isReplay;
  const showReplayEndModal = battlePhase === 'result' && isReplay;

  const titleOutsideArena =
    battleHeaderTitle !== undefined
      ? battleHeaderTitle
      : battlePhase === 'fighting'
        ? t('arenaPage.battleOngoing')
        : showWinModal
          ? null
          : battleResult.won
            ? t('arenaPage.victoryTitle')
            : t('arenaPage.defeatTitle');

  return (
    <div className="w-full animate-fade-in">
      <ArenaBattleHeader
        t={t}
        title={titleOutsideArena}
        isReplay={isReplay}
        showSkip={battlePhase === 'fighting'}
        onSkip={skipBattle}
      />

      <ArenaBattleHpBars
        t={t}
        playerLevel={playerLevel}
        playerName={playerUsername}
        playerAvatarId={playerAvatarId}
        playerHp={playerHp}
        playerMaxHp={battleResult.playerMaxHp}
        opponent={battleOpp}
        opponentSubtitle={opponentSubtitle}
        oppHp={oppHp}
        oppMaxHp={battleResult.opponentMaxHp}
      />

      <ArenaBattleField
        t={t}
        battlePhase={battlePhase}
        playerAnim={playerAnim}
        oppAnim={oppAnim}
        playerAvatarId={playerAvatarId}
        playerName={playerUsername}
        opponent={battleOpp}
        floatingDmg={floatingDmg}
        backgroundSrc={backgroundSrc}
      />

      <ArenaBattleLogPanel
        t={t}
        logs={battleResult.logs}
        visibleCount={currentLogIndex}
        opponentName={battleOpp.name}
        playerUsername={playerUsername}
        battlePhase={battlePhase}
      />

      <ArenaBattleVictoryModal
        isOpen={showWinModal}
        onClose={dismissBattle}
        t={t}
        fameEarned={battleResult.fameEarned ?? 0}
        dungeonRewards={dungeonVictoryRewards}
        hideRewards={hideVictoryRewards}
        primaryActionLabel={battleDismissLabel}
      />

      <ArenaBattleReplayEndModal
        isOpen={showReplayEndModal}
        onClose={dismissBattle}
        t={t}
        won={battleResult.won}
        primaryActionLabel={battleDismissLabel}
      />

      {battlePhase === 'result' && !battleResult.won && !isReplay && (
        <ArenaBattleInlineResult
          t={t}
          result={battleResult}
          isReplay={false}
          onClose={dismissBattle}
          primaryActionLabel={defeatDismissLabel ?? battleDismissLabel}
          hideFameDisplay={hideFameOnDefeat}
        />
      )}
    </div>
  );
}
