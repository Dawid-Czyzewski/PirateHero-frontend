import type { ReactNode } from "react";
import { GameNav } from "@/components/game/nav/GameNav";

export default function GameMenuLayout({ children }: { children: ReactNode }) {
  return (
    <div className="[--side-menu-w:8rem] pb-[calc(4.5rem+env(safe-area-inset-bottom))] desk:pb-0 desk:pl-(--side-menu-w)">
      {children}
      <GameNav />
    </div>
  );
}
