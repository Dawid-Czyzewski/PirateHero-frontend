export type TrainingRefillInfoData = {
  canRefill: boolean;
  refillsRemaining: number;
  refillsUsed: number;
  nextRefillCost: number;
  currentTrainingPoints: number;
  maxTrainingPoints: number;
  hasActiveTraining: boolean;
};

export type TrainingRefillOkData = {
  success: boolean;
  newTrainingPoints: number;
  newGold: number;
  refillsUsed: number;
  refillsRemaining: number;
  cost: number;
};

export type EnergyRefillInfoData = {
  canRefill: boolean;
  refillsRemaining: number;
  refillsUsed: number;
  nextRefillCost: number;
  currentEnergy: number;
  maxEnergy: number;
  hasActiveMission: boolean;
};

export type EnergyRefillOkData = {
  success: boolean;
  newEnergy: number;
  newGold: number;
  refillsUsed: number;
  refillsRemaining: number;
  cost: number;
};

export type FightRefillInfoData = {
  canRefill: boolean;
  refillsRemaining: number;
  refillsUsed: number;
  maxDailyRefills?: number;
  nextRefillCost: number;
  currentFightPoints: number;
  maxFightPoints: number;
  hasActiveFight: boolean;
};


export type FightRefillOkData = {
  success: boolean;
  newFightPoints: number;
  newGold: number;
  refillsUsed: number;
  refillsRemaining: number;
  maxDailyRefills?: number;
  cost: number;
};
