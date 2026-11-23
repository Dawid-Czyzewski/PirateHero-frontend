import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";
import { COMBAT_ROUTES } from "@/modules/combat/combatRoutes";

export type GameMenuId = "character" | "training" | "jobs" | "octagon" | "ranking" | "shop";

type MenuEntry = {
  id: GameMenuId;
  label: string;
  icon: string;
  primary: boolean;
};

export type AvailableMenuItem = MenuEntry & { available: true; href: string };

export type ComingSoonMenuItem = MenuEntry & { available: false };

export type GameMenuItem = AvailableMenuItem | ComingSoonMenuItem;

export const GAME_MENU: readonly GameMenuItem[] = [
  { id: "character", label: "Postać", icon: "/icons/menu-character.png", primary: true, available: true, href: CHARACTER_ROUTES.profile },
  { id: "training", label: "Trening", icon: "/icons/menu-training.png", primary: true, available: true, href: CHARACTER_ROUTES.training },
  { id: "jobs", label: "Zlecenia", icon: "/icons/menu-jobs.png", primary: true, available: false },
  { id: "octagon", label: "Oktagon", icon: "/icons/menu-octagon.png", primary: true, available: true, href: COMBAT_ROUTES.octagon },
  { id: "ranking", label: "Ranking", icon: "/icons/menu-ranking.png", primary: false, available: false },
  { id: "shop", label: "Sklep", icon: "/icons/menu-shop.png", primary: false, available: false },
];

export const PRIMARY_MENU = GAME_MENU.filter((item) => item.primary);

export const SECONDARY_MENU = GAME_MENU.filter((item) => !item.primary);

export function isCurrentPage(item: GameMenuItem, pathname: string): boolean {
  return item.available && (pathname === item.href || pathname.startsWith(`${item.href}/`));
}
