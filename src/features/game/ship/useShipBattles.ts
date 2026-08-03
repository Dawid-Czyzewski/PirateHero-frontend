import { useCallback, useEffect, useState } from 'react';
import shipsFightService from '@/services/shipsFightService';
import type { ShipBattleHistoryEntry } from '@/features/game/ship/shipTypes';
import type { ShipFightStartData } from '@/types/shipFight';

export type ShipFightOpponentRow = {
  id: number | string;
  title: string;
  totalFamePoints?: number;
  memberCount?: number;
};

type FightHistoryRow = {
  id: number | string;
  opponentShip?: { id?: number | string; title?: string };
  result?: string;
  famePointsChange?: number;
  date?: string;
};

function mapHistoryRow(row: FightHistoryRow): ShipBattleHistoryEntry {
  const win = row.result === 'victory';
  return {
    id: String(row.id),
    at: row.date ? new Date(row.date.replace(' ', 'T')).toISOString() : new Date().toISOString(),
    enemyName: row.opponentShip?.title ?? '-',
    result: win ? 'win' : 'loss',
    fameDelta: Number(row.famePointsChange ?? 0),
  };
}

export function useShipBattles(isCaptain: boolean, membershipActive = true) {
  const [opponents, setOpponents] = useState<ShipFightOpponentRow[]>([]);
  const [fightHistory, setFightHistory] = useState<ShipBattleHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canStartFight, setCanStartFight] = useState(false);
  const [checkingCanStart, setCheckingCanStart] = useState(false);
  const [attackingOpponentId, setAttackingOpponentId] = useState<string | null>(null);
  const [fightFeedback, setFightFeedback] = useState<
    { kind: 'result'; won: boolean } | { kind: 'error'; message: string } | null
  >(null);
  const [arenaReplay, setArenaReplay] = useState<ShipFightStartData | null>(null);
  const [arenaReplayIsHistory, setArenaReplayIsHistory] = useState(false);

  const fetchFightHistory = useCallback(async () => {
    setHistoryLoading(true);
    setError(null);
    try {
      const raw = (await shipsFightService.getFightHistory()) as unknown;
      const list = Array.isArray(raw) ? raw : [];
      setFightHistory(list.map((r) => mapHistoryRow(r as FightHistoryRow)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load fight history';
      setError(msg);
      setFightHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const fetchOpponents = useCallback(async () => {
    if (!isCaptain) {
      setOpponents([]);
      return;
    }
    setLoading(true);
    try {
      const raw = (await shipsFightService.getOpponents()) as unknown;
      const list = Array.isArray(raw) ? raw : [];
      setOpponents(
        list.map((o) => {
          const r = o as Record<string, unknown>;
          return {
            id: r.id as number | string,
            title: String(r.title ?? ''),
            totalFamePoints: Number(r.totalFamePoints ?? 0),
            memberCount: Number(r.memberCount ?? 0),
          };
        })
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load opponents';
      setError(msg);
      setOpponents([]);
    } finally {
      setLoading(false);
    }
  }, [isCaptain]);

  const checkCanStart = useCallback(async () => {
    if (!isCaptain) {
      setCanStartFight(false);
      return;
    }
    try {
      const r = (await shipsFightService.canStartFight()) as { canStart?: boolean };
      setCanStartFight(r.canStart === true);
    } catch {
      setCanStartFight(false);
    }
  }, [isCaptain]);

  const refreshBattles = useCallback(async () => {
    if (!membershipActive) return;
    if (isCaptain) {
      setCheckingCanStart(true);
    }
    try {
      await Promise.all([fetchFightHistory(), fetchOpponents(), checkCanStart()]);
    } finally {
      if (isCaptain) {
        setCheckingCanStart(false);
      }
    }
  }, [membershipActive, isCaptain, fetchFightHistory, fetchOpponents, checkCanStart]);

  useEffect(() => {
    if (!membershipActive) {
      setFightHistory([]);
      setOpponents([]);
      setCanStartFight(false);
      setCheckingCanStart(false);
      setArenaReplay(null);
      setError(null);
      setHistoryLoading(false);
      setLoading(false);
      return;
    }
    void fetchFightHistory();
  }, [membershipActive, fetchFightHistory]);

  useEffect(() => {
    if (!membershipActive) {
      setOpponents([]);
      setCanStartFight(false);
      setCheckingCanStart(false);
      return;
    }
    if (!isCaptain) {
      setOpponents([]);
      setCanStartFight(false);
      setCheckingCanStart(false);
      setArenaReplay(null);
      return;
    }
    setCheckingCanStart(true);
    let cancelled = false;
    void (async () => {
      try {
        await Promise.all([fetchOpponents(), checkCanStart()]);
      } finally {
        if (!cancelled) {
          setCheckingCanStart(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [membershipActive, isCaptain, fetchOpponents, checkCanStart]);

  const startFight = useCallback(
    async (opponentShipId: string | number) => {
      setFightFeedback(null);
      setAttackingOpponentId(String(opponentShipId));
      try {
        const result = (await shipsFightService.startFight(opponentShipId)) as ShipFightStartData;
        setArenaReplay(result);
        setArenaReplayIsHistory(false);
        await refreshBattles();
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Fight failed';
        setFightFeedback({ kind: 'error', message: msg });
      } finally {
        setAttackingOpponentId(null);
      }
    },
    [refreshBattles]
  );

  const clearFightFeedback = useCallback(() => setFightFeedback(null), []);
  const viewFight = useCallback(async (fightId: string | number) => {
    setFightFeedback(null);
    try {
      const result = (await shipsFightService.getFightDetails(fightId)) as ShipFightStartData;
      setArenaReplay(result);
      setArenaReplayIsHistory(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load fight replay';
      setFightFeedback({ kind: 'error', message: msg });
    }
  }, []);
  const clearArenaReplay = useCallback(() => {
    setArenaReplay(null);
    setArenaReplayIsHistory(false);
  }, []);

  return {
    opponents,
    fightHistory,
    loading,
    historyLoading,
    error,
    canStartFight,
    checkingCanStart,
    attackingOpponentId,
    fightFeedback,
    arenaReplay,
    arenaReplayIsHistory,
    clearArenaReplay,
    clearFightFeedback,
    refreshBattles,
    startFight,
    viewFight,
  };
}
