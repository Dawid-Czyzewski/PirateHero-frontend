import { Star, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GoldCoinIcon from '@/components/icons/GoldCoinIcon';
import type { AvailableMissionDto } from '@/types/gameActivities';

type AvailableMissionCardProps = {
  mission: AvailableMissionDto;
  onClick: (mission: AvailableMissionDto) => void;
};

export default function AvailableMissionCard({ mission, onClick }: AvailableMissionCardProps) {
  const { t } = useTranslation();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0) {
      return t('minutesSeconds', { minutes: mins, seconds: secs });
    } else {
      return t('seconds', { seconds: secs });
    }
  };

  return (
    <div
      onClick={() => onClick(mission)}
      className="w-full min-h-[320px] sm:min-h-[360px] md:min-h-[340px] lg:w-96 lg:min-h-[380px] xl:w-[420px] xl:min-h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-yellow-400/60 rounded-2xl shadow-2xl p-5 sm:p-6 md:p-6 lg:p-8 flex flex-col justify-between items-center hover:scale-[1.02] hover:border-yellow-400 hover:shadow-yellow-400/20 transition-all cursor-pointer"
    >
      <div className="text-center w-full">
        <h3 className="text-2xl sm:text-3xl md:text-3xl font-extrabold text-yellow-400 mb-2 sm:mb-3 uppercase tracking-wide">
          {t(mission.title)}
        </h3>
        {mission.title ? (
          <p className="text-sm sm:text-base text-gray-300/90 leading-snug px-1 mb-3 sm:mb-4">
            {t(`${mission.title}_desc`)}
          </p>
        ) : null}
      </div>
      
      <div className="w-full mt-6 sm:mt-8 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          <div className="flex items-center gap-2 sm:gap-3 bg-gray-700/50 rounded-lg p-3 sm:p-4 border border-yellow-400/20">
            <GoldCoinIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-yellow-400 font-bold text-base sm:text-lg md:text-xl">{mission.goldReward}</span>
              <span className="text-gray-400 text-xs sm:text-sm">{t('gold')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-gray-700/50 rounded-lg p-3 sm:p-4 border border-yellow-400/20">
            <Star className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-yellow-400 font-bold text-base sm:text-lg md:text-xl">{mission.expReward}</span>
              <span className="text-gray-400 text-xs sm:text-sm">{t('exp')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-gray-700/50 rounded-lg p-3 sm:p-4 border border-yellow-400/20">
            <Clock className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-yellow-400 font-bold text-base sm:text-lg md:text-xl">{formatDuration(mission.durationInSeconds)}</span>
              <span className="text-gray-400 text-xs sm:text-sm">{t('duration')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-gray-700/50 rounded-lg p-3 sm:p-4 border border-yellow-400/20">
            <span className="text-yellow-400 font-bold text-xl sm:text-2xl">⚡</span>
            <div className="flex flex-col">
              <span className="text-yellow-400 font-bold text-base sm:text-lg md:text-xl">{mission.energyCost}</span>
              <span className="text-gray-400 text-xs sm:text-sm">{t('energy')}</span>
            </div>
          </div>
        </div>
        {(mission.bonusPercent ?? 0) > 0 && (
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-lg p-2 text-center">
            <p className="text-xs sm:text-sm text-yellow-400 font-semibold">
              +{mission.bonusPercent}% {t('bonus')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
