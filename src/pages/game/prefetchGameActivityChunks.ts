import { eagerGameRouteImports, arenaRouteImport } from './gameLazyRoutes';

export function prefetchEagerGameRouteChunks(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  return Promise.all(
    eagerGameRouteImports.map((load) =>
      load().catch(() => {

      })
    )
  ).then(() => undefined);
}

export const ARENA_ROUTE_LOADER = arenaRouteImport;

export function prefetchGameActivityChunks(): void {
  void prefetchEagerGameRouteChunks();
}
