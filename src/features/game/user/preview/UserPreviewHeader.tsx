import { useTranslation } from 'react-i18next';
import {
  GAME_PAGE_TITLE_GOLD,
  gamePagePlayerTypedHeadingClass,
} from '@/features/game/layout/gamePageTitleClasses';

export default function UserPreviewHeader({ userData }) {
  const { t } = useTranslation();

  if (!userData) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-yellow-400/20 flex items-center justify-center shadow-xl border-4 border-yellow-400/40">
        <span className={`text-5xl font-extrabold sm:text-6xl ${GAME_PAGE_TITLE_GOLD}`}>
          {userData.username.charAt(0).toUpperCase()}
        </span>
      </div>
      <h2 className={`mt-4 text-center ${gamePagePlayerTypedHeadingClass}`}>{userData.username}</h2>
      <span className="text-base sm:text-lg text-white/80 font-semibold mt-2">
        {t('level')}: <span className="text-yellow-300">{userData.level?.name || '-'}</span>
      </span>
      <span className="text-base sm:text-lg text-white/80 font-semibold mt-1">
        {t('famePoints')}: <span className="text-yellow-300">{userData.famePoints || 0}</span>
      </span>
    </div>
  );
}
