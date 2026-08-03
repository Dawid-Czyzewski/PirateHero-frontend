import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Award, ChevronRight } from 'lucide-react';
import type { ItemStats, SlotType } from '@/data/gameItems';
import type { GameItem } from '@/features/game/character/characterTypes';
import { useSessionShopBoostersOptional } from '@/features/game/boosters/SessionShopBoostersContext';
import { applySkillsShopBoosterToTotalStats } from '@/features/game/boosters/sessionShopBoosterEffects';
import {
  applyShipSkillsBonusFromEquipmentBase,
  resolveEffectiveShipSkillsLevelForUi,
} from '@/features/game/ship/shipBonusEffects';
import { CharacterAttributesPanel } from './CharacterAttributesPanel';
import { CharacterPaperDoll } from './CharacterPaperDoll';
import { CharacterChestSection } from './CharacterChestSection';
import type { GameUser } from '@/types/gameUser';
import type { CharacterStatKey } from '@/features/game/character/characterSkillPoints';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export type CharacterPageViewProps = {
  user: GameUser | null | undefined;
  catalog: Map<string, GameItem>;
  baseStats: Required<ItemStats>;
  totalStats: Required<ItemStats>;
  equipped: Partial<Record<SlotType, string>>;
  chestSlots: Array<string | null>;
  activeChestDragSlot: SlotType | null;
  onActiveChestDragSlotChange: (slot: SlotType | null) => void;
  onEquipItem: (itemId: string, targetSlot?: SlotType) => void | Promise<void>;
  onUnequipItem: (slot: SlotType) => void | Promise<void>;
  onUnequipToChest: (slot: SlotType, chestIndex: number) => void | Promise<void>;
  onMoveChestItem: (fromIndex: number, toIndex: number) => void | Promise<void>;
  onAllocateAttributePoint: (stat: CharacterStatKey) => void | Promise<void>;
  variant?: 'self' | 'userPreview';
};

export function CharacterPageView({
  user,
  catalog,
  baseStats,
  totalStats,
  equipped,
  chestSlots,
  activeChestDragSlot,
  onActiveChestDragSlotChange,
  onEquipItem,
  onUnequipItem,
  onUnequipToChest,
  onMoveChestItem,
  onAllocateAttributePoint,
  variant = 'self',
}: CharacterPageViewProps) {
  const { t } = useTranslation();
  const isUserPreview = variant === 'userPreview';
  const { entries: contextShopBoosterEntries, nowMs: contextShopBoosterNowMs } =
    useSessionShopBoostersOptional();

  const shopBoosterEntries = useMemo(() => {
    if (isUserPreview) {
      if (!Array.isArray(user?.sessionShopBoosters)) return [];
      return user.sessionShopBoosters
        .filter((e) => e.boosterId && e.expiresAt > 0)
        .map((e) => ({ boosterId: e.boosterId, expiresAt: e.expiresAt }));
    }
    return contextShopBoosterEntries ?? [];
  }, [isUserPreview, user?.sessionShopBoosters, contextShopBoosterEntries]);

  const shopBoosterNowMs = isUserPreview ? Date.now() : (contextShopBoosterNowMs ?? Date.now());

  const statsAfterShopBooster = useMemo(
    () => applySkillsShopBoosterToTotalStats(shopBoosterEntries, shopBoosterNowMs, totalStats),
    [shopBoosterEntries, shopBoosterNowMs, totalStats]
  );

  const effectiveShipSkillsLevel = useMemo(
    () => resolveEffectiveShipSkillsLevelForUi(user),
    [user]
  );

  const displayTotalStats = useMemo(() => {
    if (effectiveShipSkillsLevel <= 0) return statsAfterShopBooster;
    return applyShipSkillsBonusFromEquipmentBase(
      totalStats,
      statsAfterShopBooster,
      effectiveShipSkillsLevel
    );
  }, [totalStats, statsAfterShopBooster, effectiveShipSkillsLevel]);

  const shipBonusesForTooltip =
    effectiveShipSkillsLevel > 0
      ? {
          active: true,
          skillsLevel: effectiveShipSkillsLevel,
        }
      : undefined;

  return (
    <div className="w-full space-y-4 px-0 sm:px-2 lg:px-4 lg:space-y-5">
      {!isUserPreview ? (
        <header className="flex w-full flex-col items-start gap-3">
          <h1 className={`${gamePageTitleH1Class} min-w-0`}>{t('character')}</h1>
          <Link
            to="/game/titles"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/35 hover:bg-primary/10 hover:text-primary"
          >
            <Award className="h-4 w-4 shrink-0" aria-hidden />
            {t('titlesPage.title')}
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </header>
      ) : null}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="order-2 lg:order-1">
          <CharacterAttributesPanel
            baseStats={baseStats}
            equipmentTotalStats={totalStats}
            statsAfterShopBooster={statsAfterShopBooster}
            displayTotalStats={displayTotalStats}
            shipBonuses={shipBonusesForTooltip}
            attributeUpgrade={
              user?.id
                ? {
                    freePoints: user.freeSkillPointsAvailable ?? 0,
                    gold: user.gold ?? 0,
                    prices: user.userSkillPointsPrices,
                    onAllocatePoint: onAllocateAttributePoint,
                  }
                : undefined
            }
          />
        </div>

        <div className="order-1 space-y-4 lg:order-2 lg:space-y-5">
          <CharacterPaperDoll
            username={user?.username}
            avatarName={user?.avatarName}
            equippedTitle={user?.equippedTitle}
            levelName={user?.level?.name}
            experiencePoints={user?.experiencePoints ?? 0}
            expToNextLevel={user?.level?.expToNextLevel ?? 100}
            gold={user?.gold ?? 0}
            famePoints={user?.famePoints ?? 0}
            diamonds={user?.diamonds ?? 0}
            equipped={equipped}
            catalog={catalog}
            activeChestDragSlot={activeChestDragSlot}
            onDrop={onEquipItem}
            onUnequip={onUnequipItem}
            readOnly={isUserPreview}
            heroStatsMode={isUserPreview ? 'fameOnly' : 'default'}
          />
        </div>
      </div>

      {!isUserPreview ? (
        <CharacterChestSection
          chestSlots={chestSlots}
          equipped={equipped}
          catalog={catalog}
          onDragCategoryChange={onActiveChestDragSlotChange}
          onEquip={(itemId) => void onEquipItem(itemId)}
          onMove={onMoveChestItem}
          onDropFromEquip={onUnequipToChest}
        />
      ) : null}
    </div>
  );
}
