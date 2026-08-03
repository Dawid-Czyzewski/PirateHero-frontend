export type CouponRewardDto =
  | { type: 'GOLD'; amount: number }
  | { type: 'diamonds'; amount: number }
  | {
      type: 'BOOSTER';
      boosterTemplateId: number;
      boosterName: string;
      durationDays: number;
    }
  | {
      type: 'ITEM';
      itemId: number;
      itemName: string;
      rarity: string | { value?: string };
      itemType: string;
      item: {
        id: number;
        name: string;
        type: string;
        rarity: string | { value?: string };
        price?: number;
        statistics?: {
          strongPoints?: number;
          agilityPoints?: number;
          criticalChancePoints?: number;
          intelligencePoints?: number;
          healthPoints?: number;
        };
      };
    };

export type CouponHistoryEntryDto = {
  id: number;
  code: string;
  rewardType: string;
  rewardReceived: CouponRewardDto | null;
  usedAt: string;
};

export type RedeemCouponSuccessData = {
  success: boolean;
  reward: CouponRewardDto;
  coupon: {
    code: string;
    rewardType: string;
  };
  history: CouponHistoryEntryDto[];
};
