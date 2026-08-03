import dungeonCrypt from '@/assets/dungeons/arena/dungeon-crypt.jpg';
import dungeonKraken from '@/assets/dungeons/arena/dungeon-kraken.jpg';
import dungeonFortress from '@/assets/dungeons/arena/dungeon-fortress.jpg';
import dungeonVolcano from '@/assets/dungeons/arena/dungeon-volcano.jpg';
import dungeonPoseidon from '@/assets/dungeons/arena/dungeon-poseidon.jpg';
import enemySkeleton from '@/assets/dungeons/enemy/enemy-skeleton.jpg';
import enemyKraken from '@/assets/dungeons/enemy/enemy-kraken.jpg';
import enemyBlackbeard from '@/assets/dungeons/enemy/enemy-blackbeard.jpg';
import enemyDavy from '@/assets/dungeons/enemy/enemy-davy.jpg';
import enemyPoseidon from '@/assets/dungeons/enemy/enemy-poseidon.jpg';
import kryptaEnemyStage01 from '@/assets/dungeons/enemy/krypta/stage-01.jpg';
import kryptaEnemyStage02 from '@/assets/dungeons/enemy/krypta/stage-02.jpg';
import kryptaEnemyStage03 from '@/assets/dungeons/enemy/krypta/stage-03.jpg';
import kryptaEnemyStage04 from '@/assets/dungeons/enemy/krypta/stage-04.jpg';
import kryptaEnemyStage05 from '@/assets/dungeons/enemy/krypta/stage-05.jpg';
import kryptaEnemyStage06 from '@/assets/dungeons/enemy/krypta/stage-06.jpg';
import kryptaEnemyStage07 from '@/assets/dungeons/enemy/krypta/stage-07.jpg';
import kryptaEnemyStage08 from '@/assets/dungeons/enemy/krypta/stage-08.jpg';
import kryptaEnemyStage09 from '@/assets/dungeons/enemy/krypta/stage-09.jpg';
import kryptaEnemyStage10 from '@/assets/dungeons/enemy/krypta/stage-10.jpg';
import krakenEnemyStage01 from '@/assets/dungeons/enemy/kraken/stage-01.jpg';
import krakenEnemyStage02 from '@/assets/dungeons/enemy/kraken/stage-02.jpg';
import krakenEnemyStage03 from '@/assets/dungeons/enemy/kraken/stage-03.jpg';
import krakenEnemyStage04 from '@/assets/dungeons/enemy/kraken/stage-04.jpg';
import krakenEnemyStage05 from '@/assets/dungeons/enemy/kraken/stage-05.jpg';
import krakenEnemyStage06 from '@/assets/dungeons/enemy/kraken/stage-06.jpg';
import krakenEnemyStage07 from '@/assets/dungeons/enemy/kraken/stage-07.jpg';
import krakenEnemyStage08 from '@/assets/dungeons/enemy/kraken/stage-08.jpg';
import krakenEnemyStage09 from '@/assets/dungeons/enemy/kraken/stage-09.jpg';
import krakenEnemyStage10 from '@/assets/dungeons/enemy/kraken/stage-10.jpg';
import fortecaEnemyStage01 from '@/assets/dungeons/enemy/forteca/stage-01.jpg';
import fortecaEnemyStage02 from '@/assets/dungeons/enemy/forteca/stage-02.jpg';
import fortecaEnemyStage03 from '@/assets/dungeons/enemy/forteca/stage-03.jpg';
import fortecaEnemyStage04 from '@/assets/dungeons/enemy/forteca/stage-04.jpg';
import fortecaEnemyStage05 from '@/assets/dungeons/enemy/forteca/stage-05.jpg';
import fortecaEnemyStage06 from '@/assets/dungeons/enemy/forteca/stage-06.jpg';
import fortecaEnemyStage07 from '@/assets/dungeons/enemy/forteca/stage-07.jpg';
import fortecaEnemyStage08 from '@/assets/dungeons/enemy/forteca/stage-08.jpg';
import fortecaEnemyStage09 from '@/assets/dungeons/enemy/forteca/stage-09.jpg';
import fortecaEnemyStage10 from '@/assets/dungeons/enemy/forteca/stage-10.jpg';
import wulkanEnemyStage01 from '@/assets/dungeons/enemy/wulkan/stage-01.jpg';
import wulkanEnemyStage02 from '@/assets/dungeons/enemy/wulkan/stage-02.jpg';
import wulkanEnemyStage03 from '@/assets/dungeons/enemy/wulkan/stage-03.jpg';
import wulkanEnemyStage04 from '@/assets/dungeons/enemy/wulkan/stage-04.jpg';
import wulkanEnemyStage05 from '@/assets/dungeons/enemy/wulkan/stage-05.jpg';
import wulkanEnemyStage06 from '@/assets/dungeons/enemy/wulkan/stage-06.jpg';
import wulkanEnemyStage07 from '@/assets/dungeons/enemy/wulkan/stage-07.jpg';
import wulkanEnemyStage08 from '@/assets/dungeons/enemy/wulkan/stage-08.jpg';
import wulkanEnemyStage09 from '@/assets/dungeons/enemy/wulkan/stage-09.jpg';
import wulkanEnemyStage10 from '@/assets/dungeons/enemy/wulkan/stage-10.jpg';
import palacEnemyStage01 from '@/assets/dungeons/enemy/palac/stage-01.jpg';
import palacEnemyStage02 from '@/assets/dungeons/enemy/palac/stage-02.jpg';
import palacEnemyStage03 from '@/assets/dungeons/enemy/palac/stage-03.jpg';
import palacEnemyStage04 from '@/assets/dungeons/enemy/palac/stage-04.jpg';
import palacEnemyStage05 from '@/assets/dungeons/enemy/palac/stage-05.jpg';
import palacEnemyStage06 from '@/assets/dungeons/enemy/palac/stage-06.jpg';
import palacEnemyStage07 from '@/assets/dungeons/enemy/palac/stage-07.jpg';
import palacEnemyStage08 from '@/assets/dungeons/enemy/palac/stage-08.jpg';
import palacEnemyStage09 from '@/assets/dungeons/enemy/palac/stage-09.jpg';
import palacEnemyStage10 from '@/assets/dungeons/enemy/palac/stage-10.jpg';
import type { DungeonDefinition } from './dungeonTypes';

