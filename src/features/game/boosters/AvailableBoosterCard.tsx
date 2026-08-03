import { useTranslation } from 'react-i18next';
import { formatPrice, hasActiveBoosterForTemplate } from './boosterUtils';

export default function AvailableBoosterCard({
  userAvailableBooster,
  user,
  userBoosters,
  actionLoading,
  onBuyClick
}) {
  const { t } = useTranslation();
  const template = userAvailableBooster.boosterTemplate;
  const hasActiveSameTier = hasActiveBoosterForTemplate(userBoosters, template);
  const canAfford = userAvailableBooster.useGold 
    ? (user?.gold || 0) >= userAvailableBooster.price
    : (user?.diamonds || 0) >= userAvailableBooster.price;

  const getEffectLabel = () => {
    switch (template?.type) {
      case 'ENERGY':
        return `+${template?.effectAmount} ${t('energy')}`;
      case 'TRAINING_POINTS':
        return `+${template?.effectAmount} ${t('trainingPoints')}`;
      case 'DUEL_POINTS':
        return `+${template?.effectAmount} ${t('fightPoints')}`;
      case 'SKILLS':
        return `+${template?.effectAmount}%`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-yellow-400/30">
      <h5 className="text-md font-bold text-yellow-400 mb-2">
        {t(template?.name, template?.name)}
      </h5>
      <p className="text-sm text-gray-300 mb-3">
        {t(template?.description, template?.description)}
      </p>
      
      <div className="mb-3">
        <div className="text-sm text-gray-400">
          <span>{t('effect')}: </span>
          <span className="text-yellow-400 font-bold">
            {getEffectLabel()}
          </span>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          <span>{t('duration')}: </span>
          <span className="text-yellow-400">7 {t('days')}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-bold text-yellow-400">
          {formatPrice(userAvailableBooster.price, userAvailableBooster.useGold, t)}
        </span>
        {hasActiveSameTier && (
          <span className="text-xs text-green-400">
            {t('active')}
          </span>
        )}
      </div>

      <button
        onClick={() => onBuyClick(userAvailableBooster.id)}
        disabled={actionLoading || hasActiveSameTier || !canAfford}
        className={`w-full font-bold py-2 px-4 rounded ${
          hasActiveSameTier
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : !canAfford
            ? 'bg-red-600 text-white cursor-not-allowed'
            : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 cursor-pointer'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {hasActiveSameTier
          ? t('alreadyActive')
          : !canAfford
          ? (userAvailableBooster.useGold ? t('notEnoughGold') : t('notEnoughDiamonds'))
          : t('buy')}
      </button>
    </div>
  );
}
