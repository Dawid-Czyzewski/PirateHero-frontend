import { requestJson } from '@/lib/api/requestJson';
import type {
  FightHistoryEntry,
  FightOpponentListItem,
  FightReplayData,
  FightStartSuccessData,
} from '@/types/fight';

const fightService = {
  getOpponents() {
    return requestJson<FightOpponentListItem[]>('/users/fights/opponents', {
      method: 'GET',
    });
  },

  startFight(opponentId: string | number) {
    return requestJson<FightStartSuccessData>('/users/fights/start', {
      method: 'POST',
      body: { opponentId },
    });
  },

  getFightHistory() {
    return requestJson<FightHistoryEntry[]>('/users/fights/history', {
      method: 'GET',
    });
  },

  getFightReplay(fightId: string | number) {
    return requestJson<FightReplayData>(`/users/fights/replay/${encodeURIComponent(String(fightId))}`, {
      method: 'GET',
    });
  },
};

export default fightService;
