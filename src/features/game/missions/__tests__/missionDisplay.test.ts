import type { TFunction } from 'i18next';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  availableMissionToFrontendRow,
  formatMissionDurationLabel,
  mergeActiveMissionDtoWithUserMissions,
  missionDescriptionKey,
} from '@/features/game/missions/missionDisplay';
import { clearMissionStartBasesSnapshot } from '@/features/game/missions/missionStartBasesStorage';

const t = ((key: string, options?: { count?: number }) => {
  if (key === 'missionsPage.durationHoursShort') return `${options?.count} h`;
  if (key === 'missionsPage.durationMinutesShort') return `${options?.count} min`;
  if (key === 'mission.coast_patrol') return 'Coast Patrol';
  if (key === 'mission.coast_patrol_desc') return 'Sweep the shoreline.';
  return key;
}) as TFunction;

describe('missionDescriptionKey', () => {
  it('appends _desc to the title key', () => {
    expect(missionDescriptionKey('mission.coast_patrol')).toBe('mission.coast_patrol_desc');
  });
});

describe('availableMissionToFrontendRow', () => {
  it('passes through energy cost from DTO', () => {
    const row = availableMissionToFrontendRow(
      {
        id: 1,
        title: 'k',
        goldReward: 1,
        expReward: 1,
        durationInSeconds: 60,
        energyCost: 42,
      },
      t
    );
    expect(row.energy).toBe(42);
  });

  it('resolves title and description from i18n keys', () => {
    const row = availableMissionToFrontendRow(
      {
        id: 2,
        title: 'mission.coast_patrol',
        goldReward: 10,
        expReward: 50,
        durationInSeconds: 300,
        energyCost: 5,
      },
      t
    );
    expect(row.name).toBe('Coast Patrol');
    expect(row.description).toBe('Sweep the shoreline.');
  });
});

describe('mergeActiveMissionDtoWithUserMissions', () => {
  beforeEach(() => {
    clearMissionStartBasesSnapshot();
  });
  afterEach(() => {
    clearMissionStartBasesSnapshot();
  });

  it('prefers snapshot bases (moment startu) over stale activity payload when lista jest pusta', () => {
    sessionStorage.setItem(
      'famegame_mission_start_bases_v1',
      JSON.stringify({ id: '7', baseGoldReward: 15, baseExpReward: 91 })
    );
    const merged = mergeActiveMissionDtoWithUserMissions(
      {
        id: 7,
        title: 'm',
        baseGoldReward: 15,
        baseExpReward: 90,
        bonusPercent: 1,
        goldReward: 200,
        expReward: 200,
        durationInSeconds: 300,
        energyCost: 5,
      },
      []
    );
    expect(merged?.baseExpReward).toBe(91);
  });

  it('prefers base rewards from the missions list when ids match', () => {
    const merged = mergeActiveMissionDtoWithUserMissions(
      {
        id: 7,
        title: 'm',
        baseGoldReward: 15,
        baseExpReward: 90,
        bonusPercent: 1,
        goldReward: 200,
        expReward: 200,
        durationInSeconds: 300,
        energyCost: 5,
      },
      [
        {
          id: 7,
          title: 'm',
          baseGoldReward: 15,
          baseExpReward: 91,
          bonusPercent: 1,
          goldReward: 200,
          expReward: 200,
          durationInSeconds: 300,
          energyCost: 5,
        },
      ]
    );
    expect(merged?.baseExpReward).toBe(91);
  });
});

describe('formatMissionDurationLabel', () => {
  it('formats round hours and minutes from ladder durations', () => {
    expect(formatMissionDurationLabel(300, t)).toBe('5 min');
    expect(formatMissionDurationLabel(600, t)).toBe('10 min');
    expect(formatMissionDurationLabel(900, t)).toBe('15 min');
    expect(formatMissionDurationLabel(2100, t)).toBe('35 min');
    expect(formatMissionDurationLabel(3600, t)).toBe('1 h');
  });
});
