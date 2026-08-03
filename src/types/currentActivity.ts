export type ActiveMissionDto = {
  id?: string | number;
  title?: string;
  goldReward?: number;
  expReward?: number;
  durationInSeconds?: number;
  energyCost?: number;
  bonusPercent?: number;
};

export type ActiveWorkDto = {
  id?: string | number;
  hoursCount?: number;
};

export type ActiveTrainingDto = {
  id?: string | number;
  title?: string;
  description?: string;
  statType?: string | null;
  durationInSeconds?: number;
  skillPointsReward?: number;
  trainingPointsCost?: number;
};

export type CurrentActivityDto = {
  startTime?: string;
  mission?: ActiveMissionDto;
  work?: ActiveWorkDto;
  training?: ActiveTrainingDto;
};
