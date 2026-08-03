import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

export default function ItemTooltip({ item, parentRef }) {
  const { t } = useTranslation();
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!item || !parentRef?.current || !tooltipRef.current) return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const padding = 8;

    let top = parentRect.top - tooltipRect.height - padding;
    let left = parentRect.left + (parentRect.width - tooltipRect.width) / 2;

    if (top < padding) {
      top = parentRect.bottom + padding;
    }
    
    if (top + tooltipRect.height > windowHeight - padding) {
      top = Math.max(padding, windowHeight - tooltipRect.height - padding);
    }
    
    if (left < padding) {
      left = padding;
    }
    if (left + tooltipRect.width > windowWidth - padding) {
      left = windowWidth - tooltipRect.width - padding;
    }

    if (left < padding) {
      left = (windowWidth - tooltipRect.width) / 2;
      left = Math.max(padding, Math.min(left, windowWidth - tooltipRect.width - padding));
    }

    setPosition({ top, left });
  }, [item, parentRef]);

  if (!item) return null;

  const stats = Object.entries(item.statistics || {})
    .filter(([key]) => key !== '@id' && key !== '@type')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return (
    <div
      ref={tooltipRef}
      className="fixed bg-gray-900 border-2 border-yellow-400 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl min-w-[180px] sm:min-w-[220px] md:min-w-[280px] max-w-[calc(100vw-16px)] z-[40] break-words"
      style={{ top: position.top, left: position.left, pointerEvents: 'none' }}
    >
      <div className="font-bold text-yellow-300 text-base sm:text-lg md:text-xl mb-1 text-center">{item.name}</div>
      <div className="text-xs sm:text-sm md:text-base text-yellow-400 mb-1 text-center">
        {t(`item.rarities.${item.rarity}`, item.rarity)}
      </div>
      {item.type && (
        <div className="text-xs text-gray-300 mb-2 text-center">
          {t('item.type')}: <span className="font-semibold text-yellow-300">{t(`item.types.${item.type}`)}</span>
        </div>
      )}
      {Object.entries(stats).length > 0 && (
        <div className="flex flex-col gap-1 text-sm text-white">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">
                {t(
                  `item.stats.${key}`,
                  key
                    .replace(/Points$/, '')
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                )}
              </span>
              <span className="font-bold text-yellow-300">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
      {item.price !== undefined && (
        <div className="text-xs text-yellow-300 mt-2 text-center">
          {item.price} {t('golds')}
        </div>
      )}
    </div>
  );
}
