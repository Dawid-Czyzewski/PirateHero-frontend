import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MissionsPage from '@/features/game/MissionsPage';
import { SessionShopBoostersProvider } from '@/features/game/boosters/SessionShopBoostersContext';
import { renderWithProviders } from '@/test/renderWithProviders';
import { buildUseUserReturn, type UserTestDouble } from '@/test/useUserTestDouble';

const userTestDouble = vi.hoisted(
  (): UserTestDouble => ({
    user: null,
    setUser: vi.fn(),
    fetchUserData: vi.fn(async () => undefined),
    updateUser: vi.fn(async () => undefined),
  })
);

const missionApiMocks = vi.hoisted(() => ({
  startGameMission: vi.fn(() => Promise.resolve({ ok: true as const, data: true })),
  cancelGameMission: vi.fn(() => Promise.resolve({ ok: true as const, data: true })),
  completeGameMission: vi.fn(() =>
    Promise.resolve({
      ok: true as const,
      data: {
        earnedGold: 10,
        earnedExp: 20,
        missions: [],
        newLevel: { name: '2', expToNextLevel: 400 },
        unclaimedCount: 0,
      },
    })
  ),
}));

const energyRefillMocks = vi.hoisted(() => ({
  getEnergyRefillInfo: vi.fn(() =>
    Promise.resolve({
      success: true as const,
      data: {
        canRefill: true,
        refillsRemaining: 2,
        refillsUsed: 0,
        nextRefillCost: 10,
        currentEnergy: 12,
        maxEnergy: 15,
        hasActiveMission: false,
      },
    })
  ),
  refillEnergy: vi.fn(() =>
    Promise.resolve({
      success: true as const,
      data: {
        success: true,
        newEnergy: 15,
        newGold: 80,
        refillsUsed: 0,
        refillsRemaining: 2,
        cost: 10,
      },
    })
  ),
}));

const { baseMockUser } = vi.hoisted(() => {
  const base = {
    id: 'u1',
    username: 'test',
    experiencePoints: 0,
    diamonds: 0,
    gold: 90,
    energyPoints: 12,
    level: { name: '1', expToNextLevel: 400 },
    userCapacities: { energyPoints: 15 },
    userBoosters: [] as unknown[],
    missions: [
      {
        id: 1,
        title: 'mission.pirate_smugglers_cove',
        goldReward: 30,
        expReward: 80,
        durationInSeconds: 10,
        energyCost: 5,
      },
    ],
  };
  return {
    baseMockUser: base,
  };
});

const usePageMetaMock = vi.fn();

const updateUserMock = vi.hoisted(() =>
  vi.fn(async (patch: Record<string, unknown>) => {
    userTestDouble.user = { ...userTestDouble.user, ...patch } as typeof userTestDouble.user;
    return undefined;
  })
);

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: (...args: unknown[]) => usePageMetaMock(...args),
}));

vi.mock('@/services/refillService', () => ({
  getEnergyRefillInfo: energyRefillMocks.getEnergyRefillInfo,
  refillEnergy: energyRefillMocks.refillEnergy,
}));

vi.mock('@/services/missionService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/missionService')>();
  return {
    ...actual,
    startGameMission: missionApiMocks.startGameMission,
    cancelGameMission: missionApiMocks.cancelGameMission,
    completeGameMission: missionApiMocks.completeGameMission,
  };
});

