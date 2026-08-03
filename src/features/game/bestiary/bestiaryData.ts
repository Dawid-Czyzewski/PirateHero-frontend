import { DUNGEONS, STAGES_PER_DUNGEON } from '@/features/game/dungeons/dungeonData';
import { dungeonEnemyNameKey, dungeonEnemyPortrait } from '@/features/game/dungeons/dungeonArenaMap';

export type BestiaryStaticEntry = {
  enemyId: string;
  dungeonId: string;
  stage: number;
  nameKey: string;
  loreKey: string;
  portraitSrc: string;
  dungeonNameKey: string;
};

const BESTIARY_DUNGEON_IDS = new Set(['krypta', 'kraken', 'forteca', 'wulkan', 'palac']);

export function buildBestiaryStaticEntries(): BestiaryStaticEntry[] {
  const entries: BestiaryStaticEntry[] = [];

  for (const dungeon of DUNGEONS) {
    if (!BESTIARY_DUNGEON_IDS.has(dungeon.id)) continue;

    for (let stage = 1; stage <= STAGES_PER_DUNGEON; stage += 1) {
      const stageKey = `stage${String(stage).padStart(2, '0')}`;
      entries.push({
        enemyId: `${dungeon.id}-s${stage}`,
        dungeonId: dungeon.id,
        stage,
        nameKey: dungeonEnemyNameKey(dungeon, stage),
        loreKey: `bestiaryPage.enemies.${dungeon.id}.${stageKey}.lore`,
        portraitSrc: dungeonEnemyPortrait(dungeon, stage),
        dungeonNameKey: dungeon.nameKey,
      });
    }
  }

  return entries;
}

export const BESTIARY_STATIC_ENTRIES = buildBestiaryStaticEntries();

export function findBestiaryStaticEntry(enemyId: string): BestiaryStaticEntry | undefined {
  return BESTIARY_STATIC_ENTRIES.find((entry) => entry.enemyId === enemyId);
}
