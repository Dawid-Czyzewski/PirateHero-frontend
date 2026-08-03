import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ARENA_BATTLE_ATTACK_MS,
  ARENA_BATTLE_HIT_CLEAR_MS,
  ARENA_BATTLE_LOG_TICK_MS,
  ARENA_BATTLE_RESULT_DELAY_MS,
} from '@/features/game/arena/arenaConstants';
import type { FighterAnim, FloatingDamage } from '@/features/game/arena/arenaTypes';

type MovePerson =
  | string
  | {
      id?: string | number;
      username?: string;
    };

type RawMove = {
  moveNumber: number;
  result: string;
  damage?: number;
  player?: MovePerson;
  target?: MovePerson;
  targetHealthAfter?: number;
  playerHealthAfter?: number;
  isAttackerSide?: boolean;
};

type FightResultLike = {
  moves?: unknown[];
  attackerMembers?: { id?: string | number; username?: string; initialHealth?: number }[];
  defenderMembers?: { id?: string | number; username?: string; initialHealth?: number }[];
};

export type ShipFightFighterHud = {
  id: string | number;
  username: string;
};

type PlaybackStep = {
  moveNumber: number;
  result: string;
  damage: number;
  dodge: boolean;
  critical: boolean;
  striker: ShipFightFighterHud;
  target: ShipFightFighterHud;
  strikerHpBefore: number;
  targetHpBefore: number;
  strikerHpAfter: number;
  targetHpAfter: number;
  strikerMaxHp: number;
  targetMaxHp: number;
  strikerIsAttackerSide: boolean;
};

function resolvePerson(who: MovePerson | undefined): ShipFightFighterHud | null {
  if (who == null) return null;
  if (typeof who === 'string') {
    return { id: who, username: who.trim() || 'Unknown' };
  }
  const id = who.id != null ? who.id : (who.username ?? '');
  const username = (who.username ?? '').trim() || String(id ?? 'Unknown');
  return { id, username };
}

function normalizeRawMove(raw: unknown, fallbackMoveNo: number): RawMove | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const player = (o.player ?? o.attacker) as MovePerson | undefined;
  const target = (o.target ?? o.defender) as MovePerson | undefined;
  if (player === undefined || target === undefined) return null;
  const nz = (v: unknown) =>
    v !== undefined && v !== null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined;
  const moveNumber = nz(o.moveNumber ?? o.move_number) ?? fallbackMoveNo;
  const resultStr = String(o.result ?? 'HIT');
  const damage = nz(o.damage);
  const targetHealthAfter = nz(o.targetHealthAfter ?? o.target_health_after);
  const playerHealthAfter = nz(o.playerHealthAfter ?? o.player_health_after);
  const isAttackerSideRaw = o.isAttackerSide ?? o.is_attacker_side;
  const isAttackerSide =
    typeof isAttackerSideRaw === 'boolean'
      ? isAttackerSideRaw
      : isAttackerSideRaw === 1 || isAttackerSideRaw === '1' || isAttackerSideRaw === 'true';
  const out: RawMove = {
    moveNumber,
    result: resultStr,
    player,
    target,
    isAttackerSide,
  };
  if (damage !== undefined) out.damage = damage;
  if (targetHealthAfter !== undefined) out.targetHealthAfter = targetHealthAfter;
  if (playerHealthAfter !== undefined) out.playerHealthAfter = playerHealthAfter;
  return out;
}

function buildPlaybackSteps(fr: FightResultLike | null | undefined): PlaybackStep[] | null {
  const moves = fr?.moves;
  if (!fr || !Array.isArray(moves) || moves.length === 0) {
    return null;
  }

  const playerHealth = new Map<string | number, number>();
  const playerMaxHealth = new Map<string | number, number>();

  const upsertMember = (
    lists: FightResultLike['attackerMembers'] | FightResultLike['defenderMembers']
  ) => {
    if (!lists) return;
    for (const member of lists) {
      const id = member.id;
      if (id === undefined || id === null) continue;
      const h = member.initialHealth ?? 1000;
      if (!playerHealth.has(id)) {
        playerHealth.set(id, h);
        playerMaxHealth.set(id, h);
      }
    }
  };

  upsertMember(fr.attackerMembers);
  upsertMember(fr.defenderMembers);

  const allMembers = [...(fr.attackerMembers ?? []), ...(fr.defenderMembers ?? [])];
  const ensureMember = (id: string | number) => {
    if (playerHealth.has(id)) return;
    const row = allMembers.find((m) => m.id !== undefined && String(m.id) === String(id));
    const h = row?.initialHealth ?? 1000;
    playerHealth.set(id, h);
    playerMaxHealth.set(id, h);
  };

  const steps: PlaybackStep[] = [];

  moves.forEach((raw, idx) => {
    const move = normalizeRawMove(raw, idx + 1);
    if (!move) return;
    const striker = resolvePerson(move.player);
    const target = resolvePerson(move.target);
    if (!striker || !target) return;

    ensureMember(striker.id);
    ensureMember(target.id);

    const strikerHpBefore = playerHealth.get(striker.id) ?? 0;
    const targetHpBefore = playerHealth.get(target.id) ?? 0;
    const strikerMaxHp = (playerMaxHealth.get(striker.id) ?? strikerHpBefore) || 1000;
    const targetMaxHp = (playerMaxHealth.get(target.id) ?? targetHpBefore) || 1000;

    const dodge = move.result === 'DODGE';
    const critical = move.result === 'CRITICAL_HIT';
    const damage = dodge ? 0 : Number(move.damage ?? 0);

    if (move.targetHealthAfter !== undefined) {
      playerHealth.set(target.id, move.targetHealthAfter);
    }
    if (move.playerHealthAfter !== undefined) {
      playerHealth.set(striker.id, move.playerHealthAfter);
    }

    steps.push({
      moveNumber: move.moveNumber ?? steps.length + 1,
      result: move.result ?? 'HIT',
      damage,
      dodge,
      critical,
      striker,
      target,
      strikerHpBefore,
      targetHpBefore,
      strikerHpAfter: playerHealth.get(striker.id) ?? strikerHpBefore,
      targetHpAfter: playerHealth.get(target.id) ?? targetHpBefore,
      strikerMaxHp,
      targetMaxHp,
      strikerIsAttackerSide: move.isAttackerSide === true,
    });
  });

  return steps.length ? steps : null;
}

