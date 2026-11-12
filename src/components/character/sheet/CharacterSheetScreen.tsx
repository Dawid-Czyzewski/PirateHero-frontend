import { CharacterPreview } from "@/components/character/CharacterPreview";
import { EquipmentSlots } from "@/components/character/sheet/EquipmentSlots";
import { FighterBadge } from "@/components/character/sheet/FighterBadge";
import { StatList } from "@/components/character/sheet/StatList";
import { WalletList } from "@/components/character/sheet/WalletList";
import { Logo } from "@/components/landing/Logo";
import type { CharacterSheet } from "@/modules/character/characterSheet";

export function CharacterSheetScreen({ character }: { character: CharacterSheet }) {
  return (
    <div className="bg-arena flex min-h-dvh flex-col text-foreground">
      <header className="px-4 pt-4 lg:px-8 lg:pt-5">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-5 px-4 pt-2 pb-8 lg:px-8">
        <h1 className="m-0 -rotate-3 text-center font-marker text-[clamp(2.6rem,11vw,3.4rem)] leading-[0.9] font-normal uppercase [text-shadow:0_4px_0_rgb(0_0_0/0.6)] lg:text-[clamp(3.5rem,6vw,5rem)]">
          Twoja <span className="text-blood">postać</span>
        </h1>
        <div className="grid gap-4 lg:grid-cols-[minmax(17rem,1fr)_minmax(18rem,1.15fr)_minmax(17rem,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-8">
          <FighterBadge nick={character.nick} level={character.level} maxHp={character.maxHp} />
          <div className="grid gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <CharacterPreview appearance={character.appearance} />
            <EquipmentSlots />
          </div>
          <StatList stats={character.stats} className="lg:col-start-1 lg:row-start-2" />
          <WalletList wallet={character.wallet} className="lg:col-start-3 lg:row-span-2 lg:row-start-1" />
        </div>
      </main>
    </div>
  );
}
