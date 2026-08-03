import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import ShipPage from '@/features/game/ShipPage';
import pl from '@/locales/pl/translation.json';

const usePageMetaMock = vi.fn();

vi.mock('@/hooks/usePageMeta', () => ({
  usePageMeta: (...args: unknown[]) => usePageMetaMock(...args),
}));

const clubMock = vi.fn();
const battlesMock = vi.fn();

vi.mock('@/features/game/ship/useShip', () => ({
  useShip: (...args: unknown[]) => clubMock(...args),
}));

vi.mock('@/features/game/ship/useShipBattles', () => ({
  useShipBattles: (...args: unknown[]) => battlesMock(...args),
}));

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: { id: '1', username: 't', gold: 9999 },
    fetchUserData: vi.fn(),
    updateUser: vi.fn(),
    isLoading: false,
    isFetching: false,
    isError: false,
    setUser: vi.fn(),
  }),
}));

function defaultBattles() {
  return {
    opponents: [],
    fightHistory: [],
    loading: false,
    historyLoading: false,
    error: null,
    canStartFight: false,
    checkingCanStart: false,
    attackingOpponentId: null,
    fightFeedback: null,
    arenaReplay: null,
    clearArenaReplay: vi.fn(),
    clearFightFeedback: vi.fn(),
    refreshBattles: vi.fn(),
    startFight: vi.fn(),
  };
}

describe('ShipPage', () => {
  beforeEach(async () => {
    usePageMetaMock.mockReset();
    clubMock.mockReset();
    battlesMock.mockReset();
    battlesMock.mockImplementation(() => defaultBattles());
    await i18n.changeLanguage('pl');
  });

  it('shows loading state while ship payload is loading', () => {
    clubMock.mockReturnValue({
      ship: null,
      loading: true,
      actionLoading: false,
      hasShip: false,
      chatMessages: [],
      contributeGold: '',
      setContributeGold: vi.fn(),
      contributeDiamonds: '',
      setContributeDiamonds: vi.fn(),
      feedback: null,
      clearFeedback: vi.fn(),
      createShip: vi.fn(),
      upgradeShip: vi.fn(),
      handleContribute: vi.fn(),
      changeRole: vi.fn(),
      removeMember: vi.fn(),
      deleteShip: vi.fn(),
      leaveShip: vi.fn(),
      sendChatMessage: vi.fn(),
      handleInternalNotesChange: vi.fn(),
      handleDescriptionSave: vi.fn(),
      handleToggleRequiresInvitation: vi.fn(),
    });

    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ShipPage />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(pl.shipPage.shipLoading)).toBeInTheDocument();
  });

  it('renders no-ship view when user has no ship', () => {
    clubMock.mockReturnValue({
      ship: null,
      loading: false,
      actionLoading: false,
      hasShip: false,
      chatMessages: [],
      contributeGold: '',
      setContributeGold: vi.fn(),
      contributeDiamonds: '',
      setContributeDiamonds: vi.fn(),
      feedback: null,
      clearFeedback: vi.fn(),
      createShip: vi.fn(),
      upgradeShip: vi.fn(),
      handleContribute: vi.fn(),
      changeRole: vi.fn(),
      removeMember: vi.fn(),
      deleteShip: vi.fn(),
      leaveShip: vi.fn(),
      sendChatMessage: vi.fn(),
      handleInternalNotesChange: vi.fn(),
      handleDescriptionSave: vi.fn(),
      handleToggleRequiresInvitation: vi.fn(),
    });

    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ShipPage />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: pl.shipPage.title })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: pl.shipPage.buildShipButton })).toBeInTheDocument();
  });

  it('sets SEO metadata from translations', () => {
    clubMock.mockReturnValue({
      ship: null,
      loading: false,
      actionLoading: false,
      hasShip: false,
      chatMessages: [],
      contributeGold: '',
      setContributeGold: vi.fn(),
      contributeDiamonds: '',
      setContributeDiamonds: vi.fn(),
      feedback: null,
      clearFeedback: vi.fn(),
      createShip: vi.fn(),
      upgradeShip: vi.fn(),
      handleContribute: vi.fn(),
      changeRole: vi.fn(),
      removeMember: vi.fn(),
      deleteShip: vi.fn(),
      leaveShip: vi.fn(),
      sendChatMessage: vi.fn(),
      handleInternalNotesChange: vi.fn(),
      handleDescriptionSave: vi.fn(),
      handleToggleRequiresInvitation: vi.fn(),
    });

    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ShipPage />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(usePageMetaMock).toHaveBeenCalledWith({
      title: pl.shipPage.seoTitle,
      description: pl.shipPage.seoDescription,
      openGraph: true,
    });
  });
});
