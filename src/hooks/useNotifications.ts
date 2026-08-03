import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { queryKeys } from '@/lib/query/queryKeys';
import { fetchShipNotificationsBundle } from '@/services/fetchShipNotificationsBundle';
import {
  acceptInvitation,
  declineInvitation,
  approveJoinRequest,
  rejectJoinRequest,
  markInvitationAsRead,
  markJoinRequestAsRead,
  markRemovalNotificationAsRead,
  markFightNotificationAsRead,
} from '@/services/notificationsService';
import { buildShipNotificationsList } from '@/features/game/notifications/buildShipNotificationsList';

type FormattedNotification = {
  id: string;
  isRead?: boolean;
  type?: string;
  invitationId?: string | number;
  requestId?: string | number;
  notificationId?: string | number;
  [key: string]: unknown;
};

export default function useNotifications(
  onViewShip: unknown,
  onNavigateToShip: ((shipId: string) => void) | undefined,
  onNotificationsRead: (() => void) | undefined
) {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const markedAsReadRef = useRef(new Set<string>());

  const {
    data: bundle,
    isPending,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.shipNotifications(),
    queryFn: fetchShipNotificationsBundle,
    staleTime: 30_000,
  });

  const reloadNotifications = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleAcceptInvitation = useCallback(
    async (invitationId: string | number, _shipId?: string | number) => {
      setActionError(null);
      try {
        const result = await acceptInvitation(invitationId);
        if (updateUser) {
          void updateUser({});
        }
        if (onNavigateToShip && result.shipId) {
          onNavigateToShip(String(result.shipId));
        }
        await reloadNotifications();
      } catch (err) {
        console.error('Error accepting invitation:', err);
        const msg = err instanceof Error ? err.message : String(err);
        setActionError(msg);
        toast.error(msg);
        await reloadNotifications();
      }
    },
    [updateUser, onNavigateToShip, reloadNotifications]
  );

  const handleDeclineInvitation = useCallback(
    async (invitationId: string | number) => {
      setActionError(null);
      try {
        await declineInvitation(invitationId);
        await reloadNotifications();
      } catch (err) {
        console.error('Error declining invitation:', err);
        const msg = err instanceof Error ? err.message : String(err);
        setActionError(msg);
        toast.error(msg);
        await reloadNotifications();
      }
    },
    [reloadNotifications]
  );

  const handleApproveJoinRequest = useCallback(
    async (requestId: string | number) => {
      setActionError(null);
      try {
        await approveJoinRequest(requestId);
        if (updateUser) {
          void updateUser({});
        }
        await reloadNotifications();
      } catch (err) {
        console.error('Error approving join request:', err);
        const msg = err instanceof Error ? err.message : String(err);
        setActionError(msg);
        toast.error(msg);
        await reloadNotifications();
      }
    },
    [updateUser, reloadNotifications]
  );

  const handleRejectJoinRequest = useCallback(
    async (requestId: string | number) => {
      setActionError(null);
      try {
        await rejectJoinRequest(requestId);
        await reloadNotifications();
      } catch (err) {
        console.error('Error rejecting join request:', err);
        const msg = err instanceof Error ? err.message : String(err);
        setActionError(msg);
        toast.error(msg);
        await reloadNotifications();
      }
    },
    [reloadNotifications]
  );

  const notifications = useMemo(() => {
    if (!bundle) {
      return [] as FormattedNotification[];
    }
    return buildShipNotificationsList(bundle, t, {
      onAcceptInvitation: handleAcceptInvitation,
      onDeclineInvitation: handleDeclineInvitation,
      onApproveJoinRequest: handleApproveJoinRequest,
      onRejectJoinRequest: handleRejectJoinRequest,
    }) as FormattedNotification[];
  }, [
    bundle,
    t,
    handleAcceptInvitation,
    handleDeclineInvitation,
    handleApproveJoinRequest,
    handleRejectJoinRequest,
  ]);

  useEffect(() => {
    markedAsReadRef.current.clear();
    for (const n of notifications) {
      if (n.isRead) {
        markedAsReadRef.current.add(n.id);
      }
    }

    setSelectedNotificationId((prevId) => {
      if (notifications.length === 0) {
        return null;
      }
      if (prevId && notifications.some((n) => n.id === prevId)) {
        return prevId;
      }
      return notifications[0]?.id ?? null;
    });
  }, [notifications]);

  const handleSelectNotification = useCallback(
    async (notificationId: string) => {
      setSelectedNotificationId(notificationId);

      const notification = notifications.find((n) => n.id === notificationId);
      if (!notification || notification.isRead || markedAsReadRef.current.has(notificationId)) {
        return;
      }

      markedAsReadRef.current.add(notificationId);

      try {
        if (notification.type === 'ship_invitation' && notification.invitationId) {
          await markInvitationAsRead(notification.invitationId);
        } else if (notification.type === 'join_request' && notification.requestId) {
          await markJoinRequestAsRead(notification.requestId);
        } else if (notification.type === 'removal_notification' && notification.notificationId) {
          await markRemovalNotificationAsRead(notification.notificationId);
        } else if (notification.type === 'ship_fight_notification' && notification.notificationId) {
          await markFightNotificationAsRead(notification.notificationId);
        }

        if (onNotificationsRead) {
          onNotificationsRead();
        }
        await reloadNotifications();
      } catch {
        markedAsReadRef.current.delete(notificationId);
      }
    },
    [notifications, onNotificationsRead, reloadNotifications]
  );

  const errorMessage =
    actionError ??
    (isError
      ? queryError instanceof Error
        ? queryError.message
        : 'Failed to load notifications'
      : null);

  return {
    notifications,
    loading: isPending && !bundle,
    error: errorMessage,
    selectedNotificationId,
    handleSelectNotification,
    handleAcceptInvitation,
    handleDeclineInvitation,
    handleApproveJoinRequest,
    handleRejectJoinRequest,
    loadShipNotifications: reloadNotifications,
  };
}
