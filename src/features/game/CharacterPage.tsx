import { useTranslation } from 'react-i18next';
import type { CharacterPageProps } from '@/features/game/gamePageTypes';
import { usePageMeta } from '@/hooks/usePageMeta';
import { CharacterPageView } from '@/features/game/character/CharacterPageView';
import { useCharacterInventory } from '@/features/game/character/useCharacterInventory';

export default function CharacterPage({ onPreviewProfile: _onPreviewProfile }: CharacterPageProps) {
  const { t } = useTranslation();
  const inv = useCharacterInventory();

  usePageMeta({ title: t('characterPage.seoTitle'), description: t('characterPage.seoDescription') });

  return (
    <CharacterPageView
      user={inv.user}
      catalog={inv.catalog}
      baseStats={inv.baseStats}
      totalStats={inv.totalStats}
      equipped={inv.equipped}
      chestSlots={inv.chestSlots}
      activeChestDragSlot={inv.activeChestDragSlot}
      onActiveChestDragSlotChange={inv.setActiveChestDragSlot}
      onEquipItem={inv.equipItem}
      onUnequipItem={inv.unequipItem}
      onUnequipToChest={inv.unequipItemToChestSlot}
      onMoveChestItem={inv.moveChestItem}
      onAllocateAttributePoint={inv.allocateAttributePoint}
      upgradingId={inv.upgradingId}
      onUpgradeItem={inv.upgradeItem}
    />
  );
}
