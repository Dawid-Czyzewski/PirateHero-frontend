import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import RankingPage from '@/features/game/RankingPage';
import pl from '@/locales/pl/translation.json';

const { fetchPlayersRanking, fetchShipsRanking } = vi.hoisted(() => ({
  fetchPlayersRanking: vi.fn(),
  fetchShipsRanking: vi.fn(),
}));

vi.mock('@/services/rankingService', () => ({
  fetchPlayersRanking,
  fetchShipsRanking,
}));

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: { id: 'p1', username: 'SelfUser' },
    fetchUserData: vi.fn(),
    updateUser: vi.fn(),
    isLoading: false,
    isFetching: false,
    isError: false,
    setUser: vi.fn(),
  }),
}));

const playerPayload = {
  items: [
    {
      id: 'p1',
      username: 'SelfUser',
      famePoints: 120,
      experiencePoints: 0,
      level: { id: 1, name: '5' },
      ship: null,
    },
    {
      id: 'p2',
      username: 'Other',
      famePoints: 90,
      experiencePoints: 0,
      level: { id: 1, name: '4' },
      ship: null,
    },
  ],
  pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
};

const clubPayload = {
  items: [
    {
      id: 'c1',
      title: 'Morskie Wilki',
      totalFamePoints: 900,
      memberCount: 3,
      memberIds: ['p1'],
      requiresInvitation: false,
      maxMembers: 10,
      captainUsername: 'Kapitan',
    },
  ],
  pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
};

describe('RankingPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    fetchPlayersRanking.mockResolvedValue(playerPayload);
    fetchShipsRanking.mockResolvedValue(clubPayload);
    await i18n.changeLanguage('pl');
  });

  it('loads players ranking and highlights current user', async () => {
    const onViewProfile = vi.fn();
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <RankingPage onViewProfile={onViewProfile} onViewShip={vi.fn()} />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(await screen.findAllByText('SelfUser')).toHaveLength(2);

    expect(fetchPlayersRanking).toHaveBeenCalledWith(1, 20, 'famePoints', 'DESC', undefined);
    fireEvent.click(screen.getAllByText('SelfUser')[0]);
    expect(onViewProfile).toHaveBeenCalledWith('p1');
  });

  it('switches to ships tab and loads ships ranking', async () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <RankingPage onViewProfile={vi.fn()} onViewShip={vi.fn()} />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(await screen.findAllByText('SelfUser')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: new RegExp(String(pl.stateki), 'i') }));

    await waitFor(() => {
      expect(fetchShipsRanking).toHaveBeenCalledWith(1, 20, 'totalFamePoints', 'DESC', undefined);
    });

    expect((await screen.findAllByText('Morskie Wilki')).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Kapitan').length).toBeGreaterThanOrEqual(1);
  });

  it('searches players by nickname with debounce', async () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <RankingPage onViewProfile={vi.fn()} onViewShip={vi.fn()} />
        </I18nextProvider>
      </MemoryRouter>
    );

    await screen.findAllByText('SelfUser');

    const input = screen.getByPlaceholderText(String(pl.rankingPage.searchPlayerPlaceholder));
    fireEvent.change(input, { target: { value: 'Oth' } });

    await waitFor(
      () => {
        expect(fetchPlayersRanking).toHaveBeenCalledWith(1, 20, 'famePoints', 'DESC', 'Oth');
      },
      { timeout: 2000 }
    );
  });
});
