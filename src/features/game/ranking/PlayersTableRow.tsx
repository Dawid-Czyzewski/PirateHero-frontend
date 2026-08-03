import { useTranslation } from 'react-i18next';
import { gamePagePlayerTypedBodyCaseClass } from '@/features/game/layout/gamePageTitleClasses';
import { PlayerTitleBadge } from '@/features/game/player/PlayerTitleBadge';
import { useUser } from '@/hooks/useUser';
import type { PlayerRankingEntry } from '@/types/ranking';
import { RankingRankCell } from '@/features/game/ranking/RankingRankCell';

type Props = {
  player: PlayerRankingEntry;
  position: number;
  onViewProfile?: (userId: string) => void;
  onViewShip?: (shipId: string) => void;
};

export default function PlayersTableRow({ player, position, onViewProfile, onViewShip }: Props) {
  const { t } = useTranslation();
  const { user } = useUser();
  const isHighlighted = Boolean(user && player.id === String(user.id));

  const rowClass = `border-b border-border transition-colors hover:bg-muted/50 cursor-pointer ${
    isHighlighted ? 'bg-primary/5' : ''
  }`;

  const openProfile = () => onViewProfile?.(player.id);

  return (
    <tr className={rowClass} onClick={openProfile}>
      <td className="px-4 py-3 align-middle">
        <RankingRankCell position={position} />
      </td>
      <td className={`px-4 py-3 font-bold ${isHighlighted ? 'text-primary' : 'text-foreground'}`}>
        <div className="flex flex-col gap-0.5">
          <PlayerTitleBadge title={player.equippedTitle} />
          <span>
            {player.username}
            {isHighlighted ? <span className="ml-2 text-xs text-muted-foreground">({String(t('you'))})</span> : null}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {player.ship ? (
          <span
            role="link"
            tabIndex={0}
            className={`cursor-pointer hover:text-primary ${gamePagePlayerTypedBodyCaseClass}`}
            onClick={(e) => {
              e.stopPropagation();
              if (player.ship?.id != null) {
                onViewShip?.(String(player.ship.id));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                if (player.ship?.id != null) {
                  onViewShip?.(String(player.ship.id));
                }
              }
            }}
          >
            {player.ship.title}
          </span>
        ) : (
          String(t('rankingPage.noShip'))
        )}
      </td>
      <td className="px-4 py-3 text-right text-foreground">{player.level?.name ?? '-'}</td>
      <td className="px-4 py-3 text-right font-heading font-bold text-primary">
        {(player.famePoints ?? 0).toLocaleString()}
      </td>
    </tr>
  );
}
