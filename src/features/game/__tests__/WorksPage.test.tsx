import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WorksPage from '@/features/game/WorksPage';

const usePageMetaMock = vi.fn();

const FIVE_WORKS_FROM_API = [
  { id: '1', title: 'work.kitchen_helper', hoursCount: 2, baseGold: 12 },
  { id: '2', title: 'work.warehouse_loader', hoursCount: 4, baseGold: 11 },
  { id: '3', title: 'work.car_wash_attendant', hoursCount: 3, baseGold: 13 },
  { id: '4', title: 'work.port_dockhand', hoursCount: 5, baseGold: 10 },
  { id: '5', title: 'work.tavern_server', hoursCount: 6, baseGold: 9 },
] as const;

const userHolder: {
  user: {
    id: string;
    level: { name: string; expToNextLevel: number };
    gold: number;
    works?: { id: string; title: string; hoursCount: number; baseGold: number }[];
    currentActivity?: { startTime: string; work: Record<string, unknown> } | null;
  };
} = {
  user: {
    id: 'u1',
    level: { name: '2', expToNextLevel: 400 },
    gold: 100,
    works: [...FIVE_WORKS_FROM_API],
    currentActivity: null,
  },
};

const updateUserMock = vi.hoisted(() =>
  vi.fn(async (patch: Record<string, unknown>) => {
    userHolder.user = { ...userHolder.user, ...patch } as typeof userHolder.user;
  })
);

const workServiceMocks = vi.hoisted(() => ({
  requestStartWork: vi.fn(() => Promise.resolve({ success: true as const })),
  requestCancelWork: vi.fn(() => Promise.resolve({ success: true as const })),
  requestCompleteWork: vi.fn(() => Promise.resolve({ earnedGold: 42, works: [] })),
}));

const fetchUserDataMock = vi.hoisted(() => vi.fn(() => Promise.resolve(undefined)));

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: (...args: unknown[]) => usePageMetaMock(...args),
}));

vi.mock('@/services/workService', () => workServiceMocks);

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: userHolder.user,
    updateUser: updateUserMock,
    fetchUserData: fetchUserDataMock,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) => {
      const map: Record<string, string> = {
        works: 'Prace',
        close: 'Zamknij',
        goldGenitive: 'złota',
        reward: 'Nagroda',
        bonus: 'Premia',
        apiRequestFailed: 'Błąd',
        noWorks: 'Brak prac',
        'worksPage.seoDescription': 'Opis SEO prac',
        'worksPage.availableWorks': 'Dostępne prace',
        'worksPage.startWork': 'Rozpocznij pracę',
        'worksPage.workInProgress': 'Praca w toku',
        'worksPage.workProgressLabel': 'Postęp',
        'worksPage.expectedRewardCaption': 'Wypłata po zakończeniu',
        'worksPage.cancelWork': 'Anuluj',
        'worksPage.cancelWorkAria': 'Anuluj pracę',
        'worksPage.cancelWorkTitle': 'Anulować?',
        'worksPage.cancelWorkBody': 'Ciało modału',
        'worksPage.cancelWorkConfirm': 'Tak',
        'worksPage.cancelWorkDismiss': 'Nie',
        'worksPage.workCompleted': 'Praca ukończona',
        'missionsPage.claimReward': 'Odbierz nagrodę',
        hours: `${opts?.count ?? 0}h`,
        'work.kitchen_helper': 'Kuchta na galerze',
        'work.warehouse_loader': 'Ładowacz ładowni',
        'work.car_wash_attendant': 'Szczotkarz pokładu',
        'work.port_dockhand': 'Dokarz przy kei',
        'work.tavern_server': 'Podawacz rumu w szynku',
      };
      return map[key] ?? key;
    },
  }),
}));

function renderWorksPage() {
  return render(
    <MemoryRouter>
      <WorksPage />
    </MemoryRouter>
  );
}

describe('WorksPage', () => {
  beforeEach(() => {
    userHolder.user = {
      id: 'u1',
      level: { name: '2', expToNextLevel: 400 },
      gold: 100,
      works: [...FIVE_WORKS_FROM_API],
      currentActivity: null,
    };
    usePageMetaMock.mockReset();
    workServiceMocks.requestStartWork.mockClear();
    fetchUserDataMock.mockClear();
    workServiceMocks.requestCancelWork.mockClear();
    workServiceMocks.requestCompleteWork.mockClear();
    updateUserMock.mockClear();
  });

  it('renders header, lists five jobs from API, and registers SEO', () => {
    renderWorksPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Prace' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Dostępne prace' })).toBeInTheDocument();
    expect(screen.getByText('Kuchta na galerze')).toBeInTheDocument();
    expect(screen.getByText('Podawacz rumu w szynku')).toBeInTheDocument();
    expect(usePageMetaMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Prace'),
        description: 'Opis SEO prac',
      })
    );
  });

  it('starts work via service when a job row is confirmed', async () => {
    renderWorksPage();
    const buttons = screen.getAllByRole('button', { name: 'Rozpocznij pracę' });
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons[0]);
    await act(async () => {
      await Promise.resolve();
    });
    expect(updateUserMock).toHaveBeenCalled();
    expect(workServiceMocks.requestStartWork).toHaveBeenCalled();
    expect(fetchUserDataMock).toHaveBeenCalled();
  });

  it('prefers API works list when provided', () => {
    userHolder.user.works = [
      {
        id: 'api-1',
        title: 'work.kitchen_helper',
        hoursCount: 1,
        baseGold: 20,
      },
    ];
    renderWorksPage();
    expect(screen.getAllByRole('button', { name: 'Rozpocznij pracę' })).toHaveLength(1);
  });
});
