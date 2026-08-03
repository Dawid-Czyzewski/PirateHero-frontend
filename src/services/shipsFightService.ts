import { requestJson } from '@/lib/api/requestJson';
import type {
  ShipFightCanStartData,
  ShipFightHistoryEntryDto,
  ShipFightOpponentDto,
  ShipFightStartData,
} from '@/types/shipFight';

const shipsFightService = {
  getOpponents() {
    return requestJson<ShipFightOpponentDto[]>('/ships/fights/opponents', { method: 'GET' });
  },

  canStartFight() {
    return requestJson<ShipFightCanStartData>('/ships/fights/can-start', {
      method: 'GET',
    });
  },

  startFight(opponentShipId: string | number) {
    return requestJson<ShipFightStartData>('/ships/fights/start', {
      method: 'POST',
      body: { opponentShipId },
    });
  },

  getFightHistory() {
    return requestJson<ShipFightHistoryEntryDto[]>('/ships/fights/history', { method: 'GET' });
  },

  getFightDetails(fightId: string | number) {
    return requestJson<ShipFightStartData>(`/ships/fights/${fightId}`, {
      method: 'GET',
    });
  },
};

export default shipsFightService;
