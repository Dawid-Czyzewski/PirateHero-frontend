import { describe, expect, it } from 'vitest';
import {
  activityFlagsFromUser,
  getActivityBlockRedirect,
  getNavItemActivityState,
  getSafeRouteForActivity,
  pathnameToGameNavKey,
} from '@/features/game/navigation/gameNavActivityPolicy';

describe('gameNavActivityPolicy', () => {
  it('pathnameToGameNavKey parses /game segment', () => {
    expect(pathnameToGameNavKey('/game/statek')).toBe('statek');
    expect(pathnameToGameNavKey('/game/dungeons')).toBe('dungeons');
    expect(pathnameToGameNavKey('/game/rzut-moneta')).toBe('rzut-moneta');
    expect(pathnameToGameNavKey('/game/settings')).toBe('settings');
    expect(pathnameToGameNavKey('/game/user/x')).toBeNull();
    expect(pathnameToGameNavKey('/game/ship/y')).toBeNull();
  });

  it('getNavItemActivityState blocks work, training and dungeons during mission', () => {
    const flags = { isInMission: true, isInWork: false, isInTraining: false };
    expect(getNavItemActivityState('missions', flags).disabled).toBe(false);
    expect(getNavItemActivityState('character', flags).disabled).toBe(false);
    expect(getNavItemActivityState('statek', flags).disabled).toBe(false);
    expect(getNavItemActivityState('dungeons', flags).disabled).toBe(true);
    expect(getNavItemActivityState('dungeons', flags).reasonKey).toBe('finishMissionFirst');
    expect(getNavItemActivityState('store', flags).disabled).toBe(false);
    expect(getNavItemActivityState('works', flags).reasonKey).toBe('finishMissionFirst');
    expect(getNavItemActivityState('training', flags).reasonKey).toBe('finishMissionFirst');
  });

  it('getNavItemActivityState blocks missions, training and dungeons during work', () => {
    const flags = { isInMission: false, isInWork: true, isInTraining: false };
    expect(getNavItemActivityState('works', flags).disabled).toBe(false);
    expect(getNavItemActivityState('missions', flags).reasonKey).toBe('finishWorkFirst');
    expect(getNavItemActivityState('training', flags).reasonKey).toBe('finishWorkFirst');
    expect(getNavItemActivityState('dungeons', flags).disabled).toBe(true);
    expect(getNavItemActivityState('dungeons', flags).reasonKey).toBe('finishWorkFirst');
    expect(getNavItemActivityState('store', flags).disabled).toBe(false);
    expect(getNavItemActivityState('fights', flags).disabled).toBe(false);
    expect(getNavItemActivityState('character', flags).disabled).toBe(false);
  });

  it('getNavItemActivityState blocks missions, works and dungeons during training', () => {
    const flags = { isInMission: false, isInWork: false, isInTraining: true };
    expect(getNavItemActivityState('training', flags).disabled).toBe(false);
    expect(getNavItemActivityState('missions', flags).reasonKey).toBe('finishTrainingFirst');
    expect(getNavItemActivityState('works', flags).reasonKey).toBe('finishTrainingFirst');
    expect(getNavItemActivityState('dungeons', flags).disabled).toBe(true);
    expect(getNavItemActivityState('dungeons', flags).reasonKey).toBe('finishTrainingFirst');
    expect(getNavItemActivityState('store', flags).disabled).toBe(false);
  });

  it('activityFlagsFromUser reads mission from DTO', () => {
    expect(
      activityFlagsFromUser({
        mission: { id: 1 },
        startTime: '',
      })
    ).toEqual({ isInMission: true, isInWork: false, isInTraining: false });
  });

  it('getActivityBlockRedirect when on works during mission, not on statek', () => {
    const ca = { mission: { id: 1 }, startTime: '' };
    expect(getActivityBlockRedirect('/game/works', ca)).toBe('/game/missions');
    expect(getActivityBlockRedirect('/game/dungeons', ca)).toBe('/game/missions');
    expect(getActivityBlockRedirect('/game/statek', ca)).toBeNull();
    expect(getActivityBlockRedirect('/game/missions', ca)).toBeNull();
  });

  it('getSafeRouteForActivity', () => {
    expect(
      getSafeRouteForActivity({ isInMission: true, isInWork: false, isInTraining: false })
    ).toBe('/game/missions');
    expect(
      getSafeRouteForActivity({ isInMission: false, isInWork: true, isInTraining: false })
    ).toBe('/game/works');
  });
});
