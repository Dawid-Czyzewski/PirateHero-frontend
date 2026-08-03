import { useState } from 'react';
import type { TFunction } from 'i18next';
import { Coins, Gem, Ship, Star, Users } from 'lucide-react';
import { CancelMissionModal } from '@/features/game/missions/CancelMissionModal';
import type { ShipData } from '@/features/game/ship/shipTypes';
import { Button, Input } from '@/features/game/ship/ShipUi';

type Props = {
  ship: ShipData;
  t: TFunction;
  isCaptain: boolean;
  onDeleteShip: () => void | Promise<void>;
  onLeaveShip: () => void | Promise<void>;
  contributeGold: string;
  setContributeGold: (v: string) => void;
  contributeDiamonds: string;
  setContributeDiamonds: (v: string) => void;
  handleContribute: (type: 'gold' | 'diamonds') => void | Promise<void>;
};

export function ShipViewHeader({
  ship,
  t,
  isCaptain,
  onDeleteShip,
  onLeaveShip,
  contributeGold,
  setContributeGold,
  contributeDiamonds,
  setContributeDiamonds,
  handleContribute,
}: Props) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="font-heading flex items-center gap-2 text-2xl font-black tracking-wider text-primary">
            <Ship className="h-6 w-6 shrink-0" /> {ship.name}
          </h1>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
          {isCaptain ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-destructive/60 text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                {String(t('shipPage.deleteShipButton'))}
              </Button>
              <CancelMissionModal
                isOpen={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={() => {
                  void onDeleteShip();
                  setDeleteConfirmOpen(false);
                }}
                title={String(t('confirmDeleteStatek'))}
                description={String(t('confirmDeleteStatekMessage'))}
                confirmLabel={String(t('deleteStatek'))}
                dismissLabel={String(t('cancel'))}
              />
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-destructive/60 text-destructive hover:bg-destructive/10"
                onClick={() => setLeaveConfirmOpen(true)}
              >
                {String(t('shipPage.leaveShipButton'))}
              </Button>
              <CancelMissionModal
                isOpen={leaveConfirmOpen}
                onClose={() => setLeaveConfirmOpen(false)}
                onConfirm={() => {
                  void onLeaveShip();
                  setLeaveConfirmOpen(false);
                }}
                title={String(t('confirmLeaveStatek'))}
                description={String(t('confirmLeaveStatekMessage'))}
                confirmLabel={String(t('shipPage.leaveShipButton'))}
                dismissLabel={String(t('cancel'))}
              />
            </>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-purple-400" />
            <span className="font-bold text-foreground">{ship.fame}</span>
            <span className="text-muted-foreground">{String(t('shipPage.fameLabel'))}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-bold text-foreground">
              {ship.members.length}/{ship.maxMembers}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border pt-3">
        <span className="text-xs font-heading uppercase tracking-wide text-muted-foreground">
          {String(t('shipPage.treasuryLabel'))}
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <Coins className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground">{ship.gold}</span>
          <div className="ml-2 flex items-center gap-1">
            <Input
              className="h-7 w-20 text-xs"
              placeholder={String(t('shipPage.amountPlaceholder'))}
              value={contributeGold}
              onChange={(e) => setContributeGold(e.target.value)}
              type="number"
              min="1"
            />
            <Button
              size="sm"
              className="h-7 px-2 text-xs bg-primary text-primary-foreground hover:opacity-90"
              onClick={() => void handleContribute('gold')}
            >
              {String(t('shipPage.depositButton'))}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Gem className="h-4 w-4 text-blue-400" />
          <span className="font-bold text-foreground">{ship.diamonds}</span>
          <div className="ml-2 flex items-center gap-1">
            <Input
              className="h-7 w-20 text-xs"
              placeholder={String(t('shipPage.amountPlaceholder'))}
              value={contributeDiamonds}
              onChange={(e) => setContributeDiamonds(e.target.value)}
              type="number"
              min="1"
            />
            <Button
              size="sm"
              className="h-7 px-2 text-xs bg-primary text-primary-foreground hover:opacity-90"
              onClick={() => void handleContribute('diamonds')}
            >
              {String(t('shipPage.depositButton'))}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
