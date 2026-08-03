import { describe, expect, it } from 'vitest';
import { ARENA_ROUTE_LOADER, prefetchEagerGameRouteChunks } from '../prefetchGameActivityChunks';
import {
  deferredGameRouteImports,
  eagerGameRouteImports,
  gameRouteImports,
} from '../gameLazyRoutes';

describe('prefetchEagerGameRouteChunks', () => {
  it('resolves after warming eager route chunks', async () => {
    await expect(prefetchEagerGameRouteChunks()).resolves.toBeUndefined();
  }, 30_000);

  it('keeps arena on a separate lazy loader', () => {
    expect(ARENA_ROUTE_LOADER).toBe(deferredGameRouteImports.fights);
  });

  it('preloads coupons, boosters and notifications at bootstrap', () => {
    expect(eagerGameRouteImports).toContain(gameRouteImports.boosters);
    expect(eagerGameRouteImports).toContain(gameRouteImports.coupons);
    expect(eagerGameRouteImports).toContain(gameRouteImports.notifications);
  });

  it('preloads ranking page chunk at bootstrap', () => {
    expect(eagerGameRouteImports).toContain(gameRouteImports.ranking);
  });

  it('defers only ship and arena until first visit', () => {
    expect(eagerGameRouteImports).not.toContain(gameRouteImports.ship);
    expect(eagerGameRouteImports).not.toContain(gameRouteImports.fights);
    expect(deferredGameRouteImports.ship).toBe(gameRouteImports.ship);
    expect(deferredGameRouteImports.fights).toBe(gameRouteImports.fights);
    expect(deferredGameRouteImports).not.toHaveProperty('ranking');
  });
});
