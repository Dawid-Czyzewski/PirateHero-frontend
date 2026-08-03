import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { useSessionShopBoostersOptional } from '@/features/game/boosters/SessionShopBoostersContext';
import { applySkillsShopBoosterToTotalStats } from '@/features/game/boosters/sessionShopBoosterEffects';
import {
  applyShipSkillsBonusFromEquipmentBase,
  resolveEffectiveShipSkillsLevelForUi,
} from '@/features/game/ship/shipBonusEffects';
import { useUser } from '@/hooks/useUser';
import { ShopChestBridge } from './ShopChestBridge';
import { ShopChestSection } from './ShopChestSection';
import { ShopEquipmentPanel } from './ShopEquipmentPanel';
import { ShopOffersSection } from './ShopOffersSection';
import { ShopViewHeader } from './ShopViewHeader';
import { computeShopPreviewTotals } from './useShop';
import type { ShopItem } from './types';
import type { ShopController } from './shopViewTypes';

type Props = {
  shop: ShopController;
};

export function ShopView({ shop }: Props) {
  const { user } = useUser();
  const { entries: shopBoosterEntries, nowMs: shopBoosterNowMs } = useSessionShopBoostersOptional();

  const {
    gold,
    diamonds,
    refreshMeta,
    equipped,
    inventory,
    shop: shopSlots,
    draggedCategorySlot,
    dragOverZone,
    setDragOverZone,
    activeDragSource,
    refreshing,
    error,
    characterBaseStats,
    characterTotalStats,
    slotOrder,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDropOnEquipSlot,
    handleDropOnSellZone,
    handleDropOnChest,
    peekDragSource,
    refreshOffer,
    buyItem,
    equipItem,
    unequipToChest,
  } = shop;

  const suppressTooltip = activeDragSource !== null;
  const showSellOverlay = activeDragSource === 'inventory' || activeDragSource === 'equipped';

  const [shopHoverItem, setShopHoverItem] = useState<ShopItem | null>(null);

  const categoryHighlightSlot = draggedCategorySlot ?? shopHoverItem?.slotId ?? null;

  useEffect(() => {
    if (activeDragSource !== null) setShopHoverItem(null);
  }, [activeDragSource]);

  const characterStatsAfterShopBooster = useMemo(
    () => applySkillsShopBoosterToTotalStats(shopBoosterEntries, shopBoosterNowMs, characterTotalStats),
    [shopBoosterEntries, shopBoosterNowMs, characterTotalStats]
  );

  const effectiveShipSkillsLevel = useMemo(
    () => resolveEffectiveShipSkillsLevelForUi(user),
    [user]
  );

  const characterDisplayTotals = useMemo(() => {
    if (effectiveShipSkillsLevel <= 0) return characterStatsAfterShopBooster;
    return applyShipSkillsBonusFromEquipmentBase(
      characterTotalStats,
      characterStatsAfterShopBooster,
      effectiveShipSkillsLevel
    );
  }, [characterTotalStats, characterStatsAfterShopBooster, effectiveShipSkillsLevel]);

  const shipBonusesForAttributes =
    effectiveShipSkillsLevel > 0
      ? { active: true, skillsLevel: effectiveShipSkillsLevel }
      : undefined;

  const shopPreviewRawTotals = useMemo(() => {
    if (!shopHoverItem) return null;
    return computeShopPreviewTotals(equipped, characterBaseStats, shopHoverItem);
  }, [shopHoverItem, equipped, characterBaseStats]);

  const shopPreviewAfterShopBooster = useMemo(() => {
    if (!shopPreviewRawTotals) return null;
    return applySkillsShopBoosterToTotalStats(shopBoosterEntries, shopBoosterNowMs, shopPreviewRawTotals);
  }, [shopPreviewRawTotals, shopBoosterEntries, shopBoosterNowMs]);

  const shopPreviewDisplayTotals = useMemo(() => {
    if (!shopPreviewRawTotals || !shopPreviewAfterShopBooster) return null;
    if (effectiveShipSkillsLevel <= 0) return shopPreviewAfterShopBooster;
    return applyShipSkillsBonusFromEquipmentBase(
      shopPreviewRawTotals,
      shopPreviewAfterShopBooster,
      effectiveShipSkillsLevel
    );
  }, [shopPreviewRawTotals, shopPreviewAfterShopBooster, effectiveShipSkillsLevel]);

  const handleChestCellDragOver = (e: DragEvent, slotIndex: number) => {
    const src = peekDragSource();
    if (src === 'shop' || src === 'equipped' || src === 'inventory') {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = src === 'shop' ? 'copy' : 'move';
      setDragOverZone(`chest-${slotIndex}`);
    }
  };

  const chestSectionActive = dragOverZone?.startsWith('chest') ?? false;

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-6 py-8 text-center">
        <p className="font-display text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="-mx-3 flex w-full max-w-none min-h-0 flex-col space-y-4 px-3 md:-mx-4 md:px-4 md:space-y-5 lg:-mx-5 lg:px-5 xl:-mx-6 xl:px-6">
      <ShopViewHeader
        onRefresh={refreshOffer}
        refreshing={refreshing}
        refreshMeta={refreshMeta}
        diamonds={diamonds}
      />

      <div className="grid min-h-0 w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)] lg:gap-5">
        <ShopEquipmentPanel
          equipped={equipped}
          highlightSlotId={categoryHighlightSlot}
          suppressTooltip={suppressTooltip}
          dragOverZone={dragOverZone}
          setDragOverZone={setDragOverZone}
          characterBaseStats={characterBaseStats}
          characterEquipmentTotals={characterTotalStats}
          characterStatsAfterShopBooster={characterStatsAfterShopBooster}
          characterDisplayTotals={characterDisplayTotals}
          shopPreviewRawTotals={shopPreviewRawTotals}
          shopPreviewAfterShopBooster={shopPreviewAfterShopBooster}
          shopPreviewDisplayTotals={shopPreviewDisplayTotals}
          shipBonusesForAttributes={shipBonusesForAttributes}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOverBase={handleDragOver}
          onDropOnEquipSlot={handleDropOnEquipSlot}
          onDoubleClickUnequip={(item) => void unequipToChest(item, null)}
        />

        <div className="flex min-h-0 flex-col overflow-visible">
          <ShopOffersSection
            gold={gold}
            shopSlots={shopSlots}
            equipped={equipped}
            highlightSlotId={categoryHighlightSlot}
            slotOrder={slotOrder}
            refreshing={refreshing}
            suppressTooltip={suppressTooltip}
            showSellOverlay={showSellOverlay}
            onHoverShopItem={setShopHoverItem}
            peekDragSource={peekDragSource}
            setDragOverZone={setDragOverZone}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDropOnSellZone={handleDropOnSellZone}
            onDoubleClickBuy={(item) => void buyItem(item)}
          />

          <ShopChestBridge peekDragSource={peekDragSource} setDragOverZone={setDragOverZone} onDropOnChest={handleDropOnChest} />

          <ShopChestSection
            inventory={inventory}
            equipped={equipped}
            onHoverChestItem={setShopHoverItem}
            dragOverZone={dragOverZone}
            chestSectionActive={chestSectionActive}
            suppressTooltip={suppressTooltip}
            peekDragSource={peekDragSource}
            setDragOverZone={setDragOverZone}
            onChestCellDragOver={handleChestCellDragOver}
            onDropOnChest={handleDropOnChest}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDoubleClickEquip={(item) => void equipItem(item)}
          />
        </div>
      </div>
    </div>
  );
}
