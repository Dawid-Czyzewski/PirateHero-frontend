import type { TFunction } from 'i18next';
import { formatNotificationRelativeTime } from '@/features/game/notifications/formatNotificationRelativeTime';

export type FormattedShipNotification = {
  id: string;
  type: string;
  isRead?: boolean;
  content?: string;
  title?: string;
  createdAt?: string;
  isActive?: boolean;
  status?: string;
  invitationId?: string | number;
  requestId?: string | number;
  ship?: { id?: string | number; title?: string };
  inviter?: { id?: string | number; username?: string; level?: string | number };
  user?: { id?: string | number; username?: string; level?: string | number };
  remover?: { username?: string };
  attackerShip?: { id?: string | number; title?: string };
  defenderShip?: { id?: string | number; title?: string };
  fightType?: string;
  actions?: Array<{ label: string; primary?: boolean; onClick: () => void; disabled?: boolean }>;
};

export type ShipNotificationFeedUiKind = 'ship_invite' | 'ship_request' | 'ship_info';

export type ShipNotificationFeedRow = {
  id: string;
  isRead: boolean;
  uiKind: ShipNotificationFeedUiKind;
  shipId: string;
  shipName: string;
  playerName: string;
  playerLevel: number;
  message: string;
  relativeLabel: string;
  isActionable: boolean;
  decision?: 'accepted' | 'declined';
  invitationId?: string | number;
  requestId?: string | number;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  showPreview: boolean;
  previewUserId?: string;
};

function parseLevel(raw: string | number | undefined): number {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  const n = Number.parseInt(String(raw ?? '1'), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function decisionFromStatus(status: string | undefined): 'accepted' | 'declined' | undefined {
  if (status === 'accepted' || status === 'approved') {
    return 'accepted';
  }
  if (status === 'declined' || status === 'rejected') {
    return 'declined';
  }
  return undefined;
}

function splitActions(n: FormattedShipNotification): {
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
} {
  const actions = n.actions ?? [];
  const primary = actions.find((a) => a.primary);
  const secondary = actions.find((a) => !a.primary);
  return {
    primary: primary
      ? { label: primary.label, onClick: primary.onClick }
      : undefined,
    secondary: secondary
      ? { label: secondary.label, onClick: secondary.onClick }
      : undefined,
  };
}

export function mapNotificationsToShipFeedRows(
  notifications: FormattedShipNotification[],
  t: TFunction,
  locale: string
): ShipNotificationFeedRow[] {
  const out: ShipNotificationFeedRow[] = [];

  for (const n of notifications) {
    const relativeLabel = formatNotificationRelativeTime(n.createdAt, locale);
    const decision = decisionFromStatus(n.status);
    const { primary, secondary } = splitActions(n);

    if (n.type === 'ship_invitation' && n.ship && n.inviter) {
      const isActionable = Boolean(n.isActive && n.actions?.length);
      out.push({
        id: n.id,
        isRead: Boolean(n.isRead),
        uiKind: 'ship_invite',
        shipId: String(n.ship.id ?? ''),
        shipName: String(n.ship.title ?? ''),
        playerName: String(n.inviter.username ?? ''),
        playerLevel: parseLevel(n.inviter.level),
        message: String(n.content ?? ''),
        relativeLabel,
        isActionable,
        decision,
        invitationId: n.invitationId,
        primaryAction: isActionable ? primary : undefined,
        secondaryAction: isActionable ? secondary : undefined,
        showPreview: isActionable,
      });
      continue;
    }

    if (n.type === 'join_request' && n.user) {
      const isActionable = Boolean(n.isActive && n.actions?.length);
      const shipId = n.ship?.id != null ? String(n.ship.id) : '';
      const shipName =
        n.ship?.title != null && String(n.ship.title).length > 0
          ? String(n.ship.title)
          : String(t('notificationsPage.yourShip'));
      const previewUserIdRaw = n.user.id;
      const previewUserId =
        previewUserIdRaw != null && String(previewUserIdRaw).length > 0
          ? String(previewUserIdRaw)
          : undefined;
      out.push({
        id: n.id,
        isRead: Boolean(n.isRead),
        uiKind: 'ship_request',
        shipId,
        shipName,
        playerName: String(n.user.username ?? ''),
        playerLevel: parseLevel(n.user.level),
        message: String(n.content ?? ''),
        relativeLabel,
        isActionable,
        decision,
        requestId: n.requestId,
        primaryAction: isActionable ? primary : undefined,
        secondaryAction: isActionable ? secondary : undefined,
        showPreview: isActionable && Boolean(previewUserId),
        previewUserId,
      });
      continue;
    }

    if (n.type === 'removal_notification' && n.ship) {
      out.push({
        id: n.id,
        isRead: Boolean(n.isRead),
        uiKind: 'ship_info',
        shipId: String(n.ship.id ?? ''),
        shipName: String(n.ship.title ?? ''),
        playerName: String(n.remover?.username ?? ''),
        playerLevel: 0,
        message: String(n.content ?? ''),
        relativeLabel,
        isActionable: false,
        showPreview: false,
      });
      continue;
    }

    if (n.type === 'ship_fight_notification') {
      const isAttacked = String(n.fightType ?? '').startsWith('attacked');
      const shipId =
        isAttacked
          ? n.attackerShip?.id != null
            ? String(n.attackerShip.id)
            : n.defenderShip?.id != null
              ? String(n.defenderShip.id)
              : ''
          : n.defenderShip?.id != null
            ? String(n.defenderShip.id)
            : n.attackerShip?.id != null
              ? String(n.attackerShip.id)
              : '';
      const shipName =
        isAttacked
          ? n.attackerShip?.title != null
            ? String(n.attackerShip.title)
            : n.defenderShip?.title != null
              ? String(n.defenderShip.title)
              : String(t('notificationsPage.fightShip'))
          : n.defenderShip?.title != null
            ? String(n.defenderShip.title)
            : n.attackerShip?.title != null
              ? String(n.attackerShip.title)
              : String(t('notificationsPage.fightShip'));
      out.push({
        id: n.id,
        isRead: Boolean(n.isRead),
        uiKind: 'ship_info',
        shipId,
        shipName,
        playerName: String(n.title ?? ''),
        playerLevel: 0,
        message: String(n.content ?? ''),
        relativeLabel,
        isActionable: false,
        showPreview: false,
      });
    }
  }

  return out;
}
