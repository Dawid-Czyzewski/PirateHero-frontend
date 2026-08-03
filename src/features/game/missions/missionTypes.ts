export type FrontendMission = {
  id: string;
  name: string;
  description: string;
  durationLabel: string;
  durationMs: number;
  xp: number;
  gold: number;
  energy: number;
};

export type ActiveMissionState = {
  mission: FrontendMission;
  startedAtMs: number;
};