vi.mock('@/hooks/useUser', () => ({
  useUser: () =>
    buildUseUserReturn(userTestDouble, {
      updateUser: updateUserMock,
    }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) => {
      const map: Record<string, string> = {
        missions: 'Misje',
        exp: 'PD',
        cancel: 'Anuluj',
        close: 'Zamknij',
        refill: 'Uzupełnij',
        gold: 'złoto',
        success: 'Sukces',
        energyRefilled: 'Energia uzupełniona',
        energyRefillInfoLoading: 'Ładowanie…',
        refillEnergyDescription: `Uzupełnij za ${
          opts && typeof opts === 'object' && 'cost' in opts ? Number((opts as { cost?: number }).cost ?? 0) : 0
        } złota`,
        refillsRemaining: 'Pozostałe',
        refillsUsed: 'Użyte',
        notEnoughGold: 'Za mało złota',
        refillEnergy: 'Uzupełnij energię',
        energyRefillNoRefillsTooltip: 'Brak uzupełnień do jutra',
        goldGenitive: 'złota',
        apiRequestFailed: 'Błąd API',
        noMissions: 'Brak misji',
        'missionsPage.seoDescription': 'Opis SEO misji',
        'missionsPage.availableMissions': 'Dostępne misje',
        'missionsPage.depart': 'Wyrusz',
        'missionsPage.energyUnit': 'energii',
        'missionsPage.completed': 'Ukończono!',
        'missionsPage.energyStatus': 'Energia',
        'missionsPage.missionInProgress': 'Misja w toku',
        'missionsPage.missionProgressLabel': 'Postęp misji',
        'missionsPage.cancelMission': 'Anuluj',
        'missionsPage.cancelMissionAria': 'Anuluj misję',
        'missionsPage.cancelMissionTitle': 'Anulować misję?',
        'missionsPage.cancelMissionBody': 'Energia zostanie zwrócona.',
        'missionsPage.cancelMissionConfirm': 'Tak, anuluj',
        'missionsPage.cancelMissionDismiss': 'Nie',
        'missionsPage.notEnoughEnergy': 'Za mało energii',
        'missionsPage.missionCompleted': 'Misja ukończona!',
        'missionsPage.claimReward': 'Odbierz nagrodę',
        'missionsPage.durationMinutesShort': `${opts?.count ?? 0} min`,
        'missionsPage.durationHoursShort': `${opts?.count ?? 0} h`,
        'mission.pirate_smugglers_cove': 'Misja testowa API',
        energyFull: 'Energia pełna',
        finishMissionFirst: 'Najpierw misja',
        'levelUpModal.title': 'NOWY POZIOM!',
        'levelUpModal.congrats': 'Gratulacje!',
        'levelUpModal.rewardLabel': 'NAGRODA',
        'levelUpModal.rewardDescription': 'Punktów',
        'levelUpModal.distributePoints': 'ROZDZIEL PUNKTY',
      };
      return map[key] ?? key;
    },
  }),
}));

function renderMissionsPage(
  props: { goBack?: () => void; onQuestsUpdated?: (n?: number) => Promise<void> } = {}
) {
  return renderWithProviders(
    <SessionShopBoostersProvider>
      <MissionsPage
        goBack={props.goBack ?? vi.fn()}
        onQuestsUpdated={props.onQuestsUpdated ?? (async () => {})}
      />
    </SessionShopBoostersProvider>,
    { withRouter: true }
  );
}

describe('MissionsPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00.000Z'));
    userTestDouble.user = { ...baseMockUser };
    userTestDouble.fetchUserData.mockResolvedValue(undefined);
    usePageMetaMock.mockReset();
    userTestDouble.setUser.mockReset();
    missionApiMocks.startGameMission.mockClear();
    missionApiMocks.cancelGameMission.mockClear();
    missionApiMocks.completeGameMission.mockClear();
    updateUserMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders missions from API and sets SEO metadata', () => {
    renderMissionsPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Misje' })).toBeInTheDocument();
    expect(screen.getByText('Misja testowa API')).toBeInTheDocument();
    expect(usePageMetaMock).toHaveBeenCalled();
  });

  it('starts mission via API and refreshes profile', async () => {
    renderMissionsPage();
    fireEvent.click(screen.getAllByRole('button', { name: 'Wyrusz' })[0]);
    await act(async () => {
      await Promise.resolve();
    });
    expect(missionApiMocks.startGameMission).toHaveBeenCalledWith(1);
    expect(userTestDouble.fetchUserData).toHaveBeenCalled();
  });

  it('claims completed mission via API', async () => {
    vi.useRealTimers();
    const onQuestsUpdated = vi.fn(async () => {});
    const mission = baseMockUser.missions[0];
    userTestDouble.user = {
      ...baseMockUser,
      currentActivity: {
        startTime: new Date('2026-01-15T11:59:40.000Z').toISOString(),
        mission,
      },
    } as typeof baseMockUser & {
      currentActivity: { startTime: string; mission: (typeof baseMockUser.missions)[0] };
    };

    renderMissionsPage({ onQuestsUpdated });
    expect(screen.getByText('Misja ukończona!')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Odbierz nagrodę' }));

    await waitFor(() => {
      expect(missionApiMocks.completeGameMission).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(userTestDouble.fetchUserData).toHaveBeenCalled();
    });
    expect(onQuestsUpdated).toHaveBeenCalledWith(0);
  });
});
