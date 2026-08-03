import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useNotifications from '@/hooks/useNotifications';
import { ShipNotificationsFeed } from '@/features/game/notifications/ShipNotificationsFeed';
import {
  mapNotificationsToShipFeedRows,
  type FormattedShipNotification,
} from '@/features/game/notifications/mapNotificationsToShipFeedRows';

type Props = {
  onViewShip?: (shipId: string) => void;
  onNavigateToShip?: (shipId: string) => void;
  onNotificationsRead?: () => void;
};

export default function NotificationsPage({
  onViewShip,
  onNavigateToShip,
  onNotificationsRead,
}: Props) {
  const { t, i18n } = useTranslation();

  const {
    notifications,
    loading,
    error,
    handleSelectNotification,
  } = useNotifications(onViewShip, onNavigateToShip, onNotificationsRead);

  const rows = useMemo(
    () =>
      mapNotificationsToShipFeedRows(
        notifications as FormattedShipNotification[],
        t,
        i18n.language
      ),
    [notifications, t, i18n.language]
  );

  return (
    <div className="-mx-3 w-[calc(100%+1.5rem)] min-w-0 px-3 md:-mx-4 md:w-[calc(100%+2rem)] md:px-4 xl:-mx-6 xl:w-[calc(100%+3rem)] xl:px-6">
      <ShipNotificationsFeed
        rows={rows}
        loading={loading}
        error={error}
        onRowHover={(rowId) => {
          const row = rows.find((r) => r.id === rowId);
          if (!row || row.isRead) {
            return;
          }
          void handleSelectNotification(rowId);
        }}
      />
    </div>
  );
}
