import { Ship, Star } from 'lucide-react';
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

export default function ShipsCard({ ship, position, onViewShip }: Props) {
  const { t } = useTranslation();
  const { user } = useUser();
  const isHighlighted = Boolean(user && ship.memberIds?.includes(user.id));
  const captain =
    ship.captainUsername && ship.captainUsername.trim() !== ''
      ? ship.captainUsername
      : String(t('rankingPage.unknownCaptain'));
  const max = Number.isFinite(ship.maxMembers) && ship.maxMembers > 0 ? ship.maxMembers : null;

  return (
    <div
      className={`rounded-lg border border-border p-4 transition-colors ${
        isHighlighted ? 'border-primary/40 bg-primary/5' : 'hover:bg-muted/20'
      }`}
      role="button"
      tabIndex={0}
      onClick={() => onViewShip?.(ship.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewShip?.(ship.id);
        }
      }}
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
            <h3
              className={`flex items-center gap-1.5 truncate text-lg font-bold ${
                isHighlighted ? 'text-primary' : 'text-foreground'
              }`}
            >
              <Ship className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className={gamePagePlayerTypedBodyCaseClass}>{ship.title}</span>
            </h3>
            {isHighlighted ? (
              <span className="text-xs text-muted-foreground">({String(t('yourStatek'))})</span>
            ) : null}
          </div>
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{t('rankingPage.colCaptain')}</dt>
          <dd className={`text-right font-medium text-foreground ${gamePagePlayerTypedBodyCaseClass}`}>
            {captain}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{t('rankingPage.colCrew')}</dt>
          <dd className="text-right font-medium text-foreground">
            {ship.memberCount}
            {max != null ? `/${max}` : ''}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2">
          <dt className="inline-flex items-center gap-1 text-muted-foreground">
            <Star className="h-3 w-3 shrink-0" aria-hidden />
            {t('rankingPage.colFame')}
          </dt>
          <dd className="font-heading font-bold text-primary">
            {(ship.totalFamePoints ?? 0).toLocaleString()}
          </dd>
        </div>
      </dl>
    </div>
  );
}
