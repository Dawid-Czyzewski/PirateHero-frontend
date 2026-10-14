import { describe, expect, it } from 'vitest';
import {
  activityFlagsFromUser,
  getActivityBlockRedirect,
  getNavItemActivityState,
  getSafeRouteForActivity,
  pathnameToGameNavKey,
} from '@/features/game/navigation/gameNavActivityPolicy';

const idleFlags = {
  isInMission: false,
  isInWork: false,
  isInTraining: false,
  isInVoyage: false,
  isInTavernJob: false,
};

describe('gameNavActivityPolicy', () => {
  it('pathnameToGameNavKey parses /game segment', () => {
    expect(pathnameToGameNavKey('/game/statek')).toBe('statek');
    expect(pathnameToGameNavKey('/game/dungeons')).toBe('dungeons');
    expect(pathnameToGameNavKey('/game/rzut-moneta')).toBe('rzut-moneta');
    expect(pathnameToGameNavKey('/game/tavern')).toBe('tavern');
    expect(pathnameToGameNavKey('/game/companion')).toBe('companion');
    expect(pathnameToGameNavKey('/game/settings')).toBe('settings');
    expect(pathnameToGameNavKey('/game/user/x')).toBeNull();
    expect(pathnameToGameNavKey('/game/ship/y')).toBeNull();
  });

  it('getNavItemActivityState blocks work, training and dungeons during mission', () => {
    const flags = { ...idleFlags, isInMission: true };
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
    const flags = { ...idleFlags, isInWork: true };
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
    const flags = { ...idleFlags, isInTraining: true };
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
    ).toEqual({
      isInMission: true,
      isInWork: false,
      isInTraining: false,
      isInVoyage: false,
      isInTavernJob: false,
    });
  });

  it('activityFlagsFromUser reads tavernJob from DTO', () => {
    expect(
      activityFlagsFromUser({
        tavernJob: { id: 2, durationMinutes: 15 },
        startTime: '',
      })
    ).toEqual({
      isInMission: false,
      isInWork: false,
      isInTraining: false,
      isInVoyage: false,
      isInTavernJob: true,
    });
  });

  it('getNavItemActivityState blocks missions during voyage', () => {
    const flags = { ...idleFlags, isInVoyage: true };
    expect(getNavItemActivityState('statek', flags).disabled).toBe(false);
    expect(getNavItemActivityState('missions', flags).reasonKey).toBe('finishVoyageFirst');
    expect(getNavItemActivityState('dungeons', flags).reasonKey).toBe('finishVoyageFirst');
  });

  it('getNavItemActivityState blocks missions, works, training and dungeons during tavern job', () => {
    const flags = { ...idleFlags, isInTavernJob: true };
    expect(getNavItemActivityState('tavern', flags).disabled).toBe(false);
    expect(getNavItemActivityState('missions', flags).reasonKey).toBe('finishTavernJobFirst');
    expect(getNavItemActivityState('works', flags).reasonKey).toBe('finishTavernJobFirst');
    expect(getNavItemActivityState('training', flags).reasonKey).toBe('finishTavernJobFirst');
    expect(getNavItemActivityState('dungeons', flags).reasonKey).toBe('finishTavernJobFirst');
    expect(getNavItemActivityState('store', flags).disabled).toBe(false);
  });

  it('getActivityBlockRedirect when on works during mission, not on statek', () => {
    const ca = { mission: { id: 1 }, startTime: '' };
    expect(getActivityBlockRedirect('/game/works', ca)).toBe('/game/missions');
    expect(getActivityBlockRedirect('/game/dungeons', ca)).toBe('/game/missions');
    expect(getActivityBlockRedirect('/game/statek', ca)).toBeNull();
    expect(getActivityBlockRedirect('/game/missions', ca)).toBeNull();
  });

  it('getActivityBlockRedirect during tavern job', () => {
    const ca = { tavernJob: { id: 1 }, startTime: '' };
    expect(getActivityBlockRedirect('/game/missions', ca)).toBe('/game/tavern');
    expect(getActivityBlockRedirect('/game/works', ca)).toBe('/game/tavern');
    expect(getActivityBlockRedirect('/game/tavern', ca)).toBeNull();
  });

  it('getSafeRouteForActivity', () => {
    expect(getSafeRouteForActivity({ ...idleFlags, isInMission: true })).toBe('/game/missions');
    expect(getSafeRouteForActivity({ ...idleFlags, isInWork: true })).toBe('/game/works');
    expect(getSafeRouteForActivity({ ...idleFlags, isInVoyage: true })).toBe('/game/statek');
    expect(getSafeRouteForActivity({ ...idleFlags, isInTavernJob: true })).toBe('/game/tavern');
  });
});
