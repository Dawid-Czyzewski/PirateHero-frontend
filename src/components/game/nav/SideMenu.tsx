import { LogoutButton } from "@/components/game/nav/LogoutButton";
import { MenuList } from "@/components/game/nav/MenuList";
import { GAME_MENU } from "@/modules/game/gameMenu";

export function SideMenu({ pathname }: { pathname: string }) {
  return (
    <nav
      className="fixed inset-y-0 left-0 z-60 hidden w-(--side-menu-w) flex-col gap-2 overflow-y-auto border-r-2 border-gold/30 bg-[linear-gradient(180deg,#1a0d0c,#0b0606_60%)] px-2 py-4 shadow-[6px_0_24px_rgb(0_0_0/0.6)] desk:flex"
      aria-label="Menu gry"
    >
      <MenuList items={GAME_MENU} pathname={pathname} layout="side" className="grid gap-1.5" />
      <div className="mt-auto border-t border-white/10 pt-2">
        <LogoutButton layout="side" />
      </div>
    </nav>
  );
}
