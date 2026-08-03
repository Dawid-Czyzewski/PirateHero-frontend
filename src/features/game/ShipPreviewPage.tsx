import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { useShipPreview } from './ship/preview/hooks/useShipPreview';
import ShipJoinButton from './ship/preview/ShipJoinButton';
import ShipJoinRequestButton from './ship/preview/ShipJoinRequestButton';
import ShipPreviewLoading from './ship/preview/ShipPreviewLoading';
import ShipPreviewError from './ship/preview/ShipPreviewError';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import type { ShipPreviewPageProps } from '@/features/game/gamePageTypes';
import { ShipPublicPreviewView } from '@/features/game/ship/ShipPublicPreviewView';
import { mapShipPreviewToPublicShipData } from '@/features/game/ship/mapShipPreviewToPublicShipData';
import { buildPublicShipPreviewTabs } from '@/features/game/ship/buildShipTabs';
import type { ShipTab } from '@/features/game/ship/shipTypes';

export default function ShipPreviewPage({
  shipId,
  onBack: _onBack,
  onViewProfile,
  onNavigateToShip,
  onJoinRequestCancelled,
}: ShipPreviewPageProps) {
  const { t } = useTranslation();
  const { user, updateUser, fetchUserData } = useUser();
  const [tab, setTab] = useState<ShipTab>('crew');

  const {
    clubData,
    loading,
    error,
    actionLoading,
    joinError,
    joinSuccess,
    canJoin,
    handleJoinShip,
    handleCancelJoinRequest,
  } = useShipPreview(shipId, user, updateUser, fetchUserData, t, onNavigateToShip, onJoinRequestCancelled);

  const previewTabs = useMemo(() => buildPublicShipPreviewTabs(t), [t]);
  const publicShip = useMemo(
    () => (clubData ? mapShipPreviewToPublicShipData(clubData, user?.id) : null),
    [clubData, user?.id]
  );

  const viewerOnThisShip = Boolean(
    user?.id && clubData?.members?.some((m) => String(m.user?.id) === String(user.id))
  );
  const userHasOtherCrew = Boolean(
    user?.ship &&
      typeof user.ship === 'object' &&
      (user.ship as { hasShip?: boolean }).hasShip === true
  );
  const joinRequestBlockedByOtherCrew = userHasOtherCrew && !viewerOnThisShip;
  const showJoinPanel = Boolean(
    clubData &&
      !viewerOnThisShip &&
      !clubData.isOwner &&
      (canJoin || clubData.requiresInvitation || clubData.hasPendingRequest)
  );

  const showJoinRequestUi = Boolean(clubData?.requiresInvitation || clubData?.hasPendingRequest);

  const crewJoinActions: ReactNode =
    showJoinPanel && clubData ? (
      <div className="flex flex-col items-start gap-2">
        {canJoin && !clubData.hasPendingRequest ? (
          <ShipJoinButton onJoin={handleJoinShip} loading={actionLoading} error={joinError} />
        ) : null}
        {showJoinRequestUi ? (
          <ShipJoinRequestButton
            hasPendingRequest={clubData.hasPendingRequest}
            isOwner={clubData.isOwner || false}
            isFull={clubData.isFull || false}
            blockedByOtherCrew={joinRequestBlockedByOtherCrew}
            onSendRequest={handleJoinShip}
            onCancelRequest={handleCancelJoinRequest}
            loading={actionLoading}
            error={joinError}
            success={joinSuccess}
          />
        ) : null}
      </div>
    ) : null;

  return (
    <section className="w-full space-y-6 text-left" aria-label={String(t('previewStatek'))}>
      <h1 className={gamePageTitleH1Class}>{t('previewStatek')}</h1>
        {loading ? <ShipPreviewLoading /> : null}
        {error ? <ShipPreviewError error={error} /> : null}
        {!loading && !error && clubData && publicShip ? (
          <ShipPublicPreviewView
            ship={publicShip}
            tab={tab}
            tabs={previewTabs}
            setTab={setTab}
            onViewProfile={onViewProfile}
            crewJoinActions={crewJoinActions}
          />
        ) : null}
    </section>
  );
}
