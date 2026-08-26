import { Archive } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { GameItem } from '@/features/game/character/characterTypes';
import type { SlotType } from '@/data/gameItems';
import { CharacterChestEmptySlot, CharacterChestFilledSlot } from './CharacterChestSlot';

type Props = {
  chestSlots: Array<string | null>;
  equipped: Partial<Record<SlotType, string>>;
  catalog: Map<string, GameItem>;
  gold?: number;
  upgradingId?: string | null;
  onUpgrade?: (itemId: string) => void | Promise<void>;
  onSpecialize?: (itemId: string, specialization: string) => void | Promise<void>;
  onDragCategoryChange?: (slot: SlotType | null) => void;
  onEquip: (itemId: string) => void | Promise<void>;
  onMove: (fromIndex: number, toIndex: number) => void | Promise<void>;
  onDropFromEquip: (slot: SlotType, chestIndex: number) => void | Promise<void>;
};

export function CharacterChestSection({
  chestSlots,
  equipped,
  catalog,
  gold = 0,
  upgradingId = null,
  onUpgrade,
  onSpecialize,
  onDragCategoryChange,
  onEquip,
  onMove,
  onDropFromEquip,
}: Props) {
  const { t } = useTranslation();
  const chestItemsCount = chestSlots.filter(Boolean).length;

  return (
    <div className="rounded-lg border border-border bg-card/60 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
        <Archive className="h-4 w-4 text-primary" /> {t('characterPage.chestTitle')}
        <span className="ml-auto text-sm font-semibold normal-case tracking-tight text-muted-foreground sm:text-base">
          {chestItemsCount}/12 {t('characterPage.slotsLabel')}
        </span>
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 sm:gap-2.5 md:gap-3">
        {Array.from({ length: 12 }, (_, index) => {
          const id = chestSlots[index];
          if (!id) {
            return (
              <CharacterChestEmptySlot
                key={`empty-${index}`}
                index={index}
                label={t('characterPage.emptySlot')}
                onMove={onMove}
                onDropFromEquip={onDropFromEquip}
              />
            );
          }
          const item = catalog.get(id);
          if (!item) {
            return (
              <CharacterChestEmptySlot
                key={`missing-${index}`}
                index={index}
                label={t('characterPage.emptySlot')}
                onMove={onMove}
                onDropFromEquip={onDropFromEquip}
              />
            );
          }
          const equippedInSlot = equipped[item.slot]
            ? catalog.get(equipped[item.slot] as string) ?? null
            : null;
          return (
            <CharacterChestFilledSlot
              key={`${id}-${index}`}
              index={index}
              item={item}
              equippedInSlot={equippedInSlot}
              gold={gold}
              upgrading={upgradingId === item.id}
              onUpgrade={onUpgrade}
              onSpecialize={onSpecialize}
              onDragCategoryChange={onDragCategoryChange}
              onEquip={onEquip}
              onMove={onMove}
              onDropFromEquip={onDropFromEquip}
            />
          );
        })}
      </div>
    </div>
  );
}
