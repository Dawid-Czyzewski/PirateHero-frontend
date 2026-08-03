import { useTranslation } from 'react-i18next';
import { gamePagePlayerTypedBodyCaseClass } from '@/features/game/layout/gamePageTitleClasses';

export default function UserShipSection({
  userData,
  currentUserId,
  isOwner,
  isMemberOfMyShip,
  hasInvitation,
  onViewShip,
  onInvite,
  onRemove,
  onCancelInvitation,
  actionLoading,
  inviteError,
  inviteSuccess,
  embedded = false,
  suppressViewShipButton = false,
}) {
  const { t } = useTranslation();

  if (!userData) return null;

  const isOwnProfile = currentUserId && userData.id === currentUserId;

  if (userData.ship) {
    return (
      <div className={`flex flex-col gap-2 ${embedded ? 'items-stretch' : 'items-center mt-2'}`}>
        {!embedded ? (
          <span className="text-sm sm:text-base text-white/70">
            {t('statekLabel')}:{' '}
            <span className={`text-yellow-300 ${gamePagePlayerTypedBodyCaseClass}`}>{userData.ship.title}</span>
          </span>
        ) : null}
        {onViewShip && !suppressViewShipButton ? (
          <button
            type="button"
            onClick={() => onViewShip(userData.ship.id)}
            className="cursor-pointer rounded bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900 transition hover:bg-yellow-500 sm:text-sm"
          >
            {t('viewStatek')}
          </button>
        ) : null}
        {isOwner && isMemberOfMyShip && !isOwnProfile && (
          <div
            className={
              embedded
                ? 'mt-1 flex w-full flex-col gap-2 items-stretch'
                : 'mt-2 flex flex-col items-center gap-2'
            }
          >
            {inviteError && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 text-red-300 text-xs">
                {inviteError}
              </div>
            )}
            {inviteSuccess && (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-2 text-green-300 text-xs">
                {inviteSuccess}
              </div>
            )}
            <button
              onClick={onRemove}
              disabled={actionLoading}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                actionLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
              }`}
            >
              {actionLoading ? t('removing') : `❌ ${t('removeFromStatek')}`}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${embedded ? 'items-stretch' : 'items-center mt-2'}`}>
      {!embedded ? (
        <span className="text-sm sm:text-base text-gray-400">{t('noStatek')}</span>
      ) : null}
      {isOwner && !isOwnProfile && (
        <div className={`flex flex-col gap-2 ${embedded ? 'items-stretch' : 'items-center gap-2 mt-2'}`}>
          {inviteError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 text-red-300 text-xs">
              {inviteError}
            </div>
          )}
          {inviteSuccess && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-2 text-green-300 text-xs">
              {inviteSuccess}
            </div>
          )}
          {isMemberOfMyShip ? (
            <button
              onClick={onRemove}
              disabled={actionLoading}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                actionLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
              }`}
            >
              {actionLoading ? t('removing') : `❌ ${t('removeFromStatek')}`}
            </button>
          ) : hasInvitation ? (
            <button
              onClick={onCancelInvitation}
              disabled={actionLoading}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                actionLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
              }`}
            >
              {actionLoading ? t('cancelling') : `❌ ${t('cancelInvitation')}`}
            </button>
          ) : (
            <button
              onClick={onInvite}
              disabled={actionLoading}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                actionLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
              }`}
            >
              {actionLoading ? t('inviting') : `🤝 ${t('inviteToStatek')}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
