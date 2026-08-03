import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { useUserPreview } from './user/preview/hooks/useUserPreview';
import UserPreviewLoading from './user/preview/UserPreviewLoading';
import UserPreviewError from './user/preview/UserPreviewError';
import { CharacterPublicProfileView } from './user/preview/CharacterPublicProfileView';
import { UserPreviewShipAndSkillsBoostersPanel } from './user/preview/UserPreviewShipAndSkillsBoostersPanel';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import type { UserPreviewPageProps } from '@/features/game/gamePageTypes';

export default function UserPreviewPage({ userId, onBack: _onBack, onViewShip }: UserPreviewPageProps) {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();

  const {
    userData,
    loading,
    error,
    actionLoading,
    inviteError,
    inviteSuccess,
    isOwner,
    isMemberOfMyShip,
    hasInvitation,
    handleInviteMember,
    handleRemoveMember,
    handleCancelInvitation,
  } = useUserPreview(userId, user, updateUser, t);

  return (
    <section className="w-full space-y-6 text-left" aria-label={String(t('previewProfile'))}>
      <h1 className={gamePageTitleH1Class}>{t('previewProfile')}</h1>
      {loading ? <UserPreviewLoading /> : null}
      {error ? <UserPreviewError error={error} /> : null}
      {!loading && !error && userData ? (
        <>
          <CharacterPublicProfileView userData={userData} />
          <UserPreviewShipAndSkillsBoostersPanel
            userData={userData}
            currentUserId={user?.id}
            isOwner={isOwner}
            isMemberOfMyShip={isMemberOfMyShip}
            hasInvitation={hasInvitation}
            onViewShip={onViewShip}
            onInvite={handleInviteMember}
            onRemove={handleRemoveMember}
            onCancelInvitation={handleCancelInvitation}
            actionLoading={actionLoading}
            inviteError={inviteError}
            inviteSuccess={inviteSuccess}
          />
        </>
      ) : null}
    </section>
  );
}
