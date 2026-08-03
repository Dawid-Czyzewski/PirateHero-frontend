import { useMemo } from 'react';
import { CharacterPageView } from '@/features/game/character/CharacterPageView';
import { computeTotalStatsWithEquipment } from '@/features/game/character/characterInventoryTotalStats';
import type { CharacterStatKey } from '@/features/game/character/characterSkillPoints';
import type { ItemStats } from '@/features/game/character/characterTypes';
import type { UserPreviewData } from '@/types/preview';
import { buildPreviewCharacterCatalogAndEquipped } from './buildPreviewCharacterCatalog';
import { userPreviewToGameUser } from './userPreviewToGameUser';

const ZERO_BASE_STATS: Required<ItemStats> = {
  strength: 0,
  agility: 0,
  endurance: 0,
  intelligence: 0,
  luck: 0,
};

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function mapPreviewBaseToItemStats(userData: UserPreviewData): Required<ItemStats> {
  const b = userData.userBaseStatistics as Record<string, number | undefined> | null;
  if (!b) return { ...ZERO_BASE_STATS };
  return {
    strength: num(b.strength ?? b.strongPoints),
    agility: num(b.agility ?? b.agilityPoints),
    endurance: num(b.endurance ?? b.healthPoints),
    intelligence: num(b.intelligence ?? b.intelligencePoints),
    luck: num(b.luck ?? b.criticalChancePoints),
  };
}

const EMPTY_CHEST: Array<string | null> = Array.from({ length: 12 }, () => null);

type Props = {
  userData: UserPreviewData;
};

export function CharacterPublicProfileView({ userData }: Props) {
  const previewUser = useMemo(() => userPreviewToGameUser(userData), [userData]);
  const { catalog, equipped } = useMemo(
    () => buildPreviewCharacterCatalogAndEquipped(userData),
    [userData]
  );
  const baseStats = useMemo(() => mapPreviewBaseToItemStats(userData), [userData]);
  const totalStats = useMemo(
    () => computeTotalStatsWithEquipment(baseStats, equipped, catalog),
    [baseStats, equipped, catalog]
  );

  const noop = () => {};
  const noopAllocate = (_stat: CharacterStatKey) => {};

  return (
    <CharacterPageView
      variant="userPreview"
      user={previewUser}
      catalog={catalog}
      baseStats={baseStats}
      totalStats={totalStats}
      equipped={equipped}
      chestSlots={EMPTY_CHEST}
      activeChestDragSlot={null}
      onActiveChestDragSlotChange={noop}
      onEquipItem={noop}
      onUnequipItem={noop}
      onUnequipToChest={noop}
      onMoveChestItem={noop}
      onAllocateAttributePoint={noopAllocate}
    />
  );
}
