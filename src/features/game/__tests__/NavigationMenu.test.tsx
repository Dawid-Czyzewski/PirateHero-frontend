import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import NavigationMenu from '@/features/game/NavigationMenu';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) =>
      ({
        menu: 'Menu',
        missions: 'Missions',
        questTasks: 'Quests',
        works: 'Works',
        training: 'Training',
        character: 'Character',
        store: 'Store',
        fights: 'Fights',
        dungeons: 'Lochy',
        boosters: 'Boosters',
        coupons: 'Coupons',
        rzutMoneta: 'Coin toss',
        notifications: 'Notif',
        statek: 'Ship',
        ranking: 'Ranking',
        finishWorkFirst: 'Finish work',
        finishTrainingFirst: 'Finish training',
        finishMissionFirst: 'Finish mission',
      })[k] ?? k,
  }),
}));

function GameLayout() {
  return (
    <div>
      <NavigationMenu unclaimedRewardsCount={0} unreadNotificationsCount={0} />
      <Outlet />
    </div>
  );
}

describe('NavigationMenu', () => {
  it('renders menu title and missions button', () => {
    render(
      <MemoryRouter initialEntries={['/game/character']}>
        <Routes>
          <Route path="/game" element={<GameLayout />}>
            <Route path="character" element={<div>Character page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Missions' })).toBeInTheDocument();
  });

  it('navigates to /game/missions when Missions is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/game/character']}>
        <Routes>
          <Route path="/game" element={<GameLayout />}>
            <Route path="character" element={<div>Character page</div>} />
            <Route path="missions" element={<div>Missions page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Missions' }));
    expect(screen.getByText('Missions page')).toBeInTheDocument();
  });
});
