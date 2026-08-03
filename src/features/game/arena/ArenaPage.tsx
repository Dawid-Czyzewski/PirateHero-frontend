import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import type { FightsPageProps } from '@/features/game/gamePageTypes';
import type { FightStartSuccessData } from '@/types/fight';
import { getFightRefillInfo } from '@/services/refillService';
import type { FightRefillInfoData } from '@/types/refill';
import { calculateCapacityWithBoosters } from '@/features/game/boosters/boosterUtils';
import { FightRefillModals } from '@/features/game/fights/FightRefillModals';
import { BASE_STATS } from '@/features/game/character/characterPageConfig';
import {
  buildCatalog,
  deriveBaseStats,
  deriveEquipped,
} from '@/features/game/character/characterPageDerived';
import { computeTotalStatsWithEquipment } from '@/features/game/character/characterInventoryTotalStats';
import { useSessionShopBoostersOptional } from '@/features/game/boosters/SessionShopBoostersContext';
import { applySkillsShopBoosterToTotalStats } from '@/features/game/boosters/sessionShopBoosterEffects';
import {
  applyShipSkillsToTotalStats,
  shipSkillsLevelFromGameUser,
} from '@/features/game/ship/shipBonusEffects';
import { DEFAULT_ARENA_PLAYER } from './arenaBattleEngine';
import { ARENA_FIGHT_DUEL_COST } from './arenaConstants';
import type { ArenaPlayerStats } from './arenaTypes';
import type { ArenaOpponent } from './arenaTypes';
import { ArenaBattleView } from './ArenaBattleView';
import { ArenaFightLoadingView } from './ArenaFightLoadingView';
import { ArenaListView } from './ArenaListView';
import { useArenaGame } from './useArenaGame';

