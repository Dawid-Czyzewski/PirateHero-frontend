import ItemTooltip from './ItemTooltip';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

export default function EquipmentSlot({
  slot,
  idx,
  type,
  tooltip,
  setTooltip,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  onClick,
  isSelected,
}) {
  const { t } = useTranslation();
  const item = slot?.wearableItem || null;
  const showTooltip = tooltip.type === type && tooltip.idx === idx && tooltip.item;

  const onDragStart = (e) => {
    if (handleDragStart) {
      handleDragStart(idx, type);
    } else if (item) {
      e.dataTransfer.setData(
        'application/json',
        JSON.stringify({ src: { type, index: idx }, item })
      );
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (handleDrop) {
      handleDrop(idx, type);
    } else {
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        console.warn('Dropped data but no handleDrop supplied:', data);
      } catch {
        
      }
    }
  };

  const resetTooltip = () => setTooltip({ item: null, idx: null, type: null });

  const slotRef = useRef(null);
  return (
    <div
      ref={slotRef}
      draggable={!!item}
      onDragStart={onDragStart}
      onDragOver={(e) => (handleDragOver ? handleDragOver(e) : e.preventDefault())}
      onDrop={onDrop}
      onDragEnd={() => {
        handleDragEnd?.();
        resetTooltip();
      }}
      onMouseEnter={() => setTooltip({ item, idx, type })}
      onMouseLeave={resetTooltip}
      onClick={() => onClick && onClick()}
      className={`w-20 h-20 border-2 rounded-lg flex items-center justify-center relative transition-colors duration-200 cursor-pointer
        ${item ? 'border-yellow-400/40 bg-gray-800' : 'border-gray-500/20 bg-gray-900'}
        ${isSelected ? 'border-yellow-400 bg-yellow-400/20' : ''}
        hover:border-yellow-400 hover:bg-gray-700 lg:cursor-grab active:cursor-grabbing`}
    >
      {item ? (
        <img
          src={item.icon || '/placeholder.png'}
          alt={item.name}
          className="w-14 h-14 object-contain pointer-event s-none"
        />
      ) : (
        <div className="w-14 h-14 flex items-center justify-center text-gray-400 select-none text-xs">
          {t(`item.types.${slot.type}`)}
        </div>
      )}

      {showTooltip && <ItemTooltip item={item} parentRef={slotRef} />}
    </div>
  );
}