const KRYPTA_STAGE_ENEMY_NAME_KEYS = [
  'dungeonsPage.dungeons.krypta.enemies.stage01',
  'dungeonsPage.dungeons.krypta.enemies.stage02',
  'dungeonsPage.dungeons.krypta.enemies.stage03',
  'dungeonsPage.dungeons.krypta.enemies.stage04',
  'dungeonsPage.dungeons.krypta.enemies.stage05',
  'dungeonsPage.dungeons.krypta.enemies.stage06',
  'dungeonsPage.dungeons.krypta.enemies.stage07',
  'dungeonsPage.dungeons.krypta.enemies.stage08',
  'dungeonsPage.dungeons.krypta.enemies.stage09',
  'dungeonsPage.dungeons.krypta.enemies.stage10',
] as const;

const KRYPTA_STAGE_ENEMIES = [
  kryptaEnemyStage01,
  kryptaEnemyStage02,
  kryptaEnemyStage03,
  kryptaEnemyStage04,
  kryptaEnemyStage05,
  kryptaEnemyStage06,
  kryptaEnemyStage07,
  kryptaEnemyStage08,
  kryptaEnemyStage09,
  kryptaEnemyStage10,
] as const;

const KRAKEN_STAGE_ENEMY_NAME_KEYS = [
  'dungeonsPage.dungeons.kraken.enemies.stage01',
  'dungeonsPage.dungeons.kraken.enemies.stage02',
  'dungeonsPage.dungeons.kraken.enemies.stage03',
  'dungeonsPage.dungeons.kraken.enemies.stage04',
  'dungeonsPage.dungeons.kraken.enemies.stage05',
  'dungeonsPage.dungeons.kraken.enemies.stage06',
  'dungeonsPage.dungeons.kraken.enemies.stage07',
  'dungeonsPage.dungeons.kraken.enemies.stage08',
  'dungeonsPage.dungeons.kraken.enemies.stage09',
  'dungeonsPage.dungeons.kraken.enemies.stage10',
] as const;

