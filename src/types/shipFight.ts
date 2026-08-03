export type ShipFightCanStartData = {
  canStart: boolean;
};

export type ShipFightOpponentDto = {
  id: number | string;
  title: string;
  totalFamePoints?: number;
  memberCount?: number;
};

export type ShipFightHistoryEntryDto = {
  id: number | string;
  yourShip?: { id?: number | string; title?: string };
  opponentShip?: { id?: number | string; title?: string };
  result?: 'victory' | 'defeat' | string;
  famePointsChange?: number;
  date?: string;
  wasAttacker?: boolean;
};

export type ShipFightShipSummaryDto = {
  id: number | string;
  title: string;
};

export type ShipFightMemberSummaryDto = {
  id: number | string;
  username: string;
  avatarName?: string | null;
  initialHealth: number;
};

export type ShipFightStartData = {
  result: 'victory' | 'defeat';
  attackerScore: number;
  defenderScore: number;
  viewerFameChange?: number;
  moves: unknown[];
  attackerShip: ShipFightShipSummaryDto;
  defenderShip: ShipFightShipSummaryDto;
  attackerInitialHealth: number;
  defenderInitialHealth: number;
  attackerMembers: ShipFightMemberSummaryDto[];
  defenderMembers: ShipFightMemberSummaryDto[];
};
