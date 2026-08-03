import type { AvailableWorkDto } from '@/types/gameActivities';

export type FrontendWork = {
  id: string;
  name: string;
  durationLabel: string;
  durationMs: number;
  goldPreview: number;
  bonusPercent: number;
  source: AvailableWorkDto;
};
