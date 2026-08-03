import type { ComponentProps } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import pl from '@/locales/pl/translation.json';
import { ShipNotificationsFeed } from '@/features/game/notifications/ShipNotificationsFeed';
import type { ShipNotificationFeedRow } from '@/features/game/notifications/mapNotificationsToShipFeedRows';

const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function renderFeed(
  props: Partial<ComponentProps<typeof ShipNotificationsFeed>> & {
    rows?: ShipNotificationFeedRow[];
  } = {}
) {
  const { rows = [], loading = false, error = null, ...rest } = props;
  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <ShipNotificationsFeed rows={rows} loading={loading} error={error} {...rest} />
      </I18nextProvider>
    </MemoryRouter>
  );
}

describe('ShipNotificationsFeed', () => {
  beforeEach(async () => {
    navigateMock.mockClear();
    await i18n.changeLanguage('pl');
  });

  it('shows loading skeleton', () => {
    renderFeed({ loading: true, rows: [] });
    expect(screen.getByRole('status', { name: pl.loadingNotifications })).toBeInTheDocument();
  });

  it('shows empty state when not loading and no rows', () => {
    renderFeed({ loading: false, rows: [] });
    expect(screen.getByText(pl.notificationsPage.emptyTitle)).toBeInTheDocument();
    expect(screen.getByText(pl.notificationsPage.emptyHint)).toBeInTheDocument();
  });

  it('shows error alert', () => {
    renderFeed({ error: 'Sieć niedostępna', rows: [] });
    expect(screen.getByRole('alert')).toHaveTextContent('Sieć niedostępna');
  });

  it('renders invite row and navigates to ship from ship link', () => {
    const rows: ShipNotificationFeedRow[] = [
      {
        id: '1',
        uiKind: 'ship_invite',
        shipId: '99',
        shipName: 'Test Ship',
        playerName: 'Alice',
        playerLevel: 5,
        message: 'Zaproszenie.',
        relativeLabel: 'wczoraj',
        isRead: false,
        isActionable: true,
        showPreview: true,
        primaryAction: { label: 'Dołącz', onClick: vi.fn() },
        secondaryAction: { label: 'Odrzuć', onClick: vi.fn() },
      },
    ];

    renderFeed({ rows });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Zaproszenie.')).toBeInTheDocument();
    expect(screen.getByText(pl.notificationsPage.badgeInvite)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Test Ship' }));
    expect(navigateMock).toHaveBeenCalledWith('/game/ship/99');

    fireEvent.click(screen.getByRole('button', { name: pl.notificationsPage.preview }));
    expect(navigateMock).toHaveBeenCalledWith('/game/ship/99');
  });

  it('invokes primary and secondary actions', () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    const rows: ShipNotificationFeedRow[] = [
      {
        id: '2',
        uiKind: 'ship_request',
        shipId: '1',
        shipName: pl.notificationsPage.yourShip,
        playerName: 'Bob',
        playerLevel: 2,
        message: 'Prośba.',
        relativeLabel: '',
        isRead: false,
        isActionable: true,
        showPreview: false,
        primaryAction: { label: 'Akceptuj', onClick: onPrimary },
        secondaryAction: { label: 'Odrzuć', onClick: onSecondary },
      },
    ];

    renderFeed({ rows });

    fireEvent.click(screen.getByRole('button', { name: 'Akceptuj' }));
    fireEvent.click(screen.getByRole('button', { name: 'Odrzuć' }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('join request navigates to user profile from name and preview button', () => {
    const rows: ShipNotificationFeedRow[] = [
      {
        id: 'jr',
        uiKind: 'ship_request',
        shipId: 'club-1',
        shipName: pl.notificationsPage.yourShip,
        playerName: 'test_pirat',
        playerLevel: 1,
        message: 'Chce dołączyć.',
        relativeLabel: '17 sekund temu',
        isRead: false,
        isActionable: true,
        showPreview: true,
        previewUserId: 'pirate-99',
        primaryAction: { label: 'Akceptuj', onClick: vi.fn() },
        secondaryAction: { label: 'Odrzuć', onClick: vi.fn() },
      },
    ];

    renderFeed({ rows });

    expect(screen.queryByRole('button', { name: pl.notificationsPage.yourShip })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'test_pirat' }));
    expect(navigateMock).toHaveBeenLastCalledWith('/game/user/pirate-99');

    fireEvent.click(screen.getByRole('button', { name: pl.notificationsPage.previewPlayer }));
    expect(navigateMock).toHaveBeenLastCalledWith('/game/user/pirate-99');
  });

  it('shows decision badge instead of actions when decision is set', () => {
    const rows: ShipNotificationFeedRow[] = [
      {
        id: '3',
        uiKind: 'ship_invite',
        shipId: '1',
        shipName: 'S',
        playerName: 'C',
        playerLevel: 1,
        message: 'm',
        relativeLabel: '',
        isRead: false,
        isActionable: true,
        decision: 'accepted',
        showPreview: true,
        primaryAction: { label: 'Dołącz', onClick: vi.fn() },
      },
    ];

    renderFeed({ rows });
    expect(screen.getByText(pl.notificationsPage.decisionJoined)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dołącz' })).not.toBeInTheDocument();
  });
});
