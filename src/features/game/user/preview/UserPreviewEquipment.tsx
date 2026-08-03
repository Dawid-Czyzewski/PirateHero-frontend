import { useTranslation } from 'react-i18next';
import EquipmentSlot from '../../character/EquipmentSlot';

export default function UserPreviewEquipment({ equipmentSlots }) {
  const { t } = useTranslation();

  if (!equipmentSlots || equipmentSlots.length === 0) return null;

  return (
    <div className="bg-gray-700/80 rounded-xl p-4 sm:p-6 border-2 border-yellow-400/20">
      <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">
        {t('equipment')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {equipmentSlots.map((slot, idx) => {
          const slotWithType = {
            ...slot,
            type: slot.slotType
          };
          return (
            <div key={idx} className="flex flex-col items-center">
              <EquipmentSlot
                slot={slotWithType}
                idx={idx}
                type={slot.slotType}
                tooltip={{ item: null, idx: null, type: null }}
                setTooltip={() => {}}
                handleDragStart={() => {}}
                handleDragOver={() => {}}
                handleDrop={() => {}}
                handleDragEnd={() => {}}
                onClick={() => {}}
                isSelected={false}
              />
              {slot.wearableItem && (
                <span className="text-xs text-gray-300 mt-2 text-center">
                  {slot.wearableItem.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