export const useShipFightAnimation = <T extends FightResultLike>(
  fightResult: T | null | undefined,
  onFightComplete: ((result: T) => void) | null | undefined,
  isOpen: boolean,
  viewerIsAttacker = true
) => {
  const steps = useMemo(() => buildPlaybackSteps(fightResult), [fightResult]);

  const onFightCompleteRef = useRef(onFightComplete);
  onFightCompleteRef.current = onFightComplete;
  const fightResultRef = useRef(fightResult);
  fightResultRef.current = fightResult;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const [battlePhase, setBattlePhase] = useState<'fighting' | 'result' | null>(null);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [fightLog, setFightLog] = useState<
    {
      moveNumber: number;
      result: string;
      damage: number;
      player: string;
      target: string;
      attackerIsPlayer: boolean;
    }[]
  >([]);
  const [fightEnded, setFightEnded] = useState(false);

  const [playerAnim, setPlayerAnim] = useState<FighterAnim>('idle');
  const [oppAnim, setOppAnim] = useState<FighterAnim>('idle');
  const [floatingDmg, setFloatingDmg] = useState<FloatingDamage | null>(null);

  const [currentAttacker, setCurrentAttacker] = useState<ShipFightFighterHud | null>(null);
  const [currentDefender, setCurrentDefender] = useState<ShipFightFighterHud | null>(null);
  const [attackerHealth, setAttackerHealth] = useState(100);
  const [defenderHealth, setDefenderHealth] = useState(100);
  const [maxAttackerHealth, setMaxAttackerHealth] = useState(100);
  const [maxDefenderHealth, setMaxDefenderHealth] = useState(100);

  const battlePhaseRef = useRef(battlePhase);
  battlePhaseRef.current = battlePhase;

  const floatId = useRef(0);

  const applyHud = useCallback(
    (step: PlaybackStep, phase: 'before' | 'after') => {
      const strikerIsPlayer = viewerIsAttacker
        ? step.strikerIsAttackerSide
        : !step.strikerIsAttackerSide;
      const left = strikerIsPlayer ? step.striker : step.target;
      const right = strikerIsPlayer ? step.target : step.striker;

      setCurrentAttacker(left);
      setCurrentDefender(right);
      setMaxAttackerHealth(
        Math.max(1, strikerIsPlayer ? step.strikerMaxHp : step.targetMaxHp)
      );
      setMaxDefenderHealth(
        Math.max(1, strikerIsPlayer ? step.targetMaxHp : step.strikerMaxHp)
      );
      if (phase === 'before') {
        setAttackerHealth(
          Math.max(0, strikerIsPlayer ? step.strikerHpBefore : step.targetHpBefore)
        );
        setDefenderHealth(
          Math.max(0, strikerIsPlayer ? step.targetHpBefore : step.strikerHpBefore)
        );
      } else {
        setAttackerHealth(
          Math.max(0, strikerIsPlayer ? step.strikerHpAfter : step.targetHpAfter)
        );
        setDefenderHealth(
          Math.max(0, strikerIsPlayer ? step.targetHpAfter : step.strikerHpAfter)
        );
      }
    },
    [viewerIsAttacker]
  );

  useLayoutEffect(() => {
    if (!isOpen || !fightResult?.moves?.length || !steps?.length) return;
    const s = steps[0];
    applyHud(s, 'before');
    setCurrentLogIndex(0);
    setFightLog([]);
    setFightEnded(false);
    setBattlePhase('fighting');
    setPlayerAnim('idle');
    setOppAnim('idle');
    setFloatingDmg(null);
  }, [isOpen, fightResult, steps, applyHud]);

  const resetClosed = () => {
    setBattlePhase(null);
    setCurrentLogIndex(0);
    setFightLog([]);
    setFightEnded(false);
    setPlayerAnim('idle');
    setOppAnim('idle');
    setFloatingDmg(null);
    setCurrentAttacker(null);
    setCurrentDefender(null);
    setAttackerHealth(100);
    setDefenderHealth(100);
    setMaxAttackerHealth(100);
    setMaxDefenderHealth(100);
  };

  useEffect(() => {
    if (!isOpen) {
      resetClosed();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !steps?.length || battlePhase !== 'fighting') {
      return;
    }

    if (currentLogIndex >= steps.length) {
      const t = window.setTimeout(() => {
        if (!isOpenRef.current || battlePhaseRef.current !== 'fighting') return;
        setBattlePhase('result');
        setFightEnded(true);
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const tail = isMobile ? 0 : ARENA_BATTLE_RESULT_DELAY_MS;
        window.setTimeout(() => {
          if (!isOpenRef.current) return;
          try {
            const fr = fightResultRef.current;
            if (fr) onFightCompleteRef.current?.(fr);
          } catch {
          }
        }, tail);
      }, ARENA_BATTLE_RESULT_DELAY_MS);
      return () => window.clearTimeout(t);
    }

    const step = steps[currentLogIndex];
    const outer = window.setTimeout(() => {
      if (!isOpenRef.current) return;
      const strikerIsPlayer = viewerIsAttacker
        ? step.strikerIsAttackerSide
        : !step.strikerIsAttackerSide;
      applyHud(step, 'before');
      setPlayerAnim(strikerIsPlayer ? 'attack' : 'idle');
      setOppAnim(strikerIsPlayer ? 'idle' : 'attack');

      window.setTimeout(() => {
        if (!isOpenRef.current) return;
        setPlayerAnim(strikerIsPlayer ? 'idle' : (step.dodge ? 'idle' : 'hit'));
        setOppAnim(strikerIsPlayer ? (step.dodge ? 'idle' : 'hit') : 'idle');
        applyHud(step, 'after');

        floatId.current += 1;
        if (step.dodge) {
          setFloatingDmg({
            id: floatId.current,
            value: 0,
            critical: false,
            side: strikerIsPlayer ? 'right' : 'left',
            dodge: true,
          });
        } else if (step.damage > 0) {
          setFloatingDmg({
            id: floatId.current,
            value: step.damage,
            critical: step.critical,
            side: strikerIsPlayer ? 'right' : 'left',
          });
        }

        setFightLog((prev) => [
          ...prev,
          {
            moveNumber: step.moveNumber,
            result: step.result,
            damage: step.damage,
            player: step.striker.username,
            target: step.target.username,
            attackerIsPlayer: strikerIsPlayer,
          },
        ]);

        window.setTimeout(() => {
          if (!isOpenRef.current) return;
          setPlayerAnim('idle');
          setOppAnim('idle');
          setFloatingDmg(null);
        }, ARENA_BATTLE_HIT_CLEAR_MS);
      }, ARENA_BATTLE_ATTACK_MS);

      setCurrentLogIndex((i) => i + 1);
    }, ARENA_BATTLE_LOG_TICK_MS);

    return () => window.clearTimeout(outer);
  }, [battlePhase, currentLogIndex, steps, isOpen, applyHud, viewerIsAttacker]);

  const isAnimating = battlePhase === 'fighting';
  const showResult = battlePhase === 'result';

  const skipBattle = useCallback(() => {
    if (!steps?.length || battlePhase !== 'fighting') return;
    const lastStep = steps[steps.length - 1];
    applyHud(lastStep, 'after');
    setPlayerAnim('idle');
    setOppAnim('idle');
    setFloatingDmg(null);

    const fullLog = steps.map((step) => {
      const strikerIsPlayer = viewerIsAttacker
        ? step.strikerIsAttackerSide
        : !step.strikerIsAttackerSide;
      return {
        moveNumber: step.moveNumber,
        result: step.result,
        damage: step.damage,
        player: step.striker.username,
        target: step.target.username,
        attackerIsPlayer: strikerIsPlayer,
      };
    });
    setFightLog(fullLog);
    setCurrentLogIndex(steps.length);
    setFightEnded(true);
    setBattlePhase('result');

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const tail = isMobile ? 0 : ARENA_BATTLE_RESULT_DELAY_MS;
    window.setTimeout(() => {
      if (!isOpenRef.current) return;
      try {
        const fr = fightResultRef.current;
        if (fr) onFightCompleteRef.current?.(fr);
      } catch {
      }
    }, tail);
  }, [steps, battlePhase, applyHud, viewerIsAttacker]);

  const getCurrentMove = () => {
    const idx = Math.max(0, currentLogIndex - 1);
    return fightResult?.moves?.[idx] ?? null;
  };

  return {
    currentMove: currentLogIndex,
    isAnimating,
    fightLog,
    showResult,
    fightEnded,
    currentAttacker,
    currentDefender,
    attackerHealth,
    defenderHealth,
    maxAttackerHealth,
    maxDefenderHealth,
    getCurrentMove,
    battlePhase,
    playerAnim,
    oppAnim,
    floatingDmg,
    skipBattle,
  };
};
