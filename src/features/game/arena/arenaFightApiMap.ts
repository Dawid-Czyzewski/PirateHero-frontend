import type {
  FightHistoryEntry,
  FightOpponentListItem,
  FightReplayData,
  FightStartSuccessData,
} from '@/types/fight';
import { ARENA_DUEL_HP_MULTIPLIER } from './arenaConstants';
import type {
  ArenaBattleHistoryEntry,
  ArenaBattleLog,
  ArenaBattleResult,
  ArenaOpponent,
} from './arenaTypes';

export function duelMaxHpFromHealth(health?: number): number {
  return Math.max(1, health ?? 1) * ARENA_DUEL_HP_MULTIPLIER;
}

export function mapFightOpponentToArena(o: FightOpponentListItem): ArenaOpponent {
  const ts = o.totalStats ?? {};
  const rawLevel = o.level;
  const level =
    typeof rawLevel === 'string' ? parseInt(rawLevel, 10) || 1 : Math.max(1, Number(rawLevel) || 1);
  const luck = ts.luck ?? ts.critical ?? 0;
  const endurance = ts.health ?? 0;
  const rawAvatar = o.avatarName != null ? String(o.avatarName).trim() : '';
  const avatarId = rawAvatar || 'captain';

  return {
    id: o.id,
    name: o.username,
    avatarId,
    level,
    famePoints: Math.max(0, Number(o.famePoints) || 0),
    strength: ts.strength ?? 0,
    agility: ts.agility ?? 0,
    endurance,
    intelligence: ts.intelligence ?? 0,
    luck,
  };
}

export function mapFightStartToArenaResult(
  data: FightStartSuccessData,
  playerUsername?: string
): ArenaBattleResult {
  const playerMaxHp = duelMaxHpFromHealth(data.attackerStats?.health);
  const opponentMaxHp = duelMaxHpFromHealth(data.defenderStats?.health);
  const attackerId = String(data.playerId);

  const atkName = (data.attackerUsername ?? playerUsername ?? '').trim() || playerUsername || '';
  const defName = (data.opponent?.username ?? '').trim();

  const logs: ArenaBattleLog[] = (data.moves ?? []).map((m) => {
    const strikerId = m.player?.id != null ? String(m.player.id) : '';
    const su = m.player?.username ?? '';
    const attackerIsPlayer =
      (strikerId !== '' && strikerId === attackerId) ||
      (playerUsername != null &&
        playerUsername.length > 0 &&
        su.length > 0 &&
        su === playerUsername);
    const resultType = m.result ?? 'HIT';
    const dodge = resultType === 'DODGE';
    const critical = resultType === 'CRITICAL_HIT';
    const damage = m.damage ?? 0;

    const strikerName = attackerIsPlayer ? atkName : defName;
    const targetName = attackerIsPlayer ? defName : atkName;

    return {
      attackerIsPlayer,
      damage,
      critical,
      dodge,
      attackerHpAfter: m.attackerHealthAfter,
      defenderHpAfter: m.defenderHealthAfter,
      strikerName: strikerName || undefined,
      targetName: targetName || undefined,
    };
  });

  const won = data.result === 'victory';
  const delta = data.famePointsChange;

  return {
    won,
    logs,
    fameEarned: Math.max(0, delta),
    famePointsChange: delta,
    playerMaxHp,
    opponentMaxHp,
  };
}

export function mapFightReplayToArenaResult(data: FightReplayData): ArenaBattleResult {
  const viewerWasAttacker = data.viewerWasAttacker;
  const atkId = String(data.attacker.id);
  const atkName = (data.attacker.username ?? '').trim();
  const defName = (data.defender.username ?? '').trim();

  const logs: ArenaBattleLog[] = (data.moves ?? []).map((m) => {
    const strikerId = m.player?.id != null ? String(m.player.id) : '';
    const isAttackerStriker = strikerId !== '' && strikerId === atkId;
    const attackerIsPlayer = viewerWasAttacker ? isAttackerStriker : !isAttackerStriker;

    const resultType = m.result ?? 'HIT';
    const dodge = resultType === 'DODGE';
    const critical = resultType === 'CRITICAL_HIT';
    const damage = m.damage ?? 0;

    const strikerName = isAttackerStriker ? atkName : defName;
    const targetName = isAttackerStriker ? defName : atkName;

    let attackerHpAfter: number | undefined;
    let defenderHpAfter: number | undefined;
    if (viewerWasAttacker) {
      attackerHpAfter = m.attackerHealthAfter;
      defenderHpAfter = m.defenderHealthAfter;
    } else {
      attackerHpAfter = m.defenderHealthAfter;
      defenderHpAfter = m.attackerHealthAfter;
    }

    return {
      attackerIsPlayer,
      damage,
      critical,
      dodge,
      attackerHpAfter,
      defenderHpAfter,
      strikerName: strikerName || undefined,
      targetName: targetName || undefined,
    };
  });

  const won = data.resultForViewer === 'victory';
  const delta = data.famePointsChangeForViewer;
  const playerMaxHp = viewerWasAttacker ? data.attackerMaxHp : data.defenderMaxHp;
  const opponentMaxHp = viewerWasAttacker ? data.defenderMaxHp : data.attackerMaxHp;

  return {
    won,
    logs,
    fameEarned: Math.max(0, delta),
    famePointsChange: delta,
    playerMaxHp,
    opponentMaxHp,
  };
}

const FIGHT_HISTORY_DATE = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;

export function parseFightHistoryDate(dateStr: string): Date {
  const m = FIGHT_HISTORY_DATE.exec(dateStr.trim());
  if (!m) {
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }
  return new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4]),
    Number(m[5])
  );
}

export function mapFightHistoryRowToArenaEntry(
  h: FightHistoryEntry,
  opponents: ArenaOpponent[]
): ArenaBattleHistoryEntry {
  const oid = h.opponent.id != null ? String(h.opponent.id) : '';
  const fromList = opponents.find((o) => String(o.id) === oid);
  const opponent: ArenaOpponent =
    fromList ??
    ({
      id: h.opponent.id ?? oid,
      name: h.opponent.username,
      avatarId: 'captain',
      level: 1,
      famePoints: 0,
      strength: 0,
      agility: 0,
      endurance: 0,
      intelligence: 0,
      luck: 0,
    } as ArenaOpponent);

  return {
    id: String(h.id),
    fightId: String(h.id),
    opponent,
    date: parseFightHistoryDate(h.date ?? ''),
    won: h.result === 'victory',
    fameChange: h.famePointsChange,
  };
}
