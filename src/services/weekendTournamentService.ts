import { requestJson } from '@/lib/api/requestJson';

export type WeekendTournamentLeaderboardEntry = {
  rank: number;
  userId: string | null;
  username: string | null;
  points: number;
};

export type WeekendTournamentStatus = {
  active: boolean;
  eventStart: string;
  eventEnd: string;
  points: number;
  rank: number | null;
  rewardClaimed: boolean;
  canClaim: boolean;
  minPointsToClaim: number;
  rewards: { gold: number; diamonds: number; band: string };
  leaderboard: WeekendTournamentLeaderboardEntry[];
  unclaimedCount: number;
};

export type WeekendTournamentClaimResult = {
  rank: number | null;
  rewards: { gold: number; diamonds: number; band: string };
  titleGranted: boolean;
  titleCode: string | null;
  updatedUser: {
    gold: number;
    diamonds: number;
    experiencePoints: number;
    freeSkillPointsAvailable: number;
    level: { name: string; expToNextLevel: number };
  };
  status: WeekendTournamentStatus;
};

export async function fetchWeekendTournament(): Promise<WeekendTournamentStatus> {
  return requestJson<WeekendTournamentStatus>('/users/weekend-tournament/status', { method: 'GET' });
}

export async function claimWeekendTournament(): Promise<WeekendTournamentClaimResult> {
  return requestJson<WeekendTournamentClaimResult>('/users/weekend-tournament/claim', {
    method: 'POST',
  });
}
