import type { CurrentActivityDto } from '@/types/currentActivity';

export type GameNavKey =
  | 'character'
  | 'missions'
  | 'works'
  | 'training'
  | 'fights'
  | 'dungeons'
  | 'store'
  | 'statek'
  | 'ranking'
  | 'boosters'
  | 'premium-shop'
  | 'coupons'
  | 'rzut-moneta'
  | 'questTasks'
  | 'dailyChallenges'
  | 'weeklyContract'
  | 'notifications'
  | 'settings';

export type ActivityFlags = {
  isInMission: boolean;
  isInWork: boolean;
  isInTraining: boolean;
};

export function activityFlagsFromUser(currentActivity?: CurrentActivityDto | null): ActivityFlags {
  return {
    isInMission: Boolean(currentActivity?.mission),
    isInWork: Boolean(currentActivity?.work),
    isInTraining: Boolean(currentActivity?.training),
  };
}

export function getNavItemActivityState(
  key: GameNavKey,
  flags: ActivityFlags
): { disabled: boolean; reasonKey: string | null } {
  const { isInMission, isInWork, isInTraining } = flags;

  
  if (isInMission) {
    if (key === 'works' || key === 'training' || key === 'dungeons') {
      return { disabled: true, reasonKey: 'finishMissionFirst' };
    }
    return { disabled: false, reasonKey: null };
  }

  if (isInWork) {
    if (key === 'missions' || key === 'training' || key === 'dungeons') {
      return { disabled: true, reasonKey: 'finishWorkFirst' };
    }
    return { disabled: false, reasonKey: null };
  }

  
  if (isInTraining) {
    if (key === 'missions' || key === 'works' || key === 'dungeons') {
      return { disabled: true, reasonKey: 'finishTrainingFirst' };
    }
    return { disabled: false, reasonKey: null };
  }

  return { disabled: false, reasonKey: null };
}

const PREVIEW_SEGMENTS = new Set(['user', 'ship']);

export function pathnameToGameNavKey(pathname: string): GameNavKey | null {
  const match = pathname.match(/^\/game\/([^/]+)/);
  if (!match) return null;
  const seg = match[1];
  if (PREVIEW_SEGMENTS.has(seg)) return null;
  return seg as GameNavKey;
}

export function getSafeRouteForActivity(flags: ActivityFlags): string | null {
  if (flags.isInMission) return '/game/missions';
  if (flags.isInWork) return '/game/works';
  if (flags.isInTraining) return '/game/training';
  return null;
}

export function getActivityBlockRedirect(
  pathname: string,
  currentActivity?: CurrentActivityDto | null
): string | null {
  const flags = activityFlagsFromUser(currentActivity);
  if (!flags.isInMission && !flags.isInWork && !flags.isInTraining) {
    return null;
  }

  const key = pathnameToGameNavKey(pathname);
  if (!key) return null;

  const { disabled } = getNavItemActivityState(key, flags);
  if (!disabled) return null;

  return getSafeRouteForActivity(flags) ?? null;
}
