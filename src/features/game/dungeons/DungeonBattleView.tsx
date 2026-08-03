import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArenaBattleView } from '@/features/game/arena/ArenaBattleView';
import { resolveArenaAvatar } from '@/features/game/arena/arenaBattleAvatarUtils';
import { useArenaBattlePlayback } from '@/features/game/arena/useArenaBattlePlayback';
import type { ArenaPlayerStats } from '@/features/game/arena/arenaTypes';
import { useUser } from '@/hooks/useUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  fightDungeonStage,
  mapApiOpponent,
  mapFightToArenaResult,
  mapFightToDungeonVictoryRewards,
  type DungeonFightPayload,
} from '@/services/dungeonService';
import { statColors, statIcons } from '@/features/game/character/characterPageConfig';
import { CHARACTER_STAT_KEYS } from '@/features/game/character/characterSkillPoints';
import { STAGES_PER_DUNGEON } from './dungeonData';
import { dungeonToArenaOpponent, dungeonEnemyPortrait, dungeonEnemyNameKey } from './dungeonArenaMap';
import { DungeonPrepPortrait } from './DungeonPrepPortrait';
import type { DungeonDefinition, DungeonProgress } from './dungeonTypes';

type Props = {
  dungeon: DungeonDefinition;
  stage: number;
  playerName: string;
  playerStats: ArenaPlayerStats;
  playerAvatarId: string;
  onBack: () => void;
  onWin: (progress: DungeonProgress) => void;
};

