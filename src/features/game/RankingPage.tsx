import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { fetchPlayersRanking, fetchShipsRanking } from '@/services/rankingService';
import RankingHeader from './ranking/RankingHeader';
import RankingTabs from './ranking/RankingTabs';
import type { RankingTabId } from './ranking/RankingTabs';
import RankingSearchBar from './ranking/RankingSearchBar';
import RankingTable from './ranking/RankingTable';
import RankingPagination from './ranking/RankingPagination';
import { RankingTableSkeleton } from './ranking/RankingTableSkeleton';
import RankingEmptyState from './ranking/RankingEmptyState';
import RankingErrorState from './ranking/RankingErrorState';
import type {
  ShipRankingEntry,
  PlayerRankingEntry,
  RankingPagination as RankingPaginationState,
} from '@/types/ranking';
import type { RankingPageProps } from '@/features/game/gamePageTypes';

const SEARCH_DEBOUNCE_MS = 350;

function rankingTabFromSearch(searchParams: URLSearchParams): RankingTabId {
  const raw = searchParams.get('tab');
  if (raw === 'ships' || raw === 'clubs' || raw === 'stateki') {
    return 'stateki';
  }
  return 'players';
}

export default function RankingPage({
  onViewProfile,
  onViewShip,
}: RankingPageProps) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<RankingTabId>(() =>
    rankingTabFromSearch(searchParams)
  );

  useEffect(() => {
    setActiveTab(rankingTabFromSearch(searchParams));
  }, [searchParams]);

  const [playersSearchInput, setPlayersSearchInput] = useState('');
  const [shipsSearchInput, setShipsSearchInput] = useState('');
  const [playersSearchDebounced, setPlayersSearchDebounced] = useState('');
  const [shipsSearchDebounced, setShipsSearchDebounced] = useState('');

  useEffect(() => {
    const id = window.setTimeout(() => setPlayersSearchDebounced(playersSearchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [playersSearchInput]);

  useEffect(() => {
    const id = window.setTimeout(() => setShipsSearchDebounced(shipsSearchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [shipsSearchInput]);

  const [playersRanking, setPlayersRanking] = useState<PlayerRankingEntry[]>([]);
  const [shipsRanking, setShipsRanking] = useState<ShipRankingEntry[]>([]);
  const [playersPagination, setPlayersPagination] = useState<RankingPaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [shipsPagination, setShipsPagination] = useState<RankingPaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [playersSort, setPlayersSort] = useState({
    sortBy: 'famePoints',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
  });
  const [shipsSort, setShipsSort] = useState({
    sortBy: 'totalFamePoints',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeSearchInput = activeTab === 'players' ? playersSearchInput : shipsSearchInput;
  const activeSearchDebounced = activeTab === 'players' ? playersSearchDebounced : shipsSearchDebounced;

  const loadRanking = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'players') {
          const result = await fetchPlayersRanking(
            page,
            20,
            playersSort.sortBy,
            playersSort.sortOrder,
            playersSearchDebounced || undefined
          );
          setPlayersRanking(result.items ?? []);
          setPlayersPagination(
            result.pagination ?? {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
            }
          );
        } else {
          const result = await fetchShipsRanking(
            page,
            20,
            shipsSort.sortBy,
            shipsSort.sortOrder,
            shipsSearchDebounced || undefined
          );
          setShipsRanking(result.items ?? []);
          setShipsPagination(
            result.pagination ?? {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
            }
          );
        }
      } catch (err) {
        console.error('Error loading ranking:', err);
        const msg = err instanceof Error ? err.message : t('errorLoadingRanking');
        setError(msg || String(t('errorLoadingRanking')));
      } finally {
        setLoading(false);
      }
    },
    [activeTab, playersSort, shipsSort, playersSearchDebounced, shipsSearchDebounced, t]
  );

  useEffect(() => {
    void loadRanking(1);
  }, [loadRanking]);

  const handlePageChange = (newPage: number) => {
    void loadRanking(newPage);
  };

  const handleTabChange = (tab: RankingTabId) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (value: string) => {
    if (activeTab === 'players') {
      setPlayersSearchInput(value);
      setPlayersPagination((prev) => ({ ...prev, page: 1 }));
    } else {
      setShipsSearchInput(value);
      setShipsPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const handleSort = (column: string) => {
    if (activeTab === 'players') {
      const newSortOrder =
        playersSort.sortBy === column && playersSort.sortOrder === 'DESC' ? 'ASC' : 'DESC';
      setPlayersSort({ sortBy: column, sortOrder: newSortOrder });
      setPlayersPagination((prev) => ({ ...prev, page: 1 }));
    } else {
      const newSortOrder =
        shipsSort.sortBy === column && shipsSort.sortOrder === 'DESC' ? 'ASC' : 'DESC';
      setShipsSort({ sortBy: column, sortOrder: newSortOrder });
      setShipsPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const currentPagination = activeTab === 'players' ? playersPagination : shipsPagination;
  const currentData = activeTab === 'players' ? playersRanking : shipsRanking;
  const currentSort = activeTab === 'players' ? playersSort : shipsSort;

  return (
    <div className="w-full max-w-none space-y-5 py-4 sm:py-6">
      <RankingHeader />

      <RankingTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <RankingSearchBar
        activeTab={activeTab}
        value={activeSearchInput}
        onChange={handleSearchChange}
      />

      <div className="w-full overflow-x-auto">
        {loading ? (
          <RankingTableSkeleton activeTab={activeTab} />
        ) : error ? (
          <RankingErrorState error={error} />
        ) : currentData.length === 0 ? (
          <RankingEmptyState activeTab={activeTab} searchQuery={activeSearchDebounced} />
        ) : (
          <>
            <RankingTable
              activeTab={activeTab}
              data={currentData}
              pagination={currentPagination}
              sortBy={currentSort.sortBy}
              sortOrder={currentSort.sortOrder}
              onSort={handleSort}
              onViewProfile={onViewProfile}
              onViewShip={onViewShip}
            />

            <RankingPagination pagination={currentPagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
