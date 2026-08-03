import type { LucideIcon } from 'lucide-react';

export type GameSidebarItem = {
  key: string;
  title: string;
  url: string;
  icon: LucideIcon;
  notify: number;
  disabled: boolean;
  disabledReasonKey: string | null;
};
