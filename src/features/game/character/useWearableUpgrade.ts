import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { upgradeWearableItem } from '@/services/wearableUpgradeService';
import type { GameUser } from '@/types/gameUser';

type Params = {
  user: GameUser | null | undefined;
  fetchUserData: () => Promise<unknown>;
  updateUser: (fields: Partial<GameUser>) => Promise<GameUser | undefined>;
};

export function useWearableUpgrade({ user, fetchUserData, updateUser }: Params) {
  const { t } = useTranslation();
  const [upgradingId, setUpgradingId] = useState<string | null>(null);

  const upgradeItem = useCallback(
    async (itemId: string) => {
      if (!user) return;
      setUpgradingId(itemId);
      try {
        const result = await upgradeWearableItem(Number(itemId));
        const gold = result.upgrade?.gold ?? result.gold;
        if (typeof gold === 'number') {
          await updateUser({ gold });
        }
        await fetchUserData();
        toast.success(
          t('characterPage.workshop.upgradeSuccess', {
            level: result.upgrade?.upgradeLevel ?? '',
          })
        );
      } catch (e) {
        const msg =
          e instanceof ApiHttpError && e.message
            ? t(e.message)
            : t('characterPage.workshop.upgradeFailed');
        toast.error(msg);
      } finally {
        setUpgradingId(null);
      }
    },
    [user, fetchUserData, updateUser, t]
  );

  return { upgradeItem, upgradingId };
}
