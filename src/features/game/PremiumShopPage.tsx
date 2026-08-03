import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import {
  fetchPremiumShopCatalog,
  fetchPremiumShopTransactions,
  purchasePremiumPack,
} from '@/services/premiumShopService';
import type { PremiumShopTransactionDto } from '@/types/premiumShop';
import type { PremiumDiamondPack } from './premiumShop/premiumShopCatalog';
import { PremiumDiamondPackCard } from './premiumShop/PremiumShopPackCards';
import { PremiumShopConfirmModal } from './premiumShop/PremiumShopConfirmModal';
import { PremiumShopTransactionHistory } from './premiumShop/PremiumShopTransactionHistory';

type PendingPurchase = {
  packId: string;
  title: string;
  diamonds: number;
  pricePln: number;
};

function optimisticTransactionId(): string {
  return `optimistic-${Date.now()}`;
}

export default function PremiumShopPage() {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const [packs, setPacks] = useState<PremiumDiamondPack[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [pending, setPending] = useState<PendingPurchase | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [transactions, setTransactions] = useState<PremiumShopTransactionDto[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  usePageMeta({
    title: t('premiumShopPage.seoTitle'),
    description: t('premiumShopPage.seoDescription'),
    openGraph: true,
  });

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError(false);
    try {
      const data = await fetchPremiumShopCatalog();
      setPacks(data.packs ?? []);
    } catch {
      setPacks([]);
      setCatalogError(true);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await fetchPremiumShopTransactions();
      setTransactions(data);
    } catch {
      setTransactions([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (!user?.id) {
      setTransactions([]);
      return;
    }
    void loadHistory();
  }, [loadHistory, user?.id]);

  const openPack = useCallback(
    (pack: PremiumDiamondPack) => {
      if (isPurchasing) {
        return;
      }
      setPending({
        packId: pack.id,
        title: t(`premiumShopPage.packs.${pack.id}.name`, { defaultValue: pack.id }),
        diamonds: pack.totalDiamonds,
        pricePln: pack.pricePln,
      });
    },
    [isPurchasing, t]
  );

  const closeConfirm = useCallback(() => {
    if (!isPurchasing) {
      setPending(null);
    }
  }, [isPurchasing]);

  const confirmPurchase = useCallback(() => {
    if (!pending || !user || isPurchasing) {
      return;
    }

    const snapshotUser = user;
    const optimisticId = optimisticTransactionId();
    const optimisticTx: PremiumShopTransactionDto = {
      id: optimisticId,
      packId: pending.packId,
      diamonds: pending.diamonds,
      pricePln: pending.pricePln,
      purchasedAt: new Date().toISOString(),
    };

    setIsPurchasing(true);
    closeConfirm();
    void updateUser({ diamonds: Number(user.diamonds ?? 0) + pending.diamonds });
    setTransactions((prev) => [optimisticTx, ...prev]);

    void purchasePremiumPack(pending.packId)
      .then(async (result) => {
        await updateUser({ diamonds: result.updatedUser.diamonds });
        setTransactions((prev) => {
          const rest = prev.filter((entry) => entry.id !== optimisticId);
          const exists = rest.some((entry) => entry.id === result.transaction.id);
          if (exists) {
            return rest;
          }
          return [result.transaction, ...rest];
        });
      })
      .catch(() => {
        void updateUser(snapshotUser);
        setTransactions((prev) => prev.filter((entry) => entry.id !== optimisticId));
        toast.error(t('premiumShopPage.purchaseFailed'));
      })
      .finally(() => {
        setIsPurchasing(false);
      });
  }, [closeConfirm, isPurchasing, pending, t, updateUser, user]);

  return (
    <section className="w-full space-y-6" aria-label={t('premiumShopPage.pageAriaLabel')}>
      <h1 className={gamePageTitleH1Class}>{t('premiumShopPage.title')}</h1>

      {catalogLoading ? (
        <p className="text-sm text-muted-foreground">{t('premiumShopPage.catalogLoading')}</p>
      ) : catalogError ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
          <p className="text-sm text-red-300">{t('premiumShopPage.catalogLoadFailed')}</p>
          <button
            type="button"
            onClick={() => void loadCatalog()}
            className="mt-2 cursor-pointer text-sm font-semibold text-yellow-400 underline"
          >
            {t('premiumShopPage.catalogRetry')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
          {packs.map((pack) => (
            <PremiumDiamondPackCard key={pack.id} pack={pack} onSelect={openPack} />
          ))}
        </div>
      )}

      <PremiumShopTransactionHistory transactions={transactions} loading={historyLoading} />

      <PremiumShopConfirmModal
        isOpen={pending != null}
        title={pending?.title ?? ''}
        diamonds={pending?.diamonds ?? 0}
        pricePln={pending?.pricePln ?? 0}
        onClose={closeConfirm}
        onConfirm={confirmPurchase}
        confirmDisabled={isPurchasing}
      />
    </section>
  );
}
