"use client";

import { CreationStatusLine } from "@/components/character/CreationStatusLine";
import { CreatorActions } from "@/components/character/CreatorActions";
import { AppearancePicker } from "@/components/character/creator/AppearancePicker";
import { CreatorStage } from "@/components/character/creator/CreatorStage";
import { StartingStats } from "@/components/character/creator/StartingStats";
import { Logo } from "@/components/landing/Logo";
import { useAppearance } from "@/modules/character/hooks/useAppearance";
import { useCharacterCreation } from "@/modules/character/hooks/useCharacterCreation";

export function CharacterCreator({ nick }: { nick: string }) {
  const editor = useAppearance();
  const creation = useCharacterCreation();

  return (
    <div className="bg-arena flex min-h-dvh flex-col font-semi text-[#f6f4f1] [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-offset-3 [&_:focus-visible]:outline-white">
      <header className="px-4 pt-4 lg:px-8 lg:pt-5">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-4 px-4 pt-1 lg:gap-5 lg:px-8 lg:pb-8">
        <h1 className="m-0 -rotate-2 text-center font-cond text-[clamp(2.5rem,11vw,3.4rem)] leading-[0.9] font-bold tracking-[.02em] text-[#f3eadb] uppercase italic [text-shadow:0_3px_0_#000,0_0_18px_rgb(0_0_0/0.8)] lg:text-[clamp(3.4rem,5vw,4.8rem)]">
          Stwórz <span className="text-blood">zawodnika</span>
        </h1>
        <div className="grid flex-1 gap-4 rounded-xl border-2 border-blood/35 bg-black/35 p-3 shadow-[0_0_40px_rgb(225_25_45/0.18)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-6 lg:p-5">
          <CreatorStage nick={nick} appearance={editor.appearance} rolls={editor.rolls} />
          <div className="flex flex-col gap-4">
            <AppearancePicker
              appearance={editor.appearance}
              activePart={editor.activePart}
              selectPart={editor.selectPart}
              choose={editor.choose}
              errors={creation.errors}
            />
            <StartingStats />
            <CreationStatusLine status={creation.status} onRetry={() => void creation.submit(editor.appearance)} />
            <CreatorActions
              creating={creation.submitting}
              onRandomize={editor.randomize}
              onCreate={() => void creation.submit(editor.appearance)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
