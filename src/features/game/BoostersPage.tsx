import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import {
  getShopBoosterById,
  shopBoosterCatalog,
  shopBoosterCategories,
} from '@/features/game/boosters/shopBoosterCatalog';
import type { ShopBoosterDefinition } from '@/features/game/boosters/shopBoosterCatalog';
import { useSessionShopBoosters } from '@/features/game/boosters/SessionShopBoostersContext';
import { BoostersCategoryColumn } from '@/features/game/boosters/BoostersCategoryColumn';
import { BoostersPageActiveSection } from '@/features/game/boosters/BoostersPageActiveSection';
import { BoostersReplaceModal } from '@/features/game/boosters/BoostersReplaceModal';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

export default function BoostersPage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { entries, nowMs, purchaseShopBooster } = useSessionShopBoosters();
  const catalog = shopBoosterCatalog;
  const [isReplaceConfirmOpen, setIsReplaceConfirmOpen] = useState(false);
  const [pendingBooster, setPendingBooster] = useState<ShopBoosterDefinition | null>(null);
  const [activeBoostersExpanded, setActiveBoostersExpanded] = useState(false);

  const boosterById = useMemo(() => {
    const map = new Map<string, ShopBoosterDefinition>();
    for (const b of catalog) {
      map.set(b.id, b);
    }
    return map;
  }, [catalog]);

  const gold = Number(user?.gold ?? 0);
  const premium = Number(user?.diamonds ?? 0);

  usePageMeta({
    title: t('boostersPage.seoTitle'),
    description: t('boostersPage.seoDescription'),
    openGraph: true,
  });

  const boostersByCategory = useMemo(
    () =>
      shopBoosterCategories.map((category) => ({
        ...category,
        boosters: catalog.filter((x) => x.category === category.id),
      })),
    [catalog]
  );

  const visibleActive = useMemo(() => {
    return entries
      .filter((e) => e.expiresAt > nowMs)
      .map((e) => {
        const booster = boosterById.get(e.boosterId) ?? getShopBoosterById(e.boosterId);
        return booster ? { booster, expiresAt: e.expiresAt } : null;
      })
      .filter((x): x is { booster: ShopBoosterDefinition; expiresAt: number } => x != null);
  }, [entries, nowMs, boosterById]);

  const getActiveBoosterInCategory = (
    category: ShopBoosterDefinition['category']
  ): { booster: ShopBoosterDefinition; expiresAt: number } | null => {
    for (const e of entries) {
      if (e.expiresAt <= nowMs) continue;
      const b = boosterById.get(e.boosterId) ?? getShopBoosterById(e.boosterId);
      if (b?.category === category) return { booster: b, expiresAt: e.expiresAt };
    }
    return null;
  };

  const runPurchase = async (booster: ShopBoosterDefinition) => {
    await purchaseShopBooster(booster);
  };

  const buyBooster = (booster: ShopBoosterDefinition) => {
    const activeInCategory = getActiveBoosterInCategory(booster.category);
    if (activeInCategory && activeInCategory.booster.id !== booster.id) {
      setPendingBooster(booster);
      setIsReplaceConfirmOpen(true);
      return;
    }
    void runPurchase(booster);
  };

  const confirmBoosterReplacement = () => {
    if (!pendingBooster) return;
    void runPurchase(pendingBooster);
    setPendingBooster(null);
    setIsReplaceConfirmOpen(false);
  };

  const cancelBoosterReplacement = () => {
    setPendingBooster(null);
    setIsReplaceConfirmOpen(false);
  };

  return (
    <section className="w-full space-y-6" aria-label={t('boostersPage.pageAriaLabel')}>
      <h1 className={gamePageTitleH1Class}>
        {t('boostersPage.title')}
      </h1>

      <BoostersPageActiveSection
        visibleActive={visibleActive}
        nowMs={nowMs}
        expanded={activeBoostersExpanded}
        onToggleExpanded={() => setActiveBoostersExpanded((v) => !v)}
      />

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-live="polite">
        {boostersByCategory.map((category) => (
          <BoostersCategoryColumn
            key={category.id}
            category={category}
            gold={gold}
            premium={premium}
            nowMs={nowMs}
            entries={entries}
            onBuyBooster={buyBooster}
          />
        ))}
      </section>

      {isReplaceConfirmOpen && pendingBooster ? (
        <BoostersReplaceModal
          pendingBooster={pendingBooster}
          onConfirm={confirmBoosterReplacement}
          onCancel={cancelBoosterReplacement}
        />
      ) : null}
    </section>
  );
}