const KRAKEN_STAGE_ENEMIES = [
  krakenEnemyStage01,
  krakenEnemyStage02,
  krakenEnemyStage03,
  krakenEnemyStage04,
  krakenEnemyStage05,
  krakenEnemyStage06,
  krakenEnemyStage07,
  krakenEnemyStage08,
  krakenEnemyStage09,
  krakenEnemyStage10,
] as const;

const FORTECA_STAGE_ENEMY_NAME_KEYS = [
  'dungeonsPage.dungeons.forteca.enemies.stage01',
  'dungeonsPage.dungeons.forteca.enemies.stage02',
  'dungeonsPage.dungeons.forteca.enemies.stage03',
  'dungeonsPage.dungeons.forteca.enemies.stage04',
  'dungeonsPage.dungeons.forteca.enemies.stage05',
  'dungeonsPage.dungeons.forteca.enemies.stage06',
  'dungeonsPage.dungeons.forteca.enemies.stage07',
  'dungeonsPage.dungeons.forteca.enemies.stage08',
  'dungeonsPage.dungeons.forteca.enemies.stage09',
  'dungeonsPage.dungeons.forteca.enemies.stage10',
] as const;

const FORTECA_STAGE_ENEMIES = [
  fortecaEnemyStage01,
  fortecaEnemyStage02,
  fortecaEnemyStage03,
  fortecaEnemyStage04,
  fortecaEnemyStage05,
  fortecaEnemyStage06,
  fortecaEnemyStage07,
  fortecaEnemyStage08,
  fortecaEnemyStage09,
  fortecaEnemyStage10,
] as const;

const WULKAN_STAGE_ENEMY_NAME_KEYS = [
  'dungeonsPage.dungeons.wulkan.enemies.stage01',
  'dungeonsPage.dungeons.wulkan.enemies.stage02',
  'dungeonsPage.dungeons.wulkan.enemies.stage03',
  'dungeonsPage.dungeons.wulkan.enemies.stage04',
  'dungeonsPage.dungeons.wulkan.enemies.stage05',
  'dungeonsPage.dungeons.wulkan.enemies.stage06',
  'dungeonsPage.dungeons.wulkan.enemies.stage07',
  'dungeonsPage.dungeons.wulkan.enemies.stage08',
  'dungeonsPage.dungeons.wulkan.enemies.stage09',
  'dungeonsPage.dungeons.wulkan.enemies.stage10',
] as const;

const WULKAN_STAGE_ENEMIES = [
  wulkanEnemyStage01,
  wulkanEnemyStage02,
  wulkanEnemyStage03,
  wulkanEnemyStage04,
  wulkanEnemyStage05,
  wulkanEnemyStage06,
  wulkanEnemyStage07,
  wulkanEnemyStage08,
  wulkanEnemyStage09,
  wulkanEnemyStage10,
] as const;

const PALAC_STAGE_ENEMY_NAME_KEYS = [
  'dungeonsPage.dungeons.palac.enemies.stage01',
  'dungeonsPage.dungeons.palac.enemies.stage02',
  'dungeonsPage.dungeons.palac.enemies.stage03',
  'dungeonsPage.dungeons.palac.enemies.stage04',
  'dungeonsPage.dungeons.palac.enemies.stage05',
  'dungeonsPage.dungeons.palac.enemies.stage06',
  'dungeonsPage.dungeons.palac.enemies.stage07',
  'dungeonsPage.dungeons.palac.enemies.stage08',
  'dungeonsPage.dungeons.palac.enemies.stage09',
  'dungeonsPage.dungeons.palac.enemies.stage10',
] as const;