export function DungeonBattleView({
  dungeon,
  stage,
  playerName,
  playerStats,
  playerAvatarId,
  onBack,
  onWin,
}: Props) {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const queryClient = useQueryClient();
  const battle = useArenaBattlePlayback();
  const pendingProgressRef = useRef<DungeonProgress | null>(null);
  const fightPayloadRef = useRef<DungeonFightPayload | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const enemyName = t(dungeonEnemyNameKey(dungeon, stage));
  const opponentPreview = useMemo(
    () => dungeonToArenaOpponent(dungeon, stage, enemyName),
    [dungeon, stage, enemyName]
  );
  const playerPortrait = useMemo(() => resolveArenaAvatar(playerAvatarId), [playerAvatarId]);

  const startBattle = async () => {
    setIsStarting(true);
    setStartError(null);
    try {
      const payload = await fightDungeonStage(dungeon.id, stage);
      const opponent = mapApiOpponent(
        payload.opponent,
        enemyName,
        dungeonEnemyPortrait(dungeon, stage)
      );
      pendingProgressRef.current = payload.progress;
      fightPayloadRef.current = payload;
      battle.playBattle(opponent, mapFightToArenaResult(payload), false);
      setHasStarted(true);
    } catch (err) {
      const message =
        err instanceof ApiHttpError && err.message ? t(err.message) : t('dungeonsPage.fightFailed');
      setStartError(message);
    } finally {
      setIsStarting(false);
    }
  };

  const handleCloseBattle = () => {
    const won = battle.battleResult?.won ?? false;
    const nextProgress = pendingProgressRef.current;
    const payload = fightPayloadRef.current;
    battle.closeBattle();
    pendingProgressRef.current = null;
    fightPayloadRef.current = null;
    if (won && payload?.updatedUser) {
      void updateUser(patchUserFromRewardResponse(payload.updatedUser));
    }
    if (won && nextProgress) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bestiaryRoot() });
      onWin(nextProgress);
    } else {
      onBack();
    }
  };

  const victoryRewards = fightPayloadRef.current
    ? mapFightToDungeonVictoryRewards(fightPayloadRef.current)
    : undefined;

  if (!hasStarted || !battle.battleActive || !battle.battleOpp || !battle.battleResult) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 font-heading text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('dungeonsPage.backToStages')}
        </button>

        <div className="overflow-hidden rounded-xl border border-border bg-card/50">
          <div className="border-b border-border bg-card px-4 py-3 sm:px-5">
            <p className="font-heading text-[10px] uppercase tracking-[0.2em] text-primary/80">
              {t('dungeonsPage.stageProgress', { stage, total: STAGES_PER_DUNGEON })}
            </p>
            <h3 className="mt-1 font-heading text-xl font-black text-foreground">
              {t('dungeonsPage.beforeBattle')}
            </h3>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            <div className="rounded-lg border border-border bg-background/70 p-4">
              <div className="mb-4 flex items-center gap-3">
                <DungeonPrepPortrait
                  src={playerPortrait.src}
                  emoji={playerPortrait.emoji}
                  alt={playerName}
                  borderClass="border-emerald-500/50"
                />
                <div className="min-w-0">
                  <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
                    {t('dungeonsPage.yourStats')}
                  </p>
                  <p className="truncate font-heading text-lg font-bold text-foreground">{playerName}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative rounded-md border border-border/60 bg-background/40 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('dungeonsPage.statLevel')}</span>
                    <span className="ml-auto font-heading text-lg font-bold tabular-nums text-foreground">
                      {playerStats.level}
                    </span>
                  </div>
                </div>
                {CHARACTER_STAT_KEYS.map((key) => {
                  const Icon = statIcons[key];
                  return (
                    <div key={key} className="relative rounded-md border border-border/60 bg-background/40 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${statColors[key]}`} />
                        <span className="text-sm text-foreground">{t(`characterPage.stats.${key}`)}</span>
                        <span className="ml-auto font-heading text-lg font-bold tabular-nums text-foreground">
                          {playerStats[key]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="mb-4 flex items-center gap-3">
                <DungeonPrepPortrait
                  src={opponentPreview.portraitSrc}
                  emoji="💀"
                  alt={enemyName}
                  borderClass="border-red-500/50"
                />
                <div className="min-w-0">
                  <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
                    {t('dungeonsPage.enemyStats')}
                  </p>
                  <p className="truncate font-heading text-lg font-bold text-foreground">{enemyName}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative rounded-md border border-border/60 bg-background/40 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('dungeonsPage.statLevel')}</span>
                    <span className="ml-auto font-heading text-lg font-bold tabular-nums text-foreground">
                      {opponentPreview.level}
                    </span>
                  </div>
                </div>
                {CHARACTER_STAT_KEYS.map((key) => {
                  const Icon = statIcons[key];
                  return (
                    <div key={key} className="relative rounded-md border border-border/60 bg-background/40 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${statColors[key]}`} />
                        <span className="text-sm text-foreground">{t(`characterPage.stats.${key}`)}</span>
                        <span className="ml-auto font-heading text-lg font-bold tabular-nums text-foreground">
                          {opponentPreview[key]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 border-t border-border px-4 py-3 sm:px-5">
            {startError ? <p className="w-full text-sm text-destructive">{startError}</p> : null}
            <button
              type="button"
              onClick={() => void startBattle()}
              disabled={isStarting}
              className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 font-heading text-xs uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isStarting ? t('dungeonsPage.startingBattle') : t('dungeonsPage.startBattle')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        disabled={battle.battlePhase === 'fighting'}
        className="flex cursor-pointer items-center gap-2 font-heading text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t('dungeonsPage.retreat')}
      </button>

      <ArenaBattleView
        t={t}
        playerLevel={playerStats.level}
        playerAvatarId={playerAvatarId}
        playerUsername={playerName}
        battleOpp={battle.battleOpp}
        battle={battle}
        battleDismissLabel={t('dungeonsPage.nextStage')}
        defeatDismissLabel={t('dungeonsPage.retreat')}
        onCloseBattle={handleCloseBattle}
        backgroundSrc={dungeon.bg}
        hideVictoryRewards={!victoryRewards}
        dungeonVictoryRewards={victoryRewards}
        hideFameOnDefeat
        opponentSubtitle={t('dungeonsPage.stageProgress', { stage, total: STAGES_PER_DUNGEON })}
        battleHeaderTitle={t('dungeonsPage.stageProgress', { stage, total: STAGES_PER_DUNGEON })}
      />
    </div>
  );
}
