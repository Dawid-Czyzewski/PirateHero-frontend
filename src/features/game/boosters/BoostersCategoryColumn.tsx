import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShopBoosterDefinition } from '@/features/game/boosters/shopBoosterCatalog';
import type { ShopBoosterSessionEntry } from '@/features/game/boosters/sessionShopBoosterEffects';
import { BoosterShopCard } from '@/features/game/boosters/BoosterShopCard';

export type BoostersCategoryMeta = {
  id: ShopBoosterDefinition['category'];
  label: string;
  icon: ComponentType<{ className?: string }>;
  colorClass: string;
  boosters: ShopBoosterDefinition[];
};

type Props = {
  category: BoostersCategoryMeta;
  gold: number;
  premium: number;
  nowMs: number;
  entries: ShopBoosterSessionEntry[];
  onBuyBooster: (booster: ShopBoosterDefinition) => void;
};

export function BoostersCategoryColumn({
  category,
  gold,
  premium,
  nowMs,
  entries,
  onBuyBooster,
}: Props) {
  const { t } = useTranslation();
  const Icon = category.icon;

  return (
    <section
      className="space-y-3 rounded-xl border border-yellow-400/20 bg-black/20 p-2.5 sm:p-3"
      aria-label={t('boostersPage.categoryAria', { label: category.label })}
    >
      <h2 className="inline-flex items-center gap-2 text-base font-semibold text-yellow-200 sm:text-lg">
        <Icon className={`h-5 w-5 ${category.colorClass}`} />
        {category.label}
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {category.boosters.map((booster) => (
          <BoosterShopCard
            key={booster.id}
            booster={booster}
            gold={gold}
            premium={premium}
            nowMs={nowMs}
            entries={entries}
            onBuy={onBuyBooster}
          />
        ))}
      </div>
    </section>
  );
}
