import { describe, expect, it } from 'vitest';
import { gameViewFromPath } from '@/pages/game/gamePath';

describe('gameViewFromPath', () => {
  it('returns menu for /game', () => {
    expect(gameViewFromPath('/game')).toBe('menu');
  });

  it('returns missions segment', () => {
    expect(gameViewFromPath('/game/missions')).toBe('missions');
  });

  it('returns statek segment', () => {
    expect(gameViewFromPath('/game/statek')).toBe('statek');
  });

  it('detects user preview', () => {
    expect(gameViewFromPath('/game/user/u1')).toBe('userPreview');
  });

  it('detects ship preview', () => {
    expect(gameViewFromPath('/game/ship/c1')).toBe('shipPreview');
  });

  it('non-game path defaults to menu', () => {
    expect(gameViewFromPath('/about')).toBe('menu');
  });
});
