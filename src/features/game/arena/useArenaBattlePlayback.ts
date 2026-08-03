import { useCallback, useEffect, useRef, useState } from 'react';
import type { ArenaBattleResult, ArenaOpponent, FighterAnim, FloatingDamage } from './arenaTypes';
import {
  ARENA_BATTLE_ATTACK_MS,
  ARENA_BATTLE_HIT_CLEAR_MS,
  ARENA_BATTLE_LOG_TICK_MS,
  ARENA_BATTLE_RESULT_DELAY_MS,
} from './arenaConstants';

export function useArenaBattlePlayback() {
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
  const battlePhaseRef = useRef(battlePhase);
  battlePhaseRef.current = battlePhase;

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
  }, []);

  const skipBattle = useCallback(() => {
    if (!battleResult) return;
    setCurrentLogIndex(battleResult.logs.length);
    const last = battleResult.logs[battleResult.logs.length - 1];
    if (
      last?.attackerHpAfter != null &&
      last?.defenderHpAfter != null &&
      battleResult.logs.every((l) => l.attackerHpAfter != null && l.defenderHpAfter != null)
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

  return {
    battleActive,
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
    playBattle,
  };
}
