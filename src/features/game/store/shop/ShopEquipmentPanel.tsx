import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ItemStats } from '@/data/gameItems';
import { CHARACTER_EQUIP_LEFT, CHARACTER_EQUIP_RIGHT } from './characterEquipLayout';
import { EquipSlotTile } from './EquipSlotTile';
import { setShopDragImage } from './shopDragPreview';
import { StoreAttributesPanel } from './StoreAttributesPanel';
import type { ShopItem, ShopSelectionSource, ShopSlotId } from './types';

type Props = {
  equipped: Partial<Record<ShopSlotId, ShopItem | undefined>>;
  highlightSlotId: ShopSlotId | null;
  suppressTooltip: boolean;
  dragOverZone: string | null;
  setDragOverZone: (z: string | null) => void;
  characterBaseStats: Required<ItemStats>;
  characterEquipmentTotals: Required<ItemStats>;
  characterStatsAfterShopBooster: Required<ItemStats>;
  characterDisplayTotals: Required<ItemStats>;
  shopPreviewRawTotals: Required<ItemStats> | null;
  shopPreviewAfterShopBooster: Required<ItemStats> | null;
  shopPreviewDisplayTotals: Required<ItemStats> | null;
  shipBonusesForAttributes?: { active: boolean; skillsLevel: number };
  onDragStart: (e: React.DragEvent, item: ShopItem, source: ShopSelectionSource) => void;
  onDragEnd: () => void;
  onDragOverBase: (e: React.DragEvent) => void;
  onDropOnEquipSlot: (e: React.DragEvent, slot: ShopSlotId) => void;
  onDoubleClickUnequip?: (item: ShopItem) => void;
  onSellEquippedItem?: (item: ShopItem) => void;
};

export function ShopEquipmentPanel({
  equipped,
  highlightSlotId,
  suppressTooltip,
  dragOverZone,
  setDragOverZone,
  characterBaseStats,
  characterEquipmentTotals,
  characterStatsAfterShopBooster,
  characterDisplayTotals,
  shopPreviewRawTotals,
  shopPreviewAfterShopBooster,
  shopPreviewDisplayTotals,
  shipBonusesForAttributes,
  onDragStart,
  onDragEnd,
  onDragOverBase,
  onDropOnEquipSlot,
  onDoubleClickUnequip,
  onSellEquippedItem,
}: Props) {
  const { t } = useTranslation();

  return (
    <aside className="min-h-0 space-y-4 overflow-visible xl:min-w-0">
      <section className="card-pirate space-y-4 overflow-visible p-4 sm:p-5">
        <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          <Shield className="h-4 w-4 shrink-0 text-primary" />
          {t('equipment')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="flex flex-col gap-2 overflow-visible">
            {CHARACTER_EQUIP_LEFT.map((slotId: ShopSlotId) => (
              <EquipSlotTile
                key={slotId}
                slotId={slotId}
                item={equipped[slotId]}
                suppressTooltip={suppressTooltip}
                onDragStart={(e, item) => {
                  onDragStart(e, item, 'equipped');
                  setShopDragImage(e, item, t(item.nameKey));
                }}
                onDragEnd={onDragEnd}
                onDragOver={(e) => {
                  onDragOverBase(e);
                  setDragOverZone(`equip-${slotId}`);
                }}
                onDrop={(e) => onDropOnEquipSlot(e, slotId)}
                dropHighlight={dragOverZone === `equip-${slotId}`}
                categoryHighlight={highlightSlotId === slotId}
                onDoubleClickUnequip={onDoubleClickUnequip}
                onSell={onSellEquippedItem}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2 overflow-visible">
            {CHARACTER_EQUIP_RIGHT.map((slotId: ShopSlotId) => (
              <EquipSlotTile
                key={slotId}
                slotId={slotId}
                item={equipped[slotId]}
                categoryHighlight={highlightSlotId === slotId}
                suppressTooltip={suppressTooltip}
                onDragStart={(e, item) => {
                  onDragStart(e, item, 'equipped');
                  setShopDragImage(e, item, t(item.nameKey));
                }}
                onDragEnd={onDragEnd}
                onDragOver={(e) => {
                  onDragOverBase(e);
                  setDragOverZone(`equip-${slotId}`);
                }}
                onDrop={(e) => onDropOnEquipSlot(e, slotId)}
                dropHighlight={dragOverZone === `equip-${slotId}`}
                onDoubleClickUnequip={onDoubleClickUnequip}
                onSell={onSellEquippedItem}
              />
            ))}
          </div>
        </div>
      </section>

      <StoreAttributesPanel
        baseStats={characterBaseStats}
        equipmentTotals={shopPreviewRawTotals ?? characterEquipmentTotals}
        statsAfterShopBooster={shopPreviewAfterShopBooster ?? characterStatsAfterShopBooster}
        displayTotals={shopPreviewDisplayTotals ?? characterDisplayTotals}
        diffAgainstTotals={shopPreviewDisplayTotals ? characterDisplayTotals : null}
        shipBonuses={shipBonusesForAttributes}
      />
    </aside>
  );
}
