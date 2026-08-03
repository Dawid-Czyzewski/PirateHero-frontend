import { Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { gamePagePlayerTypedBodyCaseClass } from '@/features/game/layout/gamePageTitleClasses';
import { useUser } from '@/hooks/useUser';
import type { ShipRankingEntry } from '@/types/ranking';
import { RankingRankCell } from '@/features/game/ranking/RankingRankCell';

type Props = {
  ship: ShipRankingEntry;
  position: number;
  onViewShip?: (shipId: string) => void;
};

export default function ShipsTableRow({ ship, position, onViewShip }: Props) {
  const { t } = useTranslation();
  const { user } = useUser();
  const isHighlighted = Boolean(user && ship.memberIds?.includes(String(user.id)));
  const captain =
    ship.captainUsername && ship.captainUsername.trim() !== ''
      ? ship.captainUsername
      : String(t('rankingPage.unknownCaptain'));
  const max = Number.isFinite(ship.maxMembers) && ship.maxMembers > 0 ? ship.maxMembers : null;

  const rowClass = `border-b border-border transition-colors hover:bg-muted/50 cursor-pointer ${
    isHighlighted ? 'bg-primary/5' : ''
  }`;

  return (
    <tr className={rowClass} onClick={() => onViewShip?.(ship.id)}>
      <td className="px-4 py-3 align-middle">
        <RankingRankCell position={position} />
      </td>
      <td className={`px-4 py-3 font-bold ${isHighlighted ? 'text-primary' : 'text-foreground'}`}>
        <span className="inline-flex items-center gap-1.5">
          <Ship className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          {ship.title}
        </span>
        {isHighlighted ? <span className="ml-2 text-xs text-muted-foreground">({String(t('yourStatek'))})</span> : null}
      </td>
      <td className={`px-4 py-3 text-muted-foreground ${gamePagePlayerTypedBodyCaseClass}`}>{captain}</td>
      <td className="px-4 py-3 text-center text-foreground">
        {ship.memberCount}
        {max != null ? `/${max}` : ''}
      </td>
      <td className="px-4 py-3 text-right font-heading font-bold text-primary">
        {(ship.totalFamePoints ?? 0).toLocaleString()}
      </td>
    </tr>
  );
}
