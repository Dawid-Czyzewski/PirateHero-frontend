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

export default function PlayersCard({ player, position, onViewProfile, onViewShip }: Props) {
  const { t } = useTranslation();
  const { user } = useUser();
  const isHighlighted = Boolean(user && player.id === user.id);

  return (
    <div
      className={`rounded-lg border border-border p-4 transition-colors ${
        isHighlighted ? 'border-primary/40 bg-primary/5' : 'hover:bg-muted/20'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border"
            aria-hidden
          >
            <RankingRankCell position={position} />
          </div>
          <div className="min-w-0">
            <PlayerTitleBadge title={player.equippedTitle} className="mb-0.5" />
            <h3
              className={`cursor-pointer truncate text-lg font-bold transition-colors hover:text-primary ${
                isHighlighted ? 'text-primary' : 'text-foreground'
              } ${gamePagePlayerTypedBodyCaseClass}`}
              onClick={() => onViewProfile?.(player.id)}
            >
              {player.username}
            </h3>
            {isHighlighted ? (
              <span className="text-xs text-muted-foreground">({String(t('you'))})</span>
            ) : null}
          </div>
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{t('rankingPage.colShip')}</dt>
          <dd className="text-right font-medium text-foreground">
            {player.ship ? (
              <span
                role="button"
                tabIndex={0}
                className={`cursor-pointer text-primary hover:underline ${gamePagePlayerTypedBodyCaseClass}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (player.ship?.id != null) {
                    onViewShip?.(String(player.ship.id));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
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
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{t('rankingPage.colLevel')}</dt>
          <dd className="font-medium text-foreground">{player.level?.name ?? '-'}</dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2">
          <dt className="text-muted-foreground">{t('rankingPage.colFame')}</dt>
          <dd className="font-heading font-bold text-primary">
            {(player.famePoints ?? 0).toLocaleString()}
          </dd>
        </div>
      </dl>
    </div>
  );
}
