import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  activityFlagsFromUser,
  getNavItemActivityState,
  type GameNavKey,
} from '@/features/game/navigation/gameNavActivityPolicy';
import { gameViewFromPath } from '@/pages/game/gamePath';
import type { CurrentActivityDto } from '@/types/currentActivity';

export type NavigationMenuProps = {
  onAfterNavigate?: () => void;
  currentActivity?: CurrentActivityDto;
  unclaimedRewardsCount?: number;
  unreadNotificationsCount?: number;
};

type MenuKey = GameNavKey;

export default function NavigationMenu({
  onAfterNavigate,
  currentActivity,
  unclaimedRewardsCount = 0,
  unreadNotificationsCount = 0,
}: NavigationMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = gameViewFromPath(location.pathname);

  const activityFlags = activityFlagsFromUser(currentActivity);

  const getDisabledAndReason = (key: MenuKey) => {
    const { disabled, reasonKey } = getNavItemActivityState(key, activityFlags);
    const reason = disabled && reasonKey ? t(reasonKey) : undefined;
    return { disabled, reason };
  };

  const getMenuKeyForPage = (page: string) => {
    if (page === 'userPreview' || page === 'shipPreview') {
      return null;
    }
    return page;
  };

  const activeMenuKey = getMenuKeyForPage(currentPage);

  const menuItems: { key: MenuKey; label: string }[] = [
    { key: 'character', label: t('character') },
    { key: 'missions', label: t('missions') },
    { key: 'training', label: t('training') },
    { key: 'questTasks', label: t('questTasks') },
    { key: 'dailyChallenges', label: t('dailyChallenges') },
    { key: 'works', label: t('works') },
    { key: 'store', label: t('store') },
    { key: 'fights', label: t('fights') },
    { key: 'boosters', label: t('boosters') },
    { key: 'statek', label: t('statek') },
    { key: 'coupons', label: t('coupons') },
    { key: 'rzut-moneta', label: t('rzutMoneta') },
    { key: 'ranking', label: t('ranking') },
    { key: 'notifications', label: t('notifications') },
    { key: 'dungeons', label: t('dungeons') },
  ];

  const go = (key: MenuKey) => {
    navigate(`/game/${key}`);
    onAfterNavigate?.();
  };

  return (
    <div className="h-full w-full flex flex-col">
      <h2 className="text-xl font-black text-yellow-400 uppercase tracking-wider mb-4 px-2 flex-shrink-0">
        {t('menu')}
      </h2>
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {menuItems.map(({ key, label }) => {
          const { disabled, reason } = getDisabledAndReason(key);
          const showUnclaimedBadge = key === 'questTasks' && unclaimedRewardsCount > 0 && !disabled;
          const showNotificationsBadge = key === 'notifications' && unreadNotificationsCount > 0 && !disabled;

          return (
            <div key={key} className="relative">
              <button
                type="button"
                aria-label={disabled && reason ? `${label}. ${reason}` : label}
                aria-current={activeMenuKey === key ? 'page' : undefined}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={() => {
                  if (!disabled) go(key);
                }}
                className={`w-full px-3 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide cursor-pointer text-left transition-all
                  ${
                    disabled
                      ? 'opacity-50 cursor-not-allowed border-2 border-gray-600 bg-gray-700/50 text-gray-400'
                      : activeMenuKey === key
                        ? 'border-4 border-gray-800 bg-gray-600/80 text-gray-200 shadow-xl ring-2 ring-gray-700'
                        : 'border-2 border-yellow-400 bg-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-300 active:bg-yellow-600'
                  }`}
                style={
                  !disabled
                    ? {
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }
                    : {}
                }
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1 truncate">{label}</span>
                  {(showUnclaimedBadge || showNotificationsBadge) && (
                    <span className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-black text-white">
                      {showUnclaimedBadge ? unclaimedRewardsCount : unreadNotificationsCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
