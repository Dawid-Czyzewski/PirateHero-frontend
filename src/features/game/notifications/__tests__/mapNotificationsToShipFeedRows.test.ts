import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import {
  mapNotificationsToShipFeedRows,
  type FormattedShipNotification,
} from '@/features/game/notifications/mapNotificationsToShipFeedRows';

describe('mapNotificationsToShipFeedRows', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
  });

  it('maps active ship invitation with actions', () => {
    const onAccept = vi.fn();
    const onDecline = vi.fn();
    const notifications: FormattedShipNotification[] = [
      {
        id: 'inv-1',
        type: 'ship_invitation',
        ship: { id: 'c42', title: 'Czarna Perła' },
        inviter: { username: 'Kapitan', level: 12 },
        content: 'Zapraszamy na pokład.',
        isActive: true,
        actions: [
          { label: 'Dołącz', primary: true, onClick: onAccept },
          { label: 'Odrzuć', primary: false, onClick: onDecline },
        ],
      },
    ];

    const rows = mapNotificationsToShipFeedRows(notifications, i18n.t.bind(i18n), 'pl');

    expect(rows).toHaveLength(1);
    const r = rows[0];
    expect(r.uiKind).toBe('ship_invite');
    expect(r.shipId).toBe('c42');
    expect(r.shipName).toBe('Czarna Perła');
    expect(r.playerName).toBe('Kapitan');
    expect(r.playerLevel).toBe(12);
    expect(r.message).toBe('Zapraszamy na pokład.');
    expect(r.isActionable).toBe(true);
    expect(r.showPreview).toBe(true);
    expect(r.primaryAction?.label).toBe('Dołącz');
    expect(r.secondaryAction?.label).toBe('Odrzuć');
    r.primaryAction?.onClick();
    r.secondaryAction?.onClick();
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDecline).toHaveBeenCalledTimes(1);
  });

  it('maps inactive invitation as non-actionable without preview', () => {
    const notifications: FormattedShipNotification[] = [
      {
        id: 'inv-2',
        type: 'ship_invitation',
        ship: { id: '1', title: 'S' },
        inviter: { username: 'A', level: '3' },
        content: 'x',
        isActive: false,
        actions: [{ label: 'Dołącz', primary: true, onClick: vi.fn() }],
      },
    ];

    const rows = mapNotificationsToShipFeedRows(notifications, i18n.t.bind(i18n), 'pl');
    expect(rows[0].isActionable).toBe(false);
    expect(rows[0].primaryAction).toBeUndefined();
    expect(rows[0].showPreview).toBe(false);
  });

  it('maps join request with previewUserId and showPreview when user has id', () => {
    const notifications: FormattedShipNotification[] = [
      {
        id: 'jr-1',
        type: 'join_request',
        user: { id: 'user-42', username: 'Jim', level: 7 },
        content: 'Prośba o dołączenie.',
        isActive: true,
        ship: { id: 'mine', title: '' },
        actions: [
          { label: 'Akceptuj', primary: true, onClick: vi.fn() },
          { label: 'Odrzuć', primary: false, onClick: vi.fn() },
        ],
      },
    ];

    const rows = mapNotificationsToShipFeedRows(notifications, i18n.t.bind(i18n), 'pl');
    expect(rows).toHaveLength(1);
    expect(rows[0].uiKind).toBe('ship_request');
    expect(rows[0].shipId).toBe('mine');
    expect(rows[0].shipName).toBe(i18n.t('notificationsPage.yourShip'));
    expect(rows[0].playerLevel).toBe(7);
    expect(rows[0].previewUserId).toBe('user-42');
    expect(rows[0].showPreview).toBe(true);
  });

  it('maps join request without preview when user id is missing', () => {
    const notifications: FormattedShipNotification[] = [
      {
        id: 'jr-2',
        type: 'join_request',
        user: { username: 'NoId', level: 1 },
        content: 'x',
        isActive: true,
        ship: { id: 'c1', title: 'Mój statek' },
        actions: [{ label: 'Akceptuj', primary: true, onClick: vi.fn() }],
      },
    ];
    const rows = mapNotificationsToShipFeedRows(notifications, i18n.t.bind(i18n), 'pl');
    expect(rows[0].previewUserId).toBeUndefined();
    expect(rows[0].showPreview).toBe(false);
  });

  it('maps removal_notification as ship_info without level badge', () => {
    const notifications: FormattedShipNotification[] = [
      {
        id: 'rm-1',
        type: 'removal_notification',
        ship: { id: 'c1', title: 'Statek' },
        remover: { username: 'Admin' },
        content: 'Wyrzucono.',
      },
    ];

    const rows = mapNotificationsToShipFeedRows(notifications, i18n.t.bind(i18n), 'pl');
    expect(rows).toHaveLength(1);
    expect(rows[0].uiKind).toBe('ship_info');
    expect(rows[0].playerName).toBe('Admin');
    expect(rows[0].playerLevel).toBe(0);
    expect(rows[0].isActionable).toBe(false);
  });

  it('maps ship_fight_notification and uses fightShip fallback name', () => {
    const notifications: FormattedShipNotification[] = [
      {
        id: 'f-1',
        type: 'ship_fight_notification',
        title: 'Walka',
        content: 'Opis walki.\n\nDruga część',
        attackerShip: { id: 'a1', title: 'A' },
      },
    ];

    const rows = mapNotificationsToShipFeedRows(notifications, i18n.t.bind(i18n), 'pl');
    expect(rows).toHaveLength(1);
    expect(rows[0].uiKind).toBe('ship_info');
    expect(rows[0].shipName).toBe('A');
    expect(rows[0].message).toBe('Opis walki.\n\nDruga część');
  });

  it('derives decision from status', () => {
    const base: FormattedShipNotification = {
      id: 'x',
      type: 'ship_invitation',
      ship: { id: '1', title: 'C' },
      inviter: { username: 'u', level: 1 },
      content: '',
      status: 'accepted',
      isActive: false,
    };

    expect(mapNotificationsToShipFeedRows([base], i18n.t.bind(i18n), 'pl')[0].decision).toBe('accepted');

    expect(
      mapNotificationsToShipFeedRows([{ ...base, status: 'rejected' }], i18n.t.bind(i18n), 'pl')[0].decision
    ).toBe('declined');

    expect(
      mapNotificationsToShipFeedRows([{ ...base, status: 'approved' }], i18n.t.bind(i18n), 'pl')[0].decision
    ).toBe('accepted');
  });

  it('ignores unknown notification types', () => {
    const notifications: FormattedShipNotification[] = [
      { id: 'u', type: 'other', content: '?' } as FormattedShipNotification,
    ];
    expect(mapNotificationsToShipFeedRows(notifications, i18n.t.bind(i18n), 'pl')).toHaveLength(0);
  });
});
