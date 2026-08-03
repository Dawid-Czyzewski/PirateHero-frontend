import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import GoldCoinIcon from '@/components/icons/GoldCoinIcon';
import FameCoinIcon from '@/components/icons/FameCoinIcon';
import type { GameUser } from '@/types/gameUser';

type Props = {
  user: GameUser;
  expProgress: number;
  onLogout: () => void;
};

export default function GameLayoutHeader({ user, expProgress, onLogout }: Props) {
  const { t } = useTranslation();

  return (
    <header className="relative bg-gray-800 border-b-4 border-yellow-400 flex-shrink-0">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <h1 className="min-w-0 text-xl font-bold normal-case tracking-normal text-yellow-400 md:text-2xl font-[family-name:var(--font-body)]">
                {user.username}
              </h1>
              <span className="text-sm md:text-base text-gray-300">|</span>
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base text-gray-300 font-semibold">{t('level')}:</span>
                <span className="text-base md:text-lg font-black text-yellow-400">
                  {parseInt(String(user.level.name), 10) || user.level.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300 font-semibold hidden sm:inline">{t('exp')}:</span>
              <div className="relative w-32 md:w-40 h-5 bg-gray-900 rounded-full overflow-hidden border-2 border-yellow-400/50">
                <div
                  className="absolute inset-y-0 left-0 bg-yellow-400 transition-all duration-700 ease-out"
                  style={{ width: `${expProgress}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-white z-10">{Math.round(expProgress)}%</span>
                </div>
              </div>
              <span className="text-xs md:text-sm text-gray-400">
                {user.experiencePoints}/{user.level.expToNextLevel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div
                className="flex items-center gap-2 cursor-help"
                data-tooltip-id="gold-tooltip"
                data-tooltip-content={t('gold')}
              >
                <GoldCoinIcon className="w-5 h-5" />
                <span className="text-sm md:text-base font-black text-yellow-400">
                  {Number(user.gold).toLocaleString()}
                </span>
              </div>
              <Tooltip id="gold-tooltip" place="bottom" />
              <div
                className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded border-2 border-yellow-400/30 cursor-help"
                data-tooltip-id="fame-coins-tooltip"
                data-tooltip-content={t('diamonds')}
              >
                <FameCoinIcon className="w-5 h-5" />
                <span className="text-sm md:text-base font-black text-white">
                  {Number(user.diamonds).toLocaleString()}
                </span>
              </div>
              <Tooltip id="fame-coins-tooltip" place="bottom" />
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white font-bold rounded cursor-pointer border-4 border-red-700 text-xs md:text-sm uppercase tracking-wide"
              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
