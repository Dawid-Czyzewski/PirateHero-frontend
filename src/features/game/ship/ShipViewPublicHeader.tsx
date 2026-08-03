import type { TFunction } from 'i18next';
import { Ship, Star, Users } from 'lucide-react';
import type { ShipData } from '@/features/game/ship/shipTypes';

type Props = {
  ship: ShipData;
  t: TFunction;
  omitDescription?: boolean;
};

export function ShipViewPublicHeader({ ship, t, omitDescription = false }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="font-heading flex items-center gap-2 text-2xl font-black tracking-wider text-primary">
            <Ship className="h-6 w-6 shrink-0" /> {ship.name}
          </h1>
          {!omitDescription && ship.description ? (
            <p className="mt-2 text-sm text-muted-foreground">{ship.description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 border-t border-border pt-3 text-sm">
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
  );
}
