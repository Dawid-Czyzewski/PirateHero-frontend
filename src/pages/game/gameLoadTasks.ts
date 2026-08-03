export const GAME_LOAD_TASK_IDS = [
  'user',
  'chunks',
  'dungeon',
  'quests',
  'notifications',
] as const;

export type GameLoadTaskId = (typeof GAME_LOAD_TASK_IDS)[number];

export type GameLoadTaskState = Record<GameLoadTaskId, boolean>;

export const GAME_LOAD_TASK_COUNT = GAME_LOAD_TASK_IDS.length;

export function createInitialGameLoadTasks(): GameLoadTaskState {
  return {
    user: false,
    chunks: false,
    dungeon: false,
    quests: false,
    notifications: false,
  };
}

export function gameLoadProgressPercent(tasks: GameLoadTaskState): number {
  const completed = GAME_LOAD_TASK_IDS.filter((id) => tasks[id]).length;
  return Math.round((completed / GAME_LOAD_TASK_COUNT) * 100);
}

export function isGameLoadComplete(tasks: GameLoadTaskState): boolean {
  return GAME_LOAD_TASK_IDS.every((id) => tasks[id]);
}
