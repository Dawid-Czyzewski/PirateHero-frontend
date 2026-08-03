import { useTranslation } from 'react-i18next';

export default function StatRow({ label, value, color, onPlus, price, freePoints, gold }) {
  const { t } = useTranslation();

  const canAfford = freePoints > 0 || gold >= price;

  return (
    <div className="flex justify-between items-center w-full">
      <span className="text-white text-base sm:text-lg font-medium truncate">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full font-bold text-black text-sm sm:text-base ${color}`}>
          {value ?? '-'}
        </span>
        <button
          onClick={onPlus}
          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold text-lg shadow transition
            ${canAfford
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          title={freePoints > 0 ? t('addPoint') : t('buyPoint', { price })}
          disabled={!canAfford}
        >
          +
        </button>
        {!freePoints && (
          <span className="text-yellow-300 text-xs sm:text-sm">{price}g</span>
        )}
      </div>
    </div>
  );
}
