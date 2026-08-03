import type {
  ShipRankingEntry,
  PlayerRankingEntry,
  RankingPagination,
} from '@/types/ranking';
import PlayersCard from './PlayersCard';
import ShipsCard from './ShipsCard';
import RankingMobileSort from './RankingMobileSort';
import type { RankingTabId } from './RankingTabs';

type RankingCardsProps = {
  activeTab: RankingTabId;
  data: PlayerRankingEntry[] | ShipRankingEntry[];
  pagination: RankingPagination;
  sortBy: string;
  sortOrder: string;
  onSort: (column: string) => void;
  onViewProfile?: (userId: string) => void;
  onViewShip?: (shipId: string) => void;
};

export default function RankingCards({
  activeTab,
  data,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  onViewProfile,
  onViewShip,
}: RankingCardsProps) {
  const startRank = (pagination.page - 1) * pagination.limit + 1;

  return (
    <>
      <RankingMobileSort
        activeTab={activeTab}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
      />
      <div className="space-y-3">
        {activeTab === 'players' ? (
          (data as PlayerRankingEntry[]).map((item, index) => {
            const position = startRank + index;
            return (
              <PlayersCard
                key={item.id}
                player={item}
                position={position}
                onViewProfile={onViewProfile}
                onViewShip={onViewShip}
              />
            );
          })
        ) : (
          (data as ShipRankingEntry[]).map((item, index) => {
            const position = startRank + index;
            return (
              <ShipsCard
                key={item.id}
                ship={item}
                position={position}
                onViewShip={onViewShip}
              />
            );
          })
        )}
      </div>
    </>
  );
}
