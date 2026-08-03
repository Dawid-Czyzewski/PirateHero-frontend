import { useCallback, useState } from 'react';
import type { TFunction } from 'i18next';
import {
  depositToShip,
  upgradeShip as upgradeShipRequest,
} from '@/services/shipService';
import type { UserContextValue } from '@/context/userContext';
import type { ShipMessageDto } from '@/types/ship';
import type { GameUser } from '@/types/gameUser';
import { getNextUpgradeCosts } from '@/features/game/ship/shipUpgradeCosts';
import {
  appendShipMessageToChat,
  clonePayload,
  isShipOwner,
  syncTreasuryFromMessage,
} from '@/features/game/ship/hooks/shipOptimistic';
import type { UseShipDataResult } from '@/features/game/ship/hooks/useShipData';
import type { ShipFeedback } from '@/features/game/ship/hooks/useShipFeedback';
import {
  mapShipUpgradeKeyToApiType,
} from '@/features/game/ship/mapShipData';
import {
  MAX_HULL_UPGRADE_LEVEL,
  MAX_UPGRADE_LEVEL,
  SHIP_CREW_BASE_SLOTS,
} from '@/features/game/ship/shipConstants';
import type { ShipData } from '@/features/game/ship/shipTypes';

type Params = {
  user: GameUser | null | undefined;
  fetchUserData: UserContextValue['fetchUserData'] | undefined;
  t: TFunction;
  data: UseShipDataResult;
  setFeedback: (feedback: ShipFeedback) => void;
  patchUser?: UserContextValue['updateUser'];
};

export function useShipUpgrades({
  user,
  fetchUserData,
  t,
  data,
  setFeedback,
  patchUser,
}: Params) {
  const {
    payload,
    ship,
    applyPayload,
    loadShipPack,
    setPayload,
    setShip,
    setChatMessages,
  } = data;

  const [contributeGold, setContributeGold] = useState('');
  const [contributeDiamonds, setContributeDiamonds] = useState('');

  const upgradeShip = useCallback(
    (key: string, _cost: number) => {
      setFeedback(null);
      if (!ship || !payload?.ship || !isShipOwner(ship)) return;

      const apiType = mapShipUpgradeKeyToApiType(key);
      const currentLevel = Number(ship.upgrades[key as keyof ShipData['upgrades']] ?? 0);
      const maxForKey = key === 'hull' ? MAX_HULL_UPGRADE_LEVEL : MAX_UPGRADE_LEVEL;
      if (currentLevel >= maxForKey) return;

      const { goldCost, diamondsCost, newLevel } = getNextUpgradeCosts(
        apiType,
        currentLevel,
        ship.upgradePricing
      );
      const treasuryGold = Number(ship.gold ?? 0);
      const treasuryDiamonds = Number(ship.diamonds ?? 0);
      if (treasuryGold < goldCost) {
        setFeedback({ type: 'error', message: String(t('insufficientGold')) });
        return;
      }
      if (treasuryDiamonds < diamondsCost) {
        setFeedback({ type: 'error', message: String(t('notEnoughDiamonds')) });
        return;
      }

      const prevPayload = clonePayload(payload)!;
      const nextPayload = clonePayload(payload)!;
      const c = nextPayload.ship;
      if (!c) return;

      c.gold = Number(c.gold ?? 0) - goldCost;
      c.diamonds = Number(c.diamonds ?? 0) - diamondsCost;
      if (apiType === 'skills') c.skillsUpgrade = newLevel;
      else if (apiType === 'work') c.workUpgrade = newLevel;
      else if (apiType === 'missions') c.missionsUpgrade = newLevel;
      else if (apiType === 'hull') {
        const hullLvl = Math.min(MAX_HULL_UPGRADE_LEVEL, newLevel);
        c.hullUpgrade = hullLvl;
        c.maxMembers = SHIP_CREW_BASE_SLOTS + hullLvl;
      }

      applyPayload(nextPayload);

      void (async () => {
        const res = await upgradeShipRequest(apiType, undefined, fetchUserData);
        if (res.success === false) {
          applyPayload(prevPayload);
          setFeedback({ type: 'error', message: res.message });
          return;
        }
        void loadShipPack(true);
      })();
    },
    [ship, payload, applyPayload, fetchUserData, loadShipPack, t, setFeedback]
  );

  const handleContribute = useCallback(
    async (type: 'gold' | 'diamonds') => {
      setFeedback(null);
      if (!ship || !payload?.ship || !user?.id) return;
      const raw = type === 'gold' ? contributeGold : contributeDiamonds;
      const val = Number.parseInt(String(raw).trim(), 10);
      if (Number.isNaN(val) || val <= 0) return;

      const g = type === 'gold' ? val : 0;
      const d = type === 'diamonds' ? val : 0;
      const userGold = Number(user.gold ?? 0);
      const userDiamonds = Number(user.diamonds ?? 0);
      if (g > userGold) {
        setFeedback({ type: 'error', message: String(t('insufficientGold')) });
        return;
      }
      if (d > userDiamonds) {
        setFeedback({ type: 'error', message: String(t('notEnoughDiamonds')) });
        return;
      }

      const prevPayload = clonePayload(payload)!;
      const nextPayload = clonePayload(payload)!;
      if (nextPayload.ship) {
        nextPayload.ship.gold = Number(nextPayload.ship.gold ?? 0) + g;
        nextPayload.ship.diamonds = Number(nextPayload.ship.diamonds ?? 0) + d;
      }
      applyPayload(nextPayload);
      if (patchUser) {
        void patchUser({ gold: userGold - g, diamonds: userDiamonds - d });
      }
      if (type === 'gold') setContributeGold('');
      else setContributeDiamonds('');

      const res = await depositToShip(g > 0 ? g : null, d > 0 ? d : null, user, undefined, undefined);
      if (res.success === false) {
        applyPayload(prevPayload);
        if (patchUser) {
          void patchUser({ gold: userGold, diamonds: userDiamonds });
        }
        setFeedback({ type: 'error', message: res.message });
        return;
      }
      if (patchUser && res.data?.user) {
        void patchUser({
          gold: res.data.user.gold,
          diamonds: res.data.user.diamonds,
        });
      }
      const cm = res.data?.shipMessage;
      if (cm) {
        syncTreasuryFromMessage(cm.shipTreasury, setPayload, setShip);
        const dto: ShipMessageDto = {
          id: cm.id,
          content: cm.content,
          createdAt: cm.createdAt,
          isSystem: cm.isSystem,
          shipTreasury: cm.shipTreasury,
        };
        appendShipMessageToChat(setChatMessages, dto, t, user?.id);
      }
      void loadShipPack(true);
    },
    [
      ship,
      payload,
      user,
      contributeGold,
      contributeDiamonds,
      patchUser,
      applyPayload,
      loadShipPack,
      t,
      setFeedback,
      setPayload,
      setShip,
      setChatMessages,
    ]
  );

  return {
    contributeGold,
    setContributeGold,
    contributeDiamonds,
    setContributeDiamonds,
    upgradeShip,
    handleContribute,
  };
}
