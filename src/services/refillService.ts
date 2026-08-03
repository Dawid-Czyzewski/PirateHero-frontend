import { requestJson } from '@/lib/api/requestJson';
import { getServiceApiErrorMessage } from '@/lib/apiError';
import type {
  EnergyRefillInfoData,
  EnergyRefillOkData,
  FightRefillInfoData,
  FightRefillOkData,
  TrainingRefillInfoData,
  TrainingRefillOkData,
} from '@/types/refill';

export type RefillResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type EnergyRefillInfoResult = RefillResult<EnergyRefillInfoData>;
export type EnergyRefillExecuteResult = RefillResult<EnergyRefillOkData>;
export type FightRefillInfoResult = RefillResult<FightRefillInfoData>;
export type FightRefillExecuteResult = RefillResult<FightRefillOkData>;
export type TrainingRefillInfoResult = RefillResult<TrainingRefillInfoData>;
export type TrainingRefillExecuteResult = RefillResult<TrainingRefillOkData>;

async function getRefillInfo<T>(
  path: string,
  failureMessage: string,
  logLabel: string
): Promise<RefillResult<T>> {
  try {
    const data = await requestJson<T>(path, { method: 'GET' });
    return { success: true, data };
  } catch (error) {
    console.error(`Error getting ${logLabel}:`, error);
    return {
      success: false,
      error: getServiceApiErrorMessage(error, failureMessage),
    };
  }
}

async function executeRefill<T>(
  path: string,
  failureMessage: string,
  logLabel: string
): Promise<RefillResult<T>> {
  try {
    const data = await requestJson<T>(path, { method: 'POST' });
    return { success: true, data };
  } catch (error) {
    console.error(`Error ${logLabel}:`, error);
    return {
      success: false,
      error: getServiceApiErrorMessage(error, failureMessage),
    };
  }
}

export const getEnergyRefillInfo = (): Promise<EnergyRefillInfoResult> =>
  getRefillInfo<EnergyRefillInfoData>(
    '/users/energy/refill/info',
    'Failed to get energy refill info',
    'energy refill info'
  );

export const refillEnergy = (): Promise<EnergyRefillExecuteResult> =>
  executeRefill<EnergyRefillOkData>(
    '/users/energy/refill',
    'Failed to refill energy',
    'refilling energy'
  );

export const getFightRefillInfo = (): Promise<FightRefillInfoResult> =>
  getRefillInfo<FightRefillInfoData>(
    '/users/fight/refill/info',
    'Failed to get fight refill info',
    'fight refill info'
  );

export const refillFight = (): Promise<FightRefillExecuteResult> =>
  executeRefill<FightRefillOkData>(
    '/users/fight/refill',
    'Failed to refill fight points',
    'refilling fight points'
  );

export const getTrainingRefillInfo = (): Promise<TrainingRefillInfoResult> =>
  getRefillInfo<TrainingRefillInfoData>(
    '/users/training/refill/info',
    'Failed to get training refill info',
    'training refill info'
  );

export const refillTraining = (): Promise<TrainingRefillExecuteResult> =>
  executeRefill<TrainingRefillOkData>(
    '/users/training/refill',
    'Failed to refill training points',
    'refilling training points'
  );
