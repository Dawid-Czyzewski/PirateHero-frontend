import { Sparkles } from 'lucide-react';
import type { TFunction } from 'i18next';
import {
  MAX_HULL_UPGRADE_LEVEL,
  MAX_UPGRADE_LEVEL,
  SHIP_CREW_BASE_SLOTS,
  UPGRADE_KEYS,
} from '@/features/game/ship/shipConstants';
import { getNextUpgradeCosts } from '@/features/game/ship/shipUpgradeCosts';
import { mapShipUpgradeKeyToApiType } from '@/features/game/ship/mapShipData';
import { shipUpgradeCurrentEffect } from '@/features/game/ship/shipUpgradeEffect';
import type { ShipData } from '@/features/game/ship/shipTypes';
import { Button } from '@/features/game/ship/ShipUi';

type Props = {
  ship: ShipData;
  isCaptain: boolean;
  upgradeShip: (key: string, cost: number) => void | Promise<void>;
  t: TFunction;
  previewMode?: boolean;
};

export function ShipViewUpgradesTab({
  ship,
  isCaptain,
  upgradeShip,
  t,
  previewMode = false,
}: Props) {
  return (
    <div className="space-y-3">
      <h2 className="mb-3 font-heading text-lg font-bold text-foreground">
        {String(t('shipPage.upgradesTitle'))}
      </h2>
      {UPGRADE_KEYS.map((u) => {
        const lvl = ship.upgrades[u.key] ?? 0;
        const maxForKey = u.key === 'hull' ? MAX_HULL_UPGRADE_LEVEL : MAX_UPGRADE_LEVEL;
        const maxed = lvl >= maxForKey;
        const rowBody = (
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">
              {String(t(`shipPage.upgrades.${u.key}.label`))}{' '}
              <span className="text-primary">
                {String(t('shipPage.levelWithMax', { level: lvl, max: maxForKey }))}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {shipUpgradeCurrentEffect(t, u.key, lvl, SHIP_CREW_BASE_SLOTS)}
            </p>
          </div>
        );
        if (previewMode) {
          return (
            <div key={u.key} className="rounded-md bg-muted/50 p-3">
              {rowBody}
            </div>
          );
        }
        const kind = mapShipUpgradeKeyToApiType(u.key);
        const { goldCost, diamondsCost } = getNextUpgradeCosts(kind, lvl, ship.upgradePricing);
        const canUpgrade =
          isCaptain && !maxed && ship.gold >= goldCost && ship.diamonds >= diamondsCost;
        return (
          <div key={u.key} className="flex items-center justify-between rounded-md bg-muted/50 p-3">
            {rowBody}
            <Button
              size="sm"
              className="ml-4 shrink-0"
              disabled={!canUpgrade}
              onClick={() => void upgradeShip(u.key, goldCost)}
            >
              {maxed ? (
                String(t('shipPage.max'))
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3 shrink-0" />
                  {diamondsCost > 0
                    ? String(t('shipPage.upgradeCostLine', { gold: goldCost, diamonds: diamondsCost }))
                    : String(t('shipPage.upgradeCostGoldOnly', { gold: goldCost }))}
                </span>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
