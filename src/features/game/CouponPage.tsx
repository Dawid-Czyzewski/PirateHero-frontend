import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { redeemCoupon, getCouponHistory } from '@/services/couponService';
import type { CouponHistoryEntryDto } from '@/types/coupon';
import { RedeemCouponSection } from './coupons/RedeemCouponSection';
import { CouponHistorySection } from './coupons/CouponHistorySection';
import { CouponRedeemFeedback, type RedeemFeedbackState } from './coupons/CouponRedeemFeedback';
import { formatRewardDescription } from './coupons/utils';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

function errorMessageKey(error: unknown): string {
  if (error instanceof ApiHttpError) return error.message;
  if (error instanceof Error) return error.message;
  return '';
}

export default function CouponPage() {
  const { t } = useTranslation();
  const { fetchUserData } = useUser();

  usePageMeta({
    title: t('couponPage.seoTitle'),
    description: t('couponPage.seoDescription'),
    openGraph: true,
  });

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CouponHistoryEntryDto[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [redeemFeedback, setRedeemFeedback] = useState<RedeemFeedbackState | null>(null);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await getCouponHistory();
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const setCodeAndClearFeedback = useCallback((next: string) => {
    setRedeemFeedback(null);
    setCode(next);
  }, []);

  const handleRedeem = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setRedeemFeedback({ kind: 'error', message: t('couponCodeRequired') });
      return;
    }

    setLoading(true);
    setRedeemFeedback(null);
    try {
      const result = await redeemCoupon(trimmed);
      const { reward, history: nextHistory } = result;
      const rewardDescription = formatRewardDescription(reward, t);

      setRedeemFeedback({
        kind: 'success',
        reward,
        description: rewardDescription,
      });

      setCode('');
      setHistory(nextHistory);
      setLoading(false);

      await fetchUserData();
    } catch (error) {
      const key = errorMessageKey(error);
      const translated = key && t(key) !== key ? t(key) : t('couponRedeemFailed');
      setRedeemFeedback({ kind: 'error', message: translated });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full space-y-6" aria-label={t('couponPage.pageAriaLabel')}>
      <header className="min-w-0 space-y-2">
        <h1 className={gamePageTitleH1Class}>
          {t('couponPage.title')}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{t('couponPage.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <RedeemCouponSection
            code={code}
            onCodeChange={setCodeAndClearFeedback}
            onRedeem={() => void handleRedeem()}
            loading={loading}
          />
          <CouponRedeemFeedback feedback={redeemFeedback} />
        </div>
        <CouponHistorySection history={history} loading={historyLoading} />
      </div>
    </section>
  );
}
