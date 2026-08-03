import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import fightService from '@/services/fightService';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import type { FightStartSuccessData } from '@/types/fight';
import type {
  ArenaBattleHistoryEntry,
  ArenaBattleResult,
  ArenaOpponent,
  FighterAnim,
  FloatingDamage,
} from './arenaTypes';
import type { ArenaPlayerStats } from './arenaTypes';
import {
  mapFightHistoryRowToArenaEntry,
  mapFightOpponentToArena,
  mapFightReplayToArenaResult,
  mapFightStartToArenaResult,
} from './arenaFightApiMap';
import {
  ARENA_BATTLE_ATTACK_MS,
  ARENA_BATTLE_HIT_CLEAR_MS,
  ARENA_BATTLE_LOG_TICK_MS,
  ARENA_BATTLE_RESULT_DELAY_MS,
} from './arenaConstants';

const REFRESH_MS = 450;
const HISTORY_CAP = 20;

type UseArenaGameOptions = {
  playerStats: ArenaPlayerStats;
  playerUsername?: string;
  onFightApiError?: (message: string) => void;
};

export function useArenaGame({
  playerStats: _playerStats,
  playerUsername = '',
  onFightApiError,
}: UseArenaGameOptions) {
  const onFightApiErrorRef = useRef(onFightApiError);
  onFightApiErrorRef.current = onFightApiError;

  const [opponents, setOpponents] = useState<ArenaOpponent[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<ArenaBattleHistoryEntry[]>([]);
  const [startingFightOpponentId, setStartingFightOpponentId] = useState<string | number | null>(null);
  const [replayPrepareOpponent, setReplayPrepareOpponent] = useState<ArenaOpponent | null>(null);
  const [battleActive, setBattleActive] = useState(false);
  const [battleOpp, setBattleOpp] = useState<ArenaOpponent | null>(null);
  const [battleResult, setBattleResult] = useState<ArenaBattleResult | null>(null);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [playerHp, setPlayerHp] = useState(0);
  const [oppHp, setOppHp] = useState(0);
  const [playerAnim, setPlayerAnim] = useState<FighterAnim>('idle');
  const [oppAnim, setOppAnim] = useState<FighterAnim>('idle');
  const [floatingDmg, setFloatingDmg] = useState<FloatingDamage | null>(null);
  const [battlePhase, setBattlePhase] = useState<'fighting' | 'result' | null>(null);
  const [isReplay, setIsReplay] = useState(false);
  const floatId = useRef(0);
  const historyIdRef = useRef(0);
  const opponentsRef = useRef<ArenaOpponent[]>([]);
  const opponentsAfterFightRef = useRef<ArenaOpponent[] | null>(null);
  const battlePhaseRef = useRef(battlePhase);
  const isReplayRef = useRef(isReplay);
  battlePhaseRef.current = battlePhase;
  isReplayRef.current = isReplay;

  const loadOpponents = useCallback(async () => {
    try {
      const data = await fightService.getOpponents();
      setOpponents(Array.isArray(data) ? data.map(mapFightOpponentToArena) : []);
    } catch (e) {
      const msg = e instanceof ApiHttpError ? e.message : 'Failed to load opponents';
      setOpponents([]);
      onFightApiErrorRef.current?.(msg);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOpponents();
  }, [loadOpponents]);

  opponentsRef.current = opponents;

  useEffect(() => {
    if (!showHistory) {
      setHistoryLoading(false);
      return;
    }
    let cancelled = false;
    setHistoryLoading(true);
    void (async () => {
      try {
        const rows = await fightService.getFightHistory();
        if (cancelled) return;
        setHistory(
          Array.isArray(rows)
            ? rows.map((h) => mapFightHistoryRowToArenaEntry(h, opponentsRef.current))
            : []
        );
      } catch (e) {
        const msg = e instanceof ApiHttpError ? e.message : 'Failed to load fight history';
        onFightApiErrorRef.current?.(msg);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showHistory]);

  useEffect(() => {
    if (battlePhase !== 'result' || isReplay) return;
    const next = opponentsAfterFightRef.current;
    if (next == null) return;
    setOpponents(next);
    opponentsAfterFightRef.current = null;
  }, [battlePhase, isReplay]);

  const isLoading = refreshing || initialLoading;

  const refresh = useCallback(() => {
    setRefreshing(true);
    setBattleActive(false);
    setBattlePhase(null);
    setReplayPrepareOpponent(null);
    window.setTimeout(() => {
      void loadOpponents().finally(() => setRefreshing(false));
    }, REFRESH_MS);
  }, [loadOpponents]);

  const playBattle = useCallback((opp: ArenaOpponent, result: ArenaBattleResult, replay: boolean) => {
    setBattleOpp(opp);
    setBattleResult(result);
    setPlayerHp(result.playerMaxHp);
    setOppHp(result.opponentMaxHp);
    setCurrentLogIndex(0);
    setBattleActive(true);
    setBattlePhase('fighting');
    setPlayerAnim('idle');
    setOppAnim('idle');
    setFloatingDmg(null);
    setIsReplay(replay);
    setShowHistory(false);
  }, []);

  const startFight = useCallback(
    async (opp: ArenaOpponent): Promise<FightStartSuccessData | null> => {
      setStartingFightOpponentId(opp.id);
      try {
        const data = await fightService.startFight(opp.id);
        const result = mapFightStartToArenaResult(data, playerUsername);
        historyIdRef.current += 1;
        const rowId =
          data.fightId != null ? String(data.fightId) : String(historyIdRef.current);
        const oppAvatar =
          data.opponent?.avatarName != null && String(data.opponent.avatarName).trim() !== ''
            ? String(data.opponent.avatarName).trim()
            : opp.avatarId;
        const entry: ArenaBattleHistoryEntry = {
          id: rowId,
          fightId: data.fightId != null ? String(data.fightId) : undefined,
          opponent: {
            ...opp,
            avatarId: oppAvatar,
            famePoints: Number(data.opponent?.famePoints ?? opp.famePoints),
          },
          date: new Date(),
          won: result.won,
          fameChange: data.famePointsChange,
          battleResult: result,
        };
        setHistory((prev) => [entry, ...prev].slice(0, HISTORY_CAP));
        if (Array.isArray(data.opponents)) {
          opponentsAfterFightRef.current = data.opponents.map(mapFightOpponentToArena);
        } else {
          opponentsAfterFightRef.current = null;
        }
        playBattle(entry.opponent, result, false);
        return data;
      } catch (e) {
        const msg = e instanceof ApiHttpError ? e.message : 'Fight failed';
        onFightApiErrorRef.current?.(msg);
        return null;
      } finally {
        setStartingFightOpponentId(null);
      }
    },
    [playBattle, playerUsername]
  );

  const replayBattle = useCallback(
    async (entry: ArenaBattleHistoryEntry) => {
      if (entry.fightId) {
        setShowHistory(false);
        setReplayPrepareOpponent(entry.opponent);
        try {
          const replay = await fightService.getFightReplay(entry.fightId);
          const result = mapFightReplayToArenaResult(replay);
          setReplayPrepareOpponent(null);
          playBattle(entry.opponent, result, true);
          return;
        } catch (e) {
          const msg = e instanceof ApiHttpError ? e.message : 'Replay failed';
          onFightApiErrorRef.current?.(msg);
          setReplayPrepareOpponent(null);
          if (!entry.battleResult) return;
        }
      }
      if (entry.battleResult) {
        playBattle(entry.opponent, entry.battleResult, true);
      }
    },
    [playBattle]
  );

  const skipBattle = useCallback(() => {
    if (!battleResult) return;
    setCurrentLogIndex(battleResult.logs.length);
    const last = battleResult.logs[battleResult.logs.length - 1];
    if (
      last?.attackerHpAfter != null &&
      last?.defenderHpAfter != null &&
      battleResult.logs.every(
        (l) => l.attackerHpAfter != null && l.defenderHpAfter != null
      )
    ) {
      setPlayerHp(Math.max(0, last.attackerHpAfter));
      setOppHp(Math.max(0, last.defenderHpAfter));
    } else {
      let pHp = battleResult.playerMaxHp;
      let oHp = battleResult.opponentMaxHp;
      for (const log of battleResult.logs) {
        if (log.attackerIsPlayer) oHp -= log.damage;
        else pHp -= log.damage;
      }
      setPlayerHp(Math.max(0, pHp));
      setOppHp(Math.max(0, oHp));
    }
    setPlayerAnim('idle');
    setOppAnim('idle');
    setFloatingDmg(null);
    setBattlePhase('result');
  }, [battleResult]);

  const closeBattle = useCallback(() => {
    setBattleActive(false);
    setBattlePhase(null);
    const nextList = opponentsAfterFightRef.current;
    if (nextList != null) {
      setOpponents(nextList);
      opponentsAfterFightRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (battlePhase !== 'fighting' || !battleResult) return;

    if (currentLogIndex >= battleResult.logs.length) {
      const timeout = window.setTimeout(() => {
        if (battlePhaseRef.current !== 'fighting') return;
        setBattlePhase('result');
      }, ARENA_BATTLE_RESULT_DELAY_MS);
      return () => window.clearTimeout(timeout);
    }

    const log = battleResult.logs[currentLogIndex];
    const timer = window.setTimeout(() => {
      const applyHpFromSnapshots = () => {
        if (log.attackerHpAfter != null && log.defenderHpAfter != null) {
          setPlayerHp(Math.max(0, log.attackerHpAfter));
          setOppHp(Math.max(0, log.defenderHpAfter));
        }
      };

      if (log.attackerIsPlayer) {
        setPlayerAnim('attack');
        window.setTimeout(() => {
          setPlayerAnim('idle');
          setOppAnim('hit');
          if (log.attackerHpAfter != null && log.defenderHpAfter != null) {
            applyHpFromSnapshots();
          } else {
            setOppHp((prev) => Math.max(0, prev - log.damage));
          }
          floatId.current += 1;
          if (!log.dodge) {
            setFloatingDmg({
              id: floatId.current,
              value: log.damage,
              critical: log.critical,
              side: 'right',
            });
          } else {
            setFloatingDmg({
              id: floatId.current,
              value: 0,
              critical: false,
              side: 'right',
              dodge: true,
            });
          }
          window.setTimeout(() => {
            setOppAnim('idle');
            setFloatingDmg(null);
          }, ARENA_BATTLE_HIT_CLEAR_MS);
        }, ARENA_BATTLE_ATTACK_MS);
      } else {
        setOppAnim('attack');
        window.setTimeout(() => {
          setOppAnim('idle');
          setPlayerAnim('hit');
          if (log.attackerHpAfter != null && log.defenderHpAfter != null) {
            applyHpFromSnapshots();
          } else {
            setPlayerHp((prev) => Math.max(0, prev - log.damage));
          }
          floatId.current += 1;
          if (!log.dodge) {
            setFloatingDmg({
              id: floatId.current,
              value: log.damage,
              critical: log.critical,
              side: 'left',
            });
          } else {
            setFloatingDmg({
              id: floatId.current,
              value: 0,
              critical: false,
              side: 'left',
              dodge: true,
            });
          }
          window.setTimeout(() => {
            setPlayerAnim('idle');
            setFloatingDmg(null);
          }, ARENA_BATTLE_HIT_CLEAR_MS);
        }, ARENA_BATTLE_ATTACK_MS);
      }
      setCurrentLogIndex((i) => i + 1);
    }, ARENA_BATTLE_LOG_TICK_MS);

    return () => window.clearTimeout(timer);
  }, [battlePhase, currentLogIndex, battleResult]);

  const listState = useMemo(
    () => ({
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
    }),
    [
      opponents,
      isLoading,
      refreshing,
      showHistory,
      historyLoading,
      history,
      refresh,
      startFight,
      replayBattle,
      startingFightOpponentId,
    ]
  );

  const battleState = useMemo(
    () => ({
      battleOpp,
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
    }),
    [
      battleOpp,
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
    ]
  );

  return {
    battleActive,
    replayPrepareOpponent,
    list: listState,
    battle: battleState,
    playerStats: _playerStats,
  };
}

export type UseArenaGameReturn = ReturnType<typeof useArenaGame>;
