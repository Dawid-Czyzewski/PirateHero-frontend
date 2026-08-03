import { requestJson } from '@/lib/api/requestJson';
import { normalizeShipRankingEntry } from '@/services/ranking/normalizeShipRankingEntry';
import type {
  ShipsRankingPayload,
  PlayersRankingPayload,
  RankingPagination,
} from '@/types/ranking';

const emptyPagination = (limit: number): RankingPagination => ({
  page: 1,
  limit,
  total: 0,
  totalPages: 0,
});

function rankingSearchQuery(search?: string): string {
  const q = search?.trim();
  if (!q) return '';
  return `&search=${encodeURIComponent(q)}`;
}

export async function fetchPlayersRanking(
  page = 1,
  limit = 20,
  sortBy = 'famePoints',
  sortOrder = 'DESC',
  search?: string
): Promise<PlayersRankingPayload> {
  try {
    return await requestJson<PlayersRankingPayload>(
      `/rankings/players?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${rankingSearchQuery(search)}`,
      { method: 'GET' }
    );
  } catch (error) {
    console.error('Error fetching players ranking:', error);
    return { items: [], pagination: emptyPagination(limit) };
  }
}

export async function fetchShipsRanking(
  page = 1,
  limit = 20,
  sortBy = 'totalFamePoints',
  sortOrder = 'DESC',
  search?: string
): Promise<ShipsRankingPayload> {
  try {
    const raw = await requestJson<ShipsRankingPayload>(
      `/rankings/ships?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${rankingSearchQuery(search)}`,
      { method: 'GET' }
    );
    return {
      ...raw,
      items: (raw.items ?? []).map(normalizeShipRankingEntry),
    };
  } catch (error) {
    console.error('Error fetching ships ranking:', error);
    return { items: [], pagination: emptyPagination(limit) };
  }
}
