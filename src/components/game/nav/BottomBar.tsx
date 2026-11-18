"use client";

import { useState, type KeyboardEvent } from "react";
import { LogoutButton } from "@/components/game/nav/LogoutButton";
import { MenuList } from "@/components/game/nav/MenuList";
import { ENTRY, FOCUS_RING, IDLE, LABEL } from "@/components/game/nav/navStyles";
import { PRIMARY_MENU, SECONDARY_MENU } from "@/modules/game/gameMenu";

const MORE_PANEL_ID = "game-menu-more";

function MoreIcon() {
  return (
    <svg className="size-8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5" cy="12" r="2.2" fill="currentColor" />
      <circle cx="12" cy="12" r="2.2" fill="var(--color-gold)" />
      <circle cx="19" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function BottomBar({ pathname }: { pathname: string }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const closeOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") setMoreOpen(false);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-60 border-t-2 border-gold/30 bg-[linear-gradient(0deg,#0b0606,#1a0d0c)] px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgb(0_0_0/0.6)] desk:hidden"
      aria-label="Menu gry"
      onKeyDown={closeOnEscape}
    >
      {moreOpen ? (
        <div
          id={MORE_PANEL_ID}
          className="absolute right-2 bottom-full mb-2 grid w-48 gap-1 rounded-lg border-2 border-gold/40 bg-coal p-2 shadow-[0_8px_24px_rgb(0_0_0/0.8)]"
        >
          <MenuList items={SECONDARY_MENU} pathname={pathname} layout="bar" className="grid grid-cols-2 gap-1" />
          <div className="border-t border-white/10 pt-1">
            <LogoutButton layout="bar" />
          </div>
        </div>
      ) : null}
      <div className="mx-auto grid max-w-[40rem] grid-cols-5 gap-0.5 py-1">
        <MenuList items={PRIMARY_MENU} pathname={pathname} layout="bar" className="col-span-4 grid grid-cols-4 gap-0.5" />
        <button
          type="button"
          className={`${ENTRY.bar} ${IDLE} ${FOCUS_RING} cursor-pointer border-0 bg-transparent`}
          aria-expanded={moreOpen}
          aria-controls={MORE_PANEL_ID}
          onClick={() => setMoreOpen((open) => !open)}
        >
          <MoreIcon />
          <span className={LABEL.bar}>Więcej</span>
        </button>
      </div>
    </nav>
  );
}
