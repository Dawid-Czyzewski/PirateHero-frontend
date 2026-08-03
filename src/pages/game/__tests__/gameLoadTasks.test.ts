import { describe, expect, it } from 'vitest';
import {
  createInitialGameLoadTasks,
  gameLoadProgressPercent,
  isGameLoadComplete,
} from '../gameLoadTasks';

describe('gameLoadTasks', () => {
  it('progress is 0 until tasks complete', () => {
    expect(gameLoadProgressPercent(createInitialGameLoadTasks())).toBe(0);
  });

  it('progress reaches 100 only when all five tasks finished', () => {
    const tasks = {
      user: true,
      chunks: true,
      dungeon: true,
      quests: true,
      notifications: true,
    };
    expect(gameLoadProgressPercent(tasks)).toBe(100);
    expect(isGameLoadComplete(tasks)).toBe(true);
  });

  it('each completed task adds 20%', () => {
    expect(
      gameLoadProgressPercent({
        user: true,
        chunks: false,
        dungeon: false,
        quests: false,
        notifications: false,
      })
    ).toBe(20);
    expect(
      gameLoadProgressPercent({
        user: true,
        chunks: true,
        dungeon: true,
        quests: false,
        notifications: false,
      })
    ).toBe(60);
  });
});
