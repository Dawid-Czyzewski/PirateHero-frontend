import { useTranslation } from 'react-i18next';

type Props = {
  stats: Record<string, number> | null;
};

export default function UserPreviewStats({ stats }: Props) {
  const { t } = useTranslation();

  if (!stats) return null;

  return (
    <div className="bg-gray-700/80 rounded-xl p-4 sm:p-6 border-2 border-yellow-400/20">
      <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">
        {t('stats')}
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
        <div className="flex justify-between">
          <span className="text-gray-300">{t('strength')}:</span>
          <span className="text-yellow-300 font-bold">{stats.strongPoints}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">{t('agility')}:</span>
          <span className="text-yellow-300 font-bold">{stats.agilityPoints}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">{t('health')}:</span>
          <span className="text-yellow-300 font-bold">{stats.healthPoints}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">{t('criticalChance')}:</span>
          <span className="text-yellow-300 font-bold">{stats.criticalChancePoints}</span>
        </div>
      </div>
    </div>
  );
}
