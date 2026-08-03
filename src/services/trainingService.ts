import { requestJson } from '@/lib/api/requestJson';
import type { AvailableTrainingListItemDto } from '@/types/gameActivities';
import type { GameUser, GameUserBaseStatistics } from '@/types/gameUser';

export type TrainingDto = {
  id?: string | number;
  trainingPointsCost?: number;
  skillPointsReward?: number;
  statType?: string;
  title?: string;
  description?: string;
  durationInSeconds?: number;
};

type UpdateUserFn = (patch: Partial<GameUser>) => void | Promise<unknown>;

type TrainingSyncOptions = {
  fetchUserData?: () => void | Promise<unknown>;
  onRequestFailed?: () => void;
};

type BaseStatKey = keyof Pick<
  GameUserBaseStatistics,
  'strength' | 'agility' | 'intelligence' | 'endurance' | 'luck'
>;

const STAT_TYPE_TO_BASE_KEY: Record<string, BaseStatKey> = {
  STRENGTH: 'strength',
  AGILITY: 'agility',
  INTELLIGENCE: 'intelligence',
  ENDURANCE: 'endurance',
  LUCK: 'luck',
  CRITICAL_CHANCE: 'intelligence',
  HEALTH: 'endurance',
};

function resolveBaseStatKey(statType: string | null | undefined): BaseStatKey | null {
  if (!statType) {
    return null;
  }
  return STAT_TYPE_TO_BASE_KEY[statType] ?? null;
}

export const startTraining = (
  training: TrainingDto,
  user: GameUser,
  updateUser: UpdateUserFn,
  options?: TrainingSyncOptions
): { success: boolean; message?: string } => {
  const cost = Number(training.trainingPointsCost ?? 0);
  const tp = Number(user.trainingPoints ?? 0);
  if (tp < cost) {
    return {
      success: false,
      message: 'Not enough training points to start this training.',
    };
  }

  const rollback = {
    trainingPoints: user.trainingPoints,
    currentActivity: user.currentActivity,
  };

  void updateUser({
    trainingPoints: Math.max(0, tp - cost),
    currentActivity: {
      training: { ...training },
      startTime: new Date().toISOString(),
    },
  });

  void (async () => {
    try {
      await requestJson(`/trainings/${training.id}/start`, { method: 'POST' });
      void options?.fetchUserData?.();
    } catch (error) {
      console.error('Unexpected error starting training:', error);
      await updateUser({
        trainingPoints: rollback.trainingPoints,
        currentActivity: rollback.currentActivity,
      });
      options?.onRequestFailed?.();
    }
  })();

  return { success: true, message: 'Training started!' };
};

export const cancelTraining = (
  training: TrainingDto,
  user: GameUser,
  updateUser: UpdateUserFn,
  options?: TrainingSyncOptions
): { success: boolean; message?: string } => {
  const refund = Number(
    training?.trainingPointsCost ?? user.currentActivity?.training?.trainingPointsCost ?? 0
  );

  const rollback = {
    trainingPoints: user.trainingPoints,
    currentActivity: user.currentActivity,
  };

  void updateUser({
    trainingPoints: Number(user.trainingPoints ?? 0) + refund,
    currentActivity: null,
  });

  void (async () => {
    try {
      await requestJson(`/trainings/${training.id}/cancel`, { method: 'POST' });
      void options?.fetchUserData?.();
    } catch (error) {
      console.error('Cancel training error:', error);
      await updateUser({
        trainingPoints: rollback.trainingPoints,
        currentActivity: rollback.currentActivity,
      });
      options?.onRequestFailed?.();
    }
  })();

  return { success: true };
};

export type TrainingClaimRollback = Pick<GameUser, 'currentActivity' | 'userBaseStatistics' | 'trainings'>;

export function buildTrainingClaimOptimisticPatch(
  user: GameUser,
  training: TrainingDto
): { rollback: TrainingClaimRollback; optimisticPatch: Partial<GameUser> } {
  const reward = Number(training?.skillPointsReward ?? 0);
  const statKey = resolveBaseStatKey(training?.statType);

  const currentStats: GameUserBaseStatistics = {
    ...(user.userBaseStatistics ?? {}),
  };

  if (statKey) {
    const currentValue = Number(currentStats[statKey] ?? 0);
    currentStats[statKey] = currentValue + reward;
  } else {
    console.warn(
      'Unknown statType for training, no stat will be increased:',
      training?.statType
    );
  }

  return {
    rollback: {
      currentActivity: user.currentActivity,
      userBaseStatistics: user.userBaseStatistics,
      trainings: user.trainings,
    },
    optimisticPatch: {
      currentActivity: null,
      userBaseStatistics: currentStats,
      trainings: [],
    },
  };
}

export async function requestTrainingComplete(
  trainingId: string | number
): Promise<AvailableTrainingListItemDto[]> {
  const data = await requestJson<{ trainings?: AvailableTrainingListItemDto[] }>(
    `/trainings/${trainingId}/complete`,
    { method: 'POST' }
  );
  return data?.trainings ?? [];
}
