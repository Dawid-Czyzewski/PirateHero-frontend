import { requestJson } from '@/lib/api/requestJson';
import type { CouponHistoryEntryDto, RedeemCouponSuccessData } from '@/types/coupon';

export async function redeemCoupon(
  code: string
): Promise<RedeemCouponSuccessData> {
  return requestJson<RedeemCouponSuccessData>('/coupons/redeem', {
    method: 'POST',
    body: { code },
  });
}

export async function getCouponHistory(): Promise<CouponHistoryEntryDto[]> {
  const data = await requestJson<{ history?: CouponHistoryEntryDto[] }>(
    '/coupons/history',
    { method: 'GET' }
  );
  return data.history ?? [];
}
