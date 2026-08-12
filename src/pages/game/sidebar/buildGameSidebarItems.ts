import {
  Bell,
  CircleDot,
  Coins,
  Dumbbell,
  Skull,
  ScrollText,
  Shield,
  Gem,
  ShoppingBag,
  Sparkles,
  Swords,
  Target,
  TicketPercent,
  Trophy,
  User,
} from 'lucide-react';
import type { TFunction } from 'i18next';
import type { GameNavKey } from '@/features/game/navigation/gameNavActivityPolicy';
import { getNavItemActivityState } from '@/features/game/navigation/gameNavActivityPolicy';
import type { GameSidebarItem } from './gameSidebarTypes';

type BuildItemsArgs = {
  t: TFunction;
  isInMission: boolean;
  isInWork: boolean;
  isInTraining: boolean;
  unclaimedRewardsCount: number;
  dailyChallengesUnclaimedCount: number;
  unreadNotificationsCount: number;
};

function sidebarTitle(t: TFunction, key: GameNavKey): string {
  switch (key) {
    case 'fights':
      return t('arena');
    case 'dungeons':
      return t('dungeons');
    case 'statek':
      return t('statek');
    case 'rzut-moneta':
      return t('rzutMoneta');
    case 'premium-shop':
      return t('premiumShop');
    default:
      return t(key);
  }
}

const ROWS: {
  key: GameNavKey;
  icon: GameSidebarItem['icon'];
  notify: (args: BuildItemsArgs) => number;
}[] = [
  { key: 'character', icon: User, notify: () => 0 },
  { key: 'missions', icon: ScrollText, notify: () => 0 },
  { key: 'training', icon: Dumbbell, notify: () => 0 },
  { key: 'works', icon: Coins, notify: () => 0 },
  { key: 'store', icon: ShoppingBag, notify: () => 0 },
  { key: 'fights', icon: Swords, notify: () => 0 },
  { key: 'boosters', icon: Sparkles, notify: () => 0 },
  { key: 'statek', icon: Shield, notify: () => 0 },
  { key: 'coupons', icon: TicketPercent, notify: () => 0 },
  { key: 'rzut-moneta', icon: CircleDot, notify: () => 0 },
  { key: 'ranking', icon: Trophy, notify: () => 0 },
  { key: 'notifications', icon: Bell, notify: ({ unreadNotificationsCount }) => unreadNotificationsCount },
  { key: 'dungeons', icon: Skull, notify: () => 0 },
  { key: 'questTasks', icon: ScrollText, notify: ({ unclaimedRewardsCount }) => unclaimedRewardsCount },
  { key: 'dailyChallenges', icon: Target, notify: ({ dailyChallengesUnclaimedCount }) => dailyChallengesUnclaimedCount },
  { key: 'premium-shop', icon: Gem, notify: () => 0 },
];

export function buildGameSidebarItems(args: BuildItemsArgs): GameSidebarItem[] {
  const flags = {
    isInMission: args.isInMission,
    isInWork: args.isInWork,
    isInTraining: args.isInTraining,
  };

  return ROWS.map((row) => {
    const { disabled, reasonKey } = getNavItemActivityState(row.key, flags);
    return {
      key: row.key,
      title: sidebarTitle(args.t, row.key),
      url: `/game/${row.key}`,
      icon: row.icon,
      notify: row.notify(args),
      disabled,
      disabledReasonKey: reasonKey,
    };
  });
}
