"use client";

import { AppearancePanel } from "@/components/character/AppearancePanel";
import { AppearanceTabs } from "@/components/character/AppearanceTabs";
import { CharacterPreview } from "@/components/character/CharacterPreview";
import { CreatorActions } from "@/components/character/CreatorActions";
import { Logo } from "@/components/landing/Logo";
import { useAppearance } from "@/modules/character/hooks/useAppearance";

export function CharacterCreator({ nick }: { nick: string }) {
  const editor = useAppearance();

  return (
    <div className="bg-arena flex min-h-dvh flex-col text-foreground [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-offset-3 [&_:focus-visible]:outline-white">
      <header className="px-4 pt-4 lg:px-8 lg:pt-5">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-5 px-4 pt-2 pb-6 lg:gap-4 lg:px-8 lg:pt-0 lg:pb-8">
        <h1 className="m-0 -rotate-3 text-center font-marker text-[clamp(2.6rem,11vw,3.4rem)] leading-[0.9] font-normal uppercase [text-shadow:0_4px_0_rgb(0_0_0/0.6)] lg:text-[clamp(3.5rem,6vw,5.5rem)]">
          <span className="lg:block">Stwórz</span> <span className="text-blood lg:block">zawodnika</span>
        </h1>
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(18rem,1fr)_minmax(16rem,1.1fr)_minmax(18rem,1fr)] lg:items-center lg:gap-8">
          <AppearancePanel nick={nick} appearance={editor.appearance} step={editor.step} />
          <CharacterPreview />
          <AppearanceTabs
            appearance={editor.appearance}
            activePart={editor.activePart}
            selectPart={editor.selectPart}
            choose={editor.choose}
          />
        </div>
        <CreatorActions onRandomize={editor.randomize} />
      </main>
    </div>
  );
}
