import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { DungeonsHeader } from './DungeonsHeader';
import { DungeonsList } from './DungeonsList';
import { DungeonStagesView } from './DungeonStagesView';
import { DungeonBattleView } from './DungeonBattleView';
import { useDungeonsState } from './useDungeonsState';
import { STAGES_PER_DUNGEON } from './dungeonData';
import type { DungeonDefinition, DungeonDifficulty, DungeonView } from './dungeonTypes';

function parsePlayerLevel(levelName: string | undefined): number {
  const n = parseInt(String(levelName ?? '1'), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default function DungeonsPage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const playerLevel = parsePlayerLevel(user?.level?.name);
  const playerName = user?.username?.trim() || 'Kapitan';
  const { progress, setProgress, playerStats, loading, error, reload, cooldownSecondsRemaining, applyCooldownFromFight, clearCooldown } = useDungeonsState(user?.id);
  const [view, setView] = useState<DungeonView>('list');
  const [difficulty, setDifficulty] = useState<DungeonDifficulty>('normal');
  const [activeDungeon, setActiveDungeon] = useState<DungeonDefinition | null>(null);
  const [activeStage, setActiveStage] = useState(1);

  const modeProgress = progress[difficulty] ?? {};
  const normalProgress = progress.normal ?? {};

  const openDungeon = (dungeon: DungeonDefinition) => {
    if (playerLevel < dungeon.reqLevel) return;
    const normalCleared = normalProgress[dungeon.id] ?? 0;
    if (difficulty === 'hard' && normalCleared < STAGES_PER_DUNGEON) return;
    const cleared = modeProgress[dungeon.id] ?? 0;
    if (difficulty === 'normal' && cleared >= STAGES_PER_DUNGEON) return;
    setActiveDungeon(dungeon);
    setView('stages');
  };

  const startStage = (stage: number) => {
    setActiveStage(stage);
    setView('battle');
  };

  const onWin = (nextProgress: typeof progress) => {
    setProgress(nextProgress);
    setView('stages');
  };

  if (loading) {
    return (
      <div className="w-full max-w-none space-y-5 py-4 sm:py-6">
        <DungeonsHeader />
        <p className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
          {t('loading')}
        </p>
      </div>
    );
  }

  if (error || !playerStats) {
    return (
      <div className="w-full max-w-none space-y-5 py-4 sm:py-6">
        <DungeonsHeader />
        <p className="text-sm text-destructive">{t('dungeonsPage.loadFailed')}</p>
        <button
          type="button"
          onClick={() => void reload()}
          className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-heading text-xs uppercase tracking-wide text-primary-foreground"
        >
          {t('dungeonsPage.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-5 py-4 sm:py-6">
      <DungeonsHeader />

      {view === 'list' ? (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDifficulty('normal')}
              className={`cursor-pointer rounded-lg px-4 py-2 font-heading text-xs uppercase tracking-wide ${
                difficulty === 'normal'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('dungeonsPage.difficultyNormal')}
            </button>
            <button
              type="button"
              onClick={() => setDifficulty('hard')}
              className={`cursor-pointer rounded-lg px-4 py-2 font-heading text-xs uppercase tracking-wide ${
                difficulty === 'hard'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('dungeonsPage.difficultyHard')}
            </button>
          </div>
          <DungeonsList
            progress={modeProgress}
            normalProgress={normalProgress}
            difficulty={difficulty}
            playerLevel={playerLevel}
            onOpen={openDungeon}
          />
        </>
      ) : null}
      {view === 'stages' && activeDungeon ? (
        <DungeonStagesView
          dungeon={activeDungeon}
          cleared={modeProgress[activeDungeon.id] ?? 0}
          difficulty={difficulty}
          onBack={() => setView('list')}
          onStart={startStage}
          cooldownSecondsRemaining={cooldownSecondsRemaining}
        />
      ) : null}
      {view === 'battle' && activeDungeon ? (
        <DungeonBattleView
          dungeon={activeDungeon}
          stage={activeStage}
          difficulty={difficulty}
          playerName={playerName}
          playerStats={playerStats}
          playerAvatarId={String(user?.avatarName ?? 'captain')}
          onBack={() => setView('stages')}
          onWin={onWin}
          cooldownSecondsRemaining={cooldownSecondsRemaining}
          onCooldownUpdate={applyCooldownFromFight}
          onCooldownClear={clearCooldown}
        />
      ) : null}
    </div>
  );
}
