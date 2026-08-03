import type { TFunction } from 'i18next';
import { ArrowUp, MessageSquare, ScrollText, StickyNote, Swords, Users } from 'lucide-react';
import type { ShipTabItem } from '@/features/game/ship/shipTypes';

export function buildPublicShipPreviewTabs(t: TFunction): ShipTabItem[] {
  return [
    { id: 'crew', label: t('shipPage.tabs.crew'), icon: Users },
    { id: 'upgrades', label: t('shipPage.tabs.upgrades'), icon: ArrowUp },
    { id: 'description', label: t('shipPage.tabs.description'), icon: ScrollText },
  ];
}

export const buildShipTabs = (t: TFunction): ShipTabItem[] => [
  { id: 'crew', label: t('shipPage.tabs.crew'), icon: Users },
  { id: 'upgrades', label: t('shipPage.tabs.upgrades'), icon: ArrowUp },
  { id: 'battles', label: t('shipPage.tabs.battles'), icon: Swords },
  { id: 'notes', label: t('shipPage.tabs.notes'), icon: StickyNote },
  { id: 'chat', label: t('shipPage.tabs.chat'), icon: MessageSquare },
];
