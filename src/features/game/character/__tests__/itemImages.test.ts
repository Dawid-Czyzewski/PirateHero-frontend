import { describe, expect, it } from 'vitest';
import {
  ITEM_IMAGE_KEYS,
  resolveItemImageUrl,
} from '@/features/game/character/itemImages';

describe('resolveItemImageUrl', () => {
  it('maps all catalog-style keys and has 187 PNGs', () => {
    expect(ITEM_IMAGE_KEYS).toHaveLength(187);
    expect(ITEM_IMAGE_KEYS).toContain('helm_01');
    expect(ITEM_IMAGE_KEYS).toContain('sword_01');
  });

  it('falls back to helm_01 for missing or null keys', () => {
    const fallback = resolveItemImageUrl('helm_01');
    expect(fallback).toBeTruthy();
    expect(resolveItemImageUrl(null)).toBe(fallback);
    expect(resolveItemImageUrl(undefined)).toBe(fallback);
    expect(resolveItemImageUrl('definitely_missing_key_xyz')).toBe(fallback);
  });

  it('resolves a known key to a non-empty url', () => {
    const url = resolveItemImageUrl('sword_01');
    expect(url).toBeTruthy();
    expect(url).not.toBe(resolveItemImageUrl('definitely_missing_key_xyz'));
  });
});
