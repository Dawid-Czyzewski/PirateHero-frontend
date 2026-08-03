import type {
  ShipRankingEntry,
  PlayerRankingEntry,
  RankingPagination,
} from '@/types/ranking';
import type { RankingTabId } from './RankingTabs';
import PlayersTableHeader from './PlayersTableHeader';
import ShipsTableHeader from './ShipsTableHeader';
import PlayersTableRow from './PlayersTableRow';
import ShipsTableRow from './ShipsTableRow';
import RankingCards from './RankingCards';

type RankingTableProps = {
  activeTab: RankingTabId;
  data: PlayerRankingEntry[] | ShipRankingEntry[];
  pagination: RankingPagination;
  sortBy: string;
  sortOrder: string;
  onSort: (column: string) => void;
  onViewProfile?: (userId: string) => void;
  onViewShip?: (shipId: string) => void;
};

export default function RankingTable({
  activeTab,
  data,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  onViewProfile,
  onViewShip,
}: RankingTableProps) {
  const startRank = (pagination.page - 1) * pagination.limit + 1;

  return (
    <>
      <div className="block rounded-lg border border-border p-3 md:hidden">
        <RankingCards
          activeTab={activeTab}
          data={data}
          pagination={pagination}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          onViewProfile={onViewProfile}
          onViewShip={onViewShip}
        />
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <table className="w-full text-sm">
          {activeTab === 'players' ? (
            <>
              <PlayersTableHeader sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
              <tbody>
                {(data as PlayerRankingEntry[]).map((item, index) => {
                  const position = startRank + index;
                  return (
                    <PlayersTableRow
                      key={item.id}
                      player={item}
                      position={position}
                      onViewProfile={onViewProfile}
                      onViewShip={onViewShip}
                    />
                  );
                })}
              </tbody>
            </>
          ) : (
            <>
              <ShipsTableHeader sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
              <tbody>
                {(data as ShipRankingEntry[]).map((item, index) => {
                  const position = startRank + index;
                  return (
                    <ShipsTableRow
                      key={item.id}
                      ship={item}
                      position={position}
                      onViewShip={onViewShip}
                    />
                  );
                })}
              </tbody>
            </>
          )}
        </table>
      </div>
    </>
  );
}
