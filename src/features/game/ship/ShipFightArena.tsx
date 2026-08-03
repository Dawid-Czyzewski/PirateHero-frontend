import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { ArenaBattleField } from '@/features/game/arena/ArenaBattleField';
import { ArenaBattleHeader } from '@/features/game/arena/ArenaBattleHeader';
import { ArenaBattleHpBars } from '@/features/game/arena/ArenaBattleHpBars';
import { ArenaBattleInlineResult } from '@/features/game/arena/ArenaBattleInlineResult';
import { ArenaBattleLogPanel } from '@/features/game/arena/ArenaBattleLogPanel';
import { ArenaBattleReplayEndModal } from '@/features/game/arena/ArenaBattleReplayEndModal';
import { ArenaBattleVictoryModal } from '@/features/game/arena/ArenaBattleVictoryModal';
import { ARENA_BATTLE_BACKGROUND_SRC } from '@/features/game/arena/arenaConstants';
import type { ArenaBattleLog, ArenaBattleResult, ArenaOpponent } from '@/features/game/arena/arenaTypes';
import { BASE_STATS } from '@/features/game/character/characterPageConfig';
import { useShipFightAnimation } from './hooks/useShipFightAnimation';

type ShipFightMemberRow = {
  id: number | string;
  username?: string;
  initialHealth?: number;
  avatarName?: string | null;
};

type ShipFightResultPayload = {
  result?: string;
  message?: string;
  moves?: unknown[];
  attackerScore?: number;
  defenderScore?: number;
  viewerFameChange?: number;
  attackerShip?: { id?: string | number; title?: string };
  defenderShip?: { id?: string | number; title?: string };
  attackerMembers?: ShipFightMemberRow[];
  defenderMembers?: ShipFightMemberRow[];
};

function resolveShipFightFighterAvatarId(
  fightResult: ShipFightResultPayload | null,
  userId: string | number | undefined | null,
  fallbackAvatarId: string
): string {
  if (userId === undefined || userId === null || !fightResult) {
    return fallbackAvatarId;
  }
  const merged = [
    ...(fightResult.attackerMembers ?? []),
    ...(fightResult.defenderMembers ?? []),
  ];
  const member = merged.find((m) => String(m.id) === String(userId));
  const raw = member?.avatarName?.trim();
  return raw || fallbackAvatarId;
}

type ShipFightArenaProps = {
  isOpen: boolean;
  onClose: () => void;
  fightResult: ShipFightResultPayload | null;
  onFightComplete: (result: ShipFightResultPayload) => void;
  onFightStateChange?: (state: { isFightInProgress: boolean; isFightFinished?: boolean }) => void;
  viewerShipId?: string;
  isReplay?: boolean;
};

function makeArenaOpponent(
  side: { id?: string | number; username?: string } | null,
  fallback: string,
  avatarId: string
): ArenaOpponent {
  const name = (side?.username ?? '').trim() || fallback;
  const id = String(side?.id ?? `${fallback}-${name}`);
  return {
    ...BASE_STATS,
    id,
    name,
    avatarId,
    level: 1,
    famePoints: 0,
  };
}

