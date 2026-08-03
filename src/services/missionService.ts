import { requestJson } from '@/lib/api/requestJson';
import { getServiceApiErrorMessage } from '@/lib/apiError';
import type { MissionCompleteApiPayload } from '@/types/gameActivities';
import type { GameUser, GameUserLevel } from '@/types/gameUser';

export type { MissionCompleteApiPayload } from '@/types/gameActivities';

type Ok<T> = { ok: true; data: T };
type Fail = { ok: false; message: string };

export async function startGameMission(missionId: number): Promise<Ok<true> | Fail> {
  try {
    await requestJson(`/missions/${missionId}/start`, { method: 'POST' });
    return { ok: true, data: true };
  } catch (error) {
    console.error('startGameMission:', error);
    return {
      ok: false,
      message: getServiceApiErrorMessage(error, 'Unexpected error starting mission.'),
    };
  }
}

export async function cancelGameMission(missionId: number): Promise<Ok<true> | Fail> {
  try {
    await requestJson(`/missions/${missionId}/cancel`, { method: 'POST' });
    return { ok: true, data: true };
  } catch (error) {
    console.error('cancelGameMission:', error);
    return {
      ok: false,
      message: getServiceApiErrorMessage(error, 'Failed to cancel mission'),
    };
  }
}

export async function completeGameMission(
  missionId: number
): Promise<Ok<MissionCompleteApiPayload> | Fail> {
  try {
    const data = await requestJson<MissionCompleteApiPayload>(
      `/missions/${missionId}/complete`,
      { method: 'POST' }
    );
    return { ok: true, data };
  } catch (error) {
    console.error('completeGameMission:', error);
    return {
      ok: false,
      message: getServiceApiErrorMessage(error, 'Unexpected error completing mission.'),
    };
  }
}

export function applyMissionCompleteToUser(
  user: GameUser,
  payload: MissionCompleteApiPayload
): Partial<GameUser> {
  const earnedGold = Number(payload.earnedGold ?? 0);
  const earnedExp = Number(payload.earnedExp ?? 0);
  const totalExp = (user.experiencePoints ?? 0) + earnedExp;
  const nl = payload.newLevel;

  const base: Partial<GameUser> = {
    currentActivity: undefined,
    missions: payload.missions ?? user.missions,
    gold: (user.gold ?? 0) + earnedGold,
  };

  if (nl != null && nl.name != null) {
    const nextExpCap = Number(nl.expToNextLevel ?? user.level?.expToNextLevel ?? 100);
    const prevCap = user.level?.expToNextLevel ?? nextExpCap;
    const excess = totalExp - prevCap;
    return {
      ...base,
      level: {
        name: String(nl.name),
        expToNextLevel: nextExpCap,
      } satisfies GameUserLevel,
      experiencePoints: Math.max(0, excess),
      freeSkillPointsAvailable: (user.freeSkillPointsAvailable ?? 0) + 5,
    };
  }

  return {
    ...base,
    experiencePoints: totalExp,
  };
}