export default function ArenaPage({ onQuestsUpdated }: FightsPageProps) {
  const { t } = useTranslation();
  const { user, fetchUserData, updateUser } = useUser();
  const { entries: shopBoosterEntries, nowMs: shopBoosterNowMs } = useSessionShopBoostersOptional();
  const [fightRefillOpen, setFightRefillOpen] = useState(false);
  const [fightRefillInfo, setFightRefillInfo] = useState<FightRefillInfoData | null>(null);
  const [arenaError, setArenaError] = useState<string | null>(null);
  const [fightLoadingOpp, setFightLoadingOpp] = useState<ArenaOpponent | null>(null);

  const lastGoodArenaPlayerStatsRef = useRef<{ userId: string; payload: ArenaPlayerStats } | null>(
    null
  );

  const playerStats = useMemo((): ArenaPlayerStats => {
    const level = Math.max(1, Number(user?.level?.name ?? DEFAULT_ARENA_PLAYER.level) || 1);
    if (!user?.id) {
      lastGoodArenaPlayerStatsRef.current = null;
      return { ...BASE_STATS, level };
    }
    const userId = String(user.id);

    if (!user.userBaseStatistics) {
      const prev = lastGoodArenaPlayerStatsRef.current;
      if (prev && prev.userId === userId) {
        return { ...prev.payload, level };
      }
      return { ...BASE_STATS, level };
    }

    const catalog = buildCatalog(user);
    const equipped = deriveEquipped(user);
    const baseStats = deriveBaseStats(user);
    const totalStats = computeTotalStatsWithEquipment(baseStats, equipped, catalog);
    const afterShop = applySkillsShopBoosterToTotalStats(
      shopBoosterEntries,
      shopBoosterNowMs,
      totalStats
    );
    const shipSkills = shipSkillsLevelFromGameUser(user);
    const combatStats =
      shipSkills > 0 ? applyShipSkillsToTotalStats(afterShop, shipSkills) : afterShop;
    const payload: ArenaPlayerStats = { ...combatStats, level };
    lastGoodArenaPlayerStatsRef.current = { userId, payload };
    return payload;
  }, [user, shopBoosterEntries, shopBoosterNowMs]);

  const onFightApiError = useCallback((msg: string) => {
    setArenaError(msg);
  }, []);

  const arena = useArenaGame({
    playerStats,
    playerUsername: user?.username ?? '',
    onFightApiError,
  });
  const startFightRaw = arena.list.startFight;

  useEffect(() => {
    void (async () => {
      const result = await getFightRefillInfo();
      if (result.success === true) {
        setFightRefillInfo(result.data);
      }
    })();
  }, [user]);

  const { maxFight, currentFight, fightPercent } = useMemo(() => {
    const cap = calculateCapacityWithBoosters(user?.userCapacities, user?.userBoosters);
    const max = Math.max(1, Number(cap.fightPoints) || 1);
    const cur = Math.max(0, Math.min(Number(user?.duelPoints ?? 0) || 0, max));
    return {
      maxFight: max,
      currentFight: cur,
      fightPercent: Math.min(100, (cur / max) * 100),
    };
  }, [user?.duelPoints, user?.userCapacities, user?.userBoosters]);

  const canRefillFight = fightRefillInfo?.canRefill ?? false;
  const allFightRefillsUsed = fightRefillInfo?.refillsRemaining === 0;
  const fightPointsFull = currentFight >= maxFight;
  const fightRefillPlusDisabled =
    !fightRefillInfo || allFightRefillsUsed || fightPointsFull;
  const fightRefillPlusTooltip = !fightRefillInfo
    ? String(t('loading'))
    : allFightRefillsUsed
      ? String(t('allRefillsUsed'))
      : fightPointsFull
        ? String(t('fightPointsFull'))
        : canRefillFight
          ? String(t('refillFightPoints'))
          : String(t('fightPointsFull'));

  const startFightWithCost = useCallback(
    async (opp: ArenaOpponent): Promise<FightStartSuccessData | null> => {
      if (!user) return null;
      const cur = Number(user.duelPoints ?? 0);
      if (cur < ARENA_FIGHT_DUEL_COST) {
        setArenaError(
          String(t('notEnoughDuelPointsTooltip', { required: ARENA_FIGHT_DUEL_COST, current: cur }))
        );
        return null;
      }
      setArenaError(null);
      setFightLoadingOpp(opp);
      try {
        const data = await startFightRaw(opp);
        setFightLoadingOpp(null);
        if (!data) return null;

        const fameDelta = Number(data.famePointsChange ?? 0);
        const duelSpent = Number(data.duelPointsSpent ?? ARENA_FIGHT_DUEL_COST);
        void updateUser({
          famePoints: Math.max(0, Math.round(Number(user.famePoints ?? 0) + fameDelta)),
          duelPoints: Math.max(0, Math.round(Number(user.duelPoints ?? 0) - duelSpent)),
        });

        if (typeof data.unclaimedCount === 'number') {
          void onQuestsUpdated?.(data.unclaimedCount);
        }
        void fetchUserData();
        return data;
      } catch (e) {
        setFightLoadingOpp(null);
        throw e;
      }
    },
    [user, startFightRaw, t, onQuestsUpdated, fetchUserData, updateUser]
  );

  const listForView = useMemo(
    () => ({
      ...arena.list,
      startFight: startFightWithCost,
    }),
    [arena.list, startFightWithCost]
  );

  usePageMeta({
    title: `${t('arena')} | Pirate Hero`,
    description: t('arenaPage.seoDescription'),
  });

  const fightPointsStrip = {
    current: currentFight,
    max: maxFight,
    percent: fightPercent,
    onRefillClick: () => setFightRefillOpen(true),
    refillPlusDisabled: fightRefillPlusDisabled,
    refillPlusTooltip: fightRefillPlusTooltip,
  };

  const showBattle =
    arena.battleActive && arena.battle.battleOpp && arena.battle.battleResult;

  const main = fightLoadingOpp ? (
    <ArenaFightLoadingView
      t={t}
      opponent={fightLoadingOpp}
      playerLevel={playerStats.level}
      playerAvatarId={String(user?.avatarName ?? 'captain')}
      playerName={user?.username ?? ''}
      loadingKind="fight"
    />
  ) : arena.replayPrepareOpponent ? (
    <ArenaFightLoadingView
      t={t}
      opponent={arena.replayPrepareOpponent}
      playerLevel={playerStats.level}
      playerAvatarId={String(user?.avatarName ?? 'captain')}
      playerName={user?.username ?? ''}
      loadingKind="replay"
    />
  ) : showBattle ? (
    <ArenaBattleView
      t={t}
      playerLevel={playerStats.level}
      playerAvatarId={String(user?.avatarName ?? 'captain')}
      playerUsername={user?.username ?? ''}
      battleOpp={arena.battle.battleOpp!}
      battle={arena.battle}
    />
  ) : (
      <ArenaListView
        t={t}
        list={listForView}
        playerStats={playerStats}
        playerFamePoints={Number(user?.famePoints ?? 0)}
        fightPointsStrip={fightPointsStrip}
        arenaError={arenaError}
        onDismissArenaError={() => setArenaError(null)}
        fightDuelCost={ARENA_FIGHT_DUEL_COST}
        currentDuelPoints={currentFight}
      />
  );

  return (
    <>
      {main}
      <FightRefillModals open={fightRefillOpen} onRequestClose={() => setFightRefillOpen(false)} />
    </>
  );
}
