import type { ReactNode } from "react";
import { GameHud } from "@/components/game/hud/GameHud";
import { GameNav } from "@/components/game/nav/GameNav";
import { CharacterSheetProvider } from "@/modules/character/hooks/CharacterSheetContext";

export default function GameMenuLayout({ children }: { children: ReactNode }) {
  return (
    <CharacterSheetProvider>
      <div className="[--side-menu-w:8rem] pb-[calc(4.5rem+env(safe-area-inset-bottom))] desk:pb-0 desk:pl-(--side-menu-w)">
        <GameHud />
        {children}
        <GameNav />
      </div>
    </CharacterSheetProvider>
  );
}
