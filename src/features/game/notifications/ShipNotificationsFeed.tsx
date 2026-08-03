import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, Info, Mail, Ship, X } from 'lucide-react';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import type { ShipNotificationFeedRow } from '@/features/game/notifications/mapNotificationsToShipFeedRows';
import { NotificationsFeedSkeleton } from '@/features/game/notifications/NotificationsFeedSkeleton';
import { Button } from '@/features/game/ship/ShipUi';

type Props = {
  rows: ShipNotificationFeedRow[];
  loading: boolean;
  error: string | null;
  onRowHover?: (rowId: string) => void;
};

export function ShipNotificationsFeed({ rows, loading, error, onRowHover }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pendingCount = rows.filter((r) => r.isActionable).length;
  const [locallyReadIds, setLocallyReadIds] = useState<Record<string, true>>({});

  const markHoveredAsRead = useCallback(
    (rowId: string) => {
      setLocallyReadIds((prev) => (prev[rowId] ? prev : { ...prev, [rowId]: true }));
      onRowHover?.(rowId);
    },
    [onRowHover]
  );

  const goShip = (shipId: string) => {
    if (!shipId) {
      return;
    }
    navigate(`/game/ship/${encodeURIComponent(shipId)}`);
  };

  const goUser = (userId: string) => {
    if (!userId) {
      return;
    }
    navigate(`/game/user/${encodeURIComponent(userId)}`);
  };

  if (loading) {
    return <NotificationsFeedSkeleton />;
  }

  return (
    <section className="w-full min-w-0 space-y-6" aria-label={String(t('notifications'))}>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <h1 className={gamePageTitleH1Class}>{String(t('notifications'))}</h1>
        <span className="shrink-0 rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary">
          {String(t('notificationsPage.pendingBadge', { count: pendingCount }))}
        </span>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-lg border border-border bg-card/40 p-12 text-center">
          <p className="font-heading text-foreground/80">{String(t('notificationsPage.emptyTitle'))}</p>
          <p className="mt-1 text-xs text-muted-foreground">{String(t('notificationsPage.emptyHint'))}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((n) => {
            const isInvite = n.uiKind === 'ship_invite';
            const isJoinRequest = n.uiKind === 'ship_request';
            const joinPlayerPreview = isJoinRequest && Boolean(n.previewUserId);
            const Icon = isInvite ? Mail : isJoinRequest ? Ship : Info;
            const isRead = n.isRead || Boolean(locallyReadIds[n.id]);
            return (
              <div
                key={n.id}
                onMouseEnter={() => markHoveredAsRead(n.id)}
                className={`rounded-lg border bg-gradient-to-r from-card/60 to-card/30 p-4 transition-colors ${
                  isRead
                    ? `border-border/60 ${n.decision ? 'opacity-75' : 'hover:border-primary/35'}`
                    : 'border-primary/50 bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.25)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${
                      isInvite
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : n.uiKind === 'ship_request'
                          ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                          : 'border-muted-foreground/25 bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {joinPlayerPreview && n.previewUserId ? (
                        <button
                          type="button"
                          onClick={() => goUser(n.previewUserId!)}
                          className="cursor-pointer font-heading text-left text-sm font-bold text-foreground hover:text-primary hover:underline"
                        >
                          {n.playerName}
                        </button>
                      ) : (
                        <span className="font-heading text-sm font-bold text-foreground">{n.playerName}</span>
                      )}
                      {n.playerLevel > 0 ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">
                          {String(t('notificationsPage.levelShort', { level: n.playerLevel }))}
                        </span>
                      ) : null}
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${
                          isInvite
                            ? 'border-primary/40 text-primary'
                            : n.uiKind === 'ship_request'
                              ? 'border-blue-400/40 text-blue-300'
                              : 'border-border text-muted-foreground'
                        }`}
                      >
                        {isInvite
                          ? String(t('notificationsPage.badgeInvite'))
                          : n.uiKind === 'ship_request'
                            ? String(t('notificationsPage.badgeRequest'))
                            : String(t('notificationsPage.badgeInfo'))}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-line text-left text-sm text-foreground/85">{n.message}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      {joinPlayerPreview ? null : (
                        <span>
                          {String(t('notificationsPage.shipLabel'))}{' '}
                          {n.shipId ? (
                            <button
                              type="button"
                              onClick={() => goShip(n.shipId)}
                              className="cursor-pointer font-medium text-primary hover:underline"
                            >
                              {n.shipName}
                            </button>
                          ) : (
                            <span className="font-medium text-foreground/80">{n.shipName}</span>
                          )}
                        </span>
                      )}
                      {n.relativeLabel ? (
                        <span className="text-muted-foreground/70">
                          {joinPlayerPreview ? '' : '• '}
                          {n.relativeLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {n.decision ? (
                      <span
                        className={`inline-flex h-8 items-center rounded-md border px-3 font-heading text-xs ${
                          n.decision === 'accepted'
                            ? 'border-green-500/40 bg-green-500/10 text-green-400'
                            : 'border-red-500/40 bg-red-500/10 text-red-400'
                        }`}
                      >
                        {n.decision === 'accepted' ? (
                          <>
                            <Check className="mr-1 h-3.5 w-3.5" aria-hidden />
                            {isInvite
                              ? String(t('notificationsPage.decisionJoined'))
                              : String(t('notificationsPage.decisionAccepted'))}
                          </>
                        ) : (
                          <>
                            <X className="mr-1 h-3.5 w-3.5" aria-hidden />
                            {String(t('notificationsPage.decisionDeclined'))}
                          </>
                        )}
                      </span>
                    ) : n.isActionable ? (
                      <>
                        {n.primaryAction ? (
                          <Button
                            size="sm"
                            onClick={() => void n.primaryAction?.onClick()}
                            className="h-8 bg-green-600 text-white hover:bg-green-500"
                          >
                            <Check className="mr-1 h-3.5 w-3.5" aria-hidden />
                            {n.primaryAction.label}
                          </Button>
                        ) : null}
                        {n.secondaryAction ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void n.secondaryAction?.onClick()}
                            className="h-8 border-red-500/35 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <X className="mr-1 h-3.5 w-3.5" aria-hidden />
                            {n.secondaryAction.label}
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                    {n.showPreview && n.previewUserId ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => goUser(n.previewUserId)}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="mr-1 h-3 w-3" aria-hidden />
                        {String(t('notificationsPage.previewPlayer'))}
                      </Button>
                    ) : n.showPreview && n.shipId ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => goShip(n.shipId)}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="mr-1 h-3 w-3" aria-hidden />
                        {String(t('notificationsPage.preview'))}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
