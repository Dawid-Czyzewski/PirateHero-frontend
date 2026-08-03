import { useTranslation } from 'react-i18next';
import type { CouponRewardDto } from '@/types/coupon';
import { CouponRewardIcon } from './CouponRewardIcon';

export type RedeemFeedbackState =
  | { kind: 'success'; reward: CouponRewardDto; description: string }
  | { kind: 'error'; message: string };

export type CouponRedeemFeedbackProps = {
  feedback: RedeemFeedbackState | null;
};

function ItemRewardDetails({ reward }: { reward: Extract<CouponRewardDto, { type: 'ITEM' }> }) {
  const { t } = useTranslation();
  const { item } = reward;
  const stats = item.statistics;

  const rarityLabel = t(`item.rarities.${reward.rarity}`, reward.rarity);
  const typeLabel = t('item.type');
  const typeDisplay = typeLabel === 'item.type' ? 'Type' : typeLabel;
  const typeValue = t(`item.types.${item.type}`, item.type);

  return (
    <div className="mt-3 w-full border-t border-primary/20 pt-3 text-left text-sm">
      <p className="font-semibold text-foreground">{item.name}</p>
      <p className="mt-1 text-muted-foreground">
        {rarityLabel} · {typeDisplay}: {typeValue}
      </p>
      {stats && Object.values(stats).some((v) => v !== undefined && v !== 0) ? (
        <ul className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          {stats.strongPoints != null ? (
            <li>
              {t('item.stats.strongPoints', 'Strength')}:{' '}
              <span className="font-medium text-primary">+{stats.strongPoints}</span>
            </li>
          ) : null}
          {stats.agilityPoints != null ? (
            <li>
              {t('item.stats.agilityPoints', 'Agility')}:{' '}
              <span className="font-medium text-primary">+{stats.agilityPoints}</span>
            </li>
          ) : null}
          {stats.intelligencePoints != null && stats.intelligencePoints !== 0 ? (
            <li>
              {t('characterPage.stats.intelligence', 'Intelligence')}:{' '}
              <span className="font-medium text-primary">+{stats.intelligencePoints}</span>
            </li>
          ) : null}
          {stats.criticalChancePoints != null ? (
            <li>
              {t('characterPage.stats.luck', 'Luck')}:{' '}
              <span className="font-medium text-primary">+{stats.criticalChancePoints}</span>
            </li>
          ) : null}
          {stats.healthPoints != null ? (
            <li>
              {t('item.stats.healthPoints', 'Health')}:{' '}
              <span className="font-medium text-primary">+{stats.healthPoints}</span>
            </li>
          ) : null}
        </ul>
      ) : null}
      {item.price != null ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {t('questItemRewardModal.itemValue')}: {item.price} {t('golds')}
        </p>
      ) : null}
    </div>
  );
}

export function CouponRedeemFeedback({ feedback }: CouponRedeemFeedbackProps) {
  const { t } = useTranslation();

  if (!feedback) return null;

  if (feedback.kind === 'error') {
    return (
      <div
        className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
        role="alert"
        aria-live="assertive"
      >
        {feedback.message}
      </div>
    );
  }

  const { reward, description } = feedback;

  return (
    <div
      className="flex flex-col items-stretch gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 sm:flex-row sm:items-start"
      role="status"
      aria-live="polite"
    >
      <div className="flex shrink-0 justify-center sm:justify-start sm:pt-0.5">
        <CouponRewardIcon reward={reward} className="h-6 w-6 shrink-0" />
      </div>
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="text-base font-semibold text-foreground">
          {t('couponPage.received')}: {description}
        </p>
        {reward.type === 'ITEM' && reward.item ? <ItemRewardDetails reward={reward} /> : null}
      </div>
    </div>
  );
}
