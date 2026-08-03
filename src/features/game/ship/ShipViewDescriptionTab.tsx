import type { TFunction } from 'i18next';
import type { ShipData } from '@/features/game/ship/shipTypes';

type Props = {
  ship: ShipData;
  t: TFunction;
};

export function ShipViewDescriptionTab({ ship, t }: Props) {
  const text = (ship.description ?? '').trim();

  return (
    <div className="space-y-3">
      <h2 className="font-heading text-lg font-bold text-foreground">
        {String(t('shipPage.shipDescriptionSectionTitle'))}
      </h2>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {text ? text : String(t('shipPage.emptyShipDescription'))}
      </p>
    </div>
  );
}
