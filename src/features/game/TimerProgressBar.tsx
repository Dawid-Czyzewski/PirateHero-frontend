import { useTranslation } from 'react-i18next';

export default function TimerProgressBar({ remainingTime, progress, isWork = false }) {
  const { t } = useTranslation();

  const formatDuration = (seconds) => {
    if (isWork) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return t('timeLeftHoursMinutesSeconds', { hours: hrs, minutes: mins, seconds: secs });
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (mins > 0) {
        return t('timeLeftMinutesSeconds', { minutes: mins, seconds: secs });
      } else {
        return t('timeLeftSeconds', { seconds: secs });
      }
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="w-full bg-gray-700/50 rounded-full h-5 sm:h-6 overflow-hidden border-2 border-yellow-400/30 shadow-inner">
        <div
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-500 shadow-lg"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center text-sm sm:text-base text-yellow-400 font-bold mt-3 sm:mt-4">
        {formatDuration(remainingTime)}
      </p>
    </div>
  );
}