export default function ShipFightArena({
  isOpen,
  onClose,
  fightResult,
  onFightComplete,
  onFightStateChange,
  viewerShipId,
  isReplay = false,
}: ShipFightArenaProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const viewerPlayerLevel = Math.max(1, parseInt(String(user?.level?.name ?? '1'), 10) || 1);
  const viewerIsAttacker = useMemo(() => {
    if (!viewerShipId || !fightResult?.attackerShip?.id) {
      return true;
    }
    return String(fightResult.attackerShip.id) === String(viewerShipId);
  }, [viewerShipId, fightResult?.attackerShip?.id]);

  const {
    fightLog,
    currentAttacker,
    currentDefender,
    attackerHealth,
    defenderHealth,
    maxAttackerHealth,
    maxDefenderHealth,
    battlePhase,
    playerAnim,
    oppAnim,
    floatingDmg,
    skipBattle,
  } = useShipFightAnimation<ShipFightResultPayload>(
    fightResult,
    onFightComplete,
    isOpen,
    viewerIsAttacker
  );

  useEffect(() => {
    if (onFightStateChange) {
      const awaitingPayload = fightResult?.result === 'loading';
      onFightStateChange({
        isFightInProgress: battlePhase === 'fighting' || awaitingPayload,
        isFightFinished: battlePhase === 'result',
      });
    }
  }, [battlePhase, fightResult?.result, onFightStateChange]);

  const viewerWon = fightResult?.result === 'victory';

  const viewerFameDelta = useMemo(() => {
    if (!fightResult) {
      return 0;
    }
    if (fightResult.viewerFameChange !== undefined && fightResult.viewerFameChange !== null) {
      return Number(fightResult.viewerFameChange);
    }
    const a = Number(fightResult.attackerScore ?? 0);
    const d = Number(fightResult.defenderScore ?? 0);
    return viewerIsAttacker ? a : d;
  }, [fightResult, viewerIsAttacker]);

  const leftAvatarId = useMemo(
    () =>
      resolveShipFightFighterAvatarId(fightResult, currentAttacker?.id, 'captain'),
    [fightResult, currentAttacker?.id]
  );

  const rightAvatarId = useMemo(
    () =>
      resolveShipFightFighterAvatarId(fightResult, currentDefender?.id, 'boatswain'),
    [fightResult, currentDefender?.id]
  );

  const leftOpponent = useMemo(
    () =>
      makeArenaOpponent(
        currentAttacker,
        String(t('statekFights.attackerStatek')),
        leftAvatarId
      ),
    [currentAttacker, t, leftAvatarId]
  );

  const rightOpponent = useMemo(
    () =>
      makeArenaOpponent(
        currentDefender,
        String(t('statekFights.defenderStatek')),
        rightAvatarId
      ),
    [currentDefender, t, rightAvatarId]
  );

  const arenaLogs: ArenaBattleLog[] = useMemo(
    () =>
      fightLog.map((log: {
        player: string;
        target: string;
        result: string;
        damage: number;
        attackerIsPlayer: boolean;
      }) => ({
        attackerIsPlayer: log.attackerIsPlayer,
        damage: log.damage ?? 0,
        critical: log.result === 'CRITICAL_HIT',
        dodge: log.result === 'DODGE',
        strikerName: log.player,
        targetName: log.target,
      })),
    [fightLog]
  );

  const showWinModal = battlePhase === 'result' && viewerWon && !isReplay;

  const titleOutsideArena =
    battlePhase === 'fighting'
      ? String(t('arenaPage.battleOngoing'))
      : battlePhase === 'result'
        ? showWinModal
          ? null
          : viewerWon
            ? String(t('arenaPage.victoryTitle'))
            : String(t('arenaPage.defeatTitle'))
        : null;

  const arenaBattleResult: ArenaBattleResult = useMemo(
    () => ({
      won: viewerWon,
      logs: arenaLogs,
      fameEarned: Math.max(0, viewerFameDelta),
      famePointsChange: viewerFameDelta,
      playerMaxHp: Math.max(1, maxAttackerHealth),
      opponentMaxHp: Math.max(1, maxDefenderHealth),
    }),
    [viewerWon, arenaLogs, viewerFameDelta, maxAttackerHealth, maxDefenderHealth]
  );

  const showReplayEndModal = battlePhase === 'result' && isReplay;

  const primaryLabel = String(t('shipPage.battleBackToShip'));

  if (!isOpen || !fightResult) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950">
      <div
        className={
          ARENA_BATTLE_BACKGROUND_SRC
            ? 'pointer-events-none absolute inset-0 z-0 bg-cover bg-bottom bg-no-repeat'
            : 'pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black'
        }
        style={
          ARENA_BATTLE_BACKGROUND_SRC
            ? { backgroundImage: `url(${ARENA_BATTLE_BACKGROUND_SRC})` }
            : undefined
        }
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background/90 via-background/25 to-black/40"
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
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
            playerLevel={viewerPlayerLevel}
            playerName={currentAttacker?.username || String(t('statekFights.attackerStatek'))}
            playerAvatarId={leftOpponent.avatarId}
            playerHp={Math.max(0, attackerHealth)}
            playerMaxHp={Math.max(1, maxAttackerHealth || 1)}
            opponent={rightOpponent}
            oppHp={Math.max(0, defenderHealth)}
            oppMaxHp={Math.max(1, maxDefenderHealth || 1)}
          />

          <ArenaBattleField
            t={t}
            battlePhase={battlePhase}
            playerAnim={playerAnim}
            oppAnim={oppAnim}
            playerAvatarId={leftOpponent.avatarId}
            playerName={currentAttacker?.username || String(t('statekFights.attackerStatek'))}
            opponent={rightOpponent}
            floatingDmg={floatingDmg}
          />

          <ArenaBattleLogPanel
            t={t}
            logs={arenaBattleResult.logs}
            visibleCount={fightLog.length}
            opponentName={currentDefender?.username || String(t('statekFights.defenderStatek'))}
            playerUsername={currentAttacker?.username || ''}
            battlePhase={battlePhase}
          />

          <ArenaBattleVictoryModal
            isOpen={showWinModal}
            onClose={onClose}
            t={t}
            fameEarned={arenaBattleResult.fameEarned}
            primaryActionLabel={primaryLabel}
          />

          <ArenaBattleReplayEndModal
            isOpen={showReplayEndModal}
            onClose={onClose}
            t={t}
            won={viewerWon}
            primaryActionLabel={primaryLabel}
          />

          {battlePhase === 'result' && !viewerWon && !isReplay ? (
            <ArenaBattleInlineResult
              t={t}
              result={arenaBattleResult}
              isReplay={false}
              onClose={onClose}
              primaryActionLabel={primaryLabel}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