const PALAC_STAGE_ENEMIES = [
  palacEnemyStage01,
  palacEnemyStage02,
  palacEnemyStage03,
  palacEnemyStage04,
  palacEnemyStage05,
  palacEnemyStage06,
  palacEnemyStage07,
  palacEnemyStage08,
  palacEnemyStage09,
  palacEnemyStage10,
] as const;

export const DUNGEONS: DungeonDefinition[] = [
  {
    id: 'krypta',
    nameKey: 'dungeonsPage.dungeons.krypta.name',
    descKey: 'dungeonsPage.dungeons.krypta.desc',
    reqLevel: 15,
    bg: dungeonCrypt,
    enemy: enemySkeleton,
    stageEnemies: [...KRYPTA_STAGE_ENEMIES],
    stageEnemyNameKeys: [...KRYPTA_STAGE_ENEMY_NAME_KEYS],
    enemyNameKey: 'dungeonsPage.dungeons.krypta.enemy',
    baseHp: 80,
    baseDmg: 10,
    goldPerStage: 40,
    completionGold: 500,
    completionDiamonds: 10,
    completionGrantsItem: true,
  },
  {
    id: 'kraken',
    nameKey: 'dungeonsPage.dungeons.kraken.name',
    descKey: 'dungeonsPage.dungeons.kraken.desc',
    reqLevel: 25,
    bg: dungeonKraken,
    enemy: enemyKraken,
    stageEnemies: [...KRAKEN_STAGE_ENEMIES],
    stageEnemyNameKeys: [...KRAKEN_STAGE_ENEMY_NAME_KEYS],
    enemyNameKey: 'dungeonsPage.dungeons.kraken.enemy',
    baseHp: 120,
    baseDmg: 14,
    goldPerStage: 70,
    completionGold: 700,
    completionDiamonds: 15,
    completionGrantsItem: true,
  },
  {
    id: 'forteca',
    nameKey: 'dungeonsPage.dungeons.forteca.name',
    descKey: 'dungeonsPage.dungeons.forteca.desc',
    reqLevel: 40,
    bg: dungeonFortress,
    enemy: enemyBlackbeard,
    stageEnemies: [...FORTECA_STAGE_ENEMIES],
    stageEnemyNameKeys: [...FORTECA_STAGE_ENEMY_NAME_KEYS],
    enemyNameKey: 'dungeonsPage.dungeons.forteca.enemy',
    baseHp: 170,
    baseDmg: 18,
    goldPerStage: 110,
    completionGold: 1000,
    completionDiamonds: 20,
    completionGrantsItem: true,
  },
  {
    id: 'wulkan',
    nameKey: 'dungeonsPage.dungeons.wulkan.name',
    descKey: 'dungeonsPage.dungeons.wulkan.desc',
    reqLevel: 60,
    bg: dungeonVolcano,
    enemy: enemyDavy,
    stageEnemies: [...WULKAN_STAGE_ENEMIES],
    stageEnemyNameKeys: [...WULKAN_STAGE_ENEMY_NAME_KEYS],
    enemyNameKey: 'dungeonsPage.dungeons.wulkan.enemy',
    baseHp: 230,
    baseDmg: 24,
    goldPerStage: 138,
    completionGold: 1500,
    completionDiamonds: 30,
    completionGrantsItem: true,
  },
  {
    id: 'palac',
    nameKey: 'dungeonsPage.dungeons.palac.name',
    descKey: 'dungeonsPage.dungeons.palac.desc',
    reqLevel: 80,
    bg: dungeonPoseidon,
    enemy: enemyPoseidon,
    stageEnemies: [...PALAC_STAGE_ENEMIES],
    stageEnemyNameKeys: [...PALAC_STAGE_ENEMY_NAME_KEYS],
    enemyNameKey: 'dungeonsPage.dungeons.palac.enemy',
    baseHp: 320,
    baseDmg: 32,
    goldPerStage: 166,
    completionGold: 2500,
    completionDiamonds: 40,
    completionGrantsItem: true,
  },
];

export const STAGES_PER_DUNGEON = 10;
