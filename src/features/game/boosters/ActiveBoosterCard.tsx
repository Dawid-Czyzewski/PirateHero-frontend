import { useTranslation } from 'react-i18next';
import { formatTimeRemaining, getTimeRemaining } from './boosterUtils';

export default function ActiveBoosterCard({ userBooster, timeRemaining }) {
  const { t } = useTranslation();
  
  const diff = getTimeRemaining(userBooster.id, userBooster.expiresAt, timeRemaining);
  const timeDisplay = formatTimeRemaining(diff, t);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-yellow-400/30">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-xl font-bold text-yellow-400">
          {t(userBooster.boosterTemplate?.name, userBooster.boosterTemplate?.name)}
        </h4>
        <span className="text-sm text-green-400">
          {timeDisplay}
        </span>
      </div>
      <p className="text-base text-gray-300">
        {t(userBooster.boosterTemplate?.description, userBooster.boosterTemplate?.description)}
      </p>
    </div>
  );
}
