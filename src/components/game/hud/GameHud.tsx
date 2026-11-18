"use client";

import { LevelMeter } from "@/components/game/hud/LevelMeter";
import { WalletBar } from "@/components/game/hud/WalletBar";
import { Logo } from "@/components/landing/Logo";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";

const BAR = [
  "sticky top-0 z-50 border-b-2 border-gold/30 bg-[linear-gradient(180deg,#1a0d0c,#0b0606)] shadow-[0_6px_18px_rgb(0_0_0/0.65)]",
  "pt-[env(safe-area-inset-top)]",
].join(" ");

export function GameHud() {
  const { state } = useCharacterSheetSession();

  return (
    <header className={BAR}>
      <div className="mx-auto flex min-h-14 w-full max-w-[88rem] items-center gap-2 px-3 py-1.5 sm:gap-4 sm:px-4">
        <div className="hidden shrink-0 sm:block">
          <Logo />
        </div>
        {state.kind === "loaded" ? (
          <section className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4" aria-label="Twój zawodnik">
            <LevelMeter level={state.character.level} experience={state.character.experience} />
            <WalletBar wallet={state.character.wallet} />
          </section>
        ) : (
          <span className="h-6 flex-1 animate-pulse rounded-sm bg-white/5 motion-reduce:animate-none" aria-hidden="true" />
        )}
      </div>
    </header>
  );
}
