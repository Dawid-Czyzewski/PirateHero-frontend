import { AvatarStage } from "@/components/character/avatar/AvatarStage";
import { CurrencyCard } from "@/components/character/sheet/CurrencyCard";
import { EquipmentCard } from "@/components/character/sheet/EquipmentCard";
import { FighterCard } from "@/components/character/sheet/FighterCard";
import { SheetTitle } from "@/components/character/sheet/SheetTitle";
import { StatsCard } from "@/components/character/sheet/StatsCard";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { StageLayout } from "@/components/game/StageLayout";
import { CURRENCY_GROUPS, type CharacterSheet } from "@/modules/character/characterSheet";
import { SHEET_PANEL, WIDE_CARD } from "@/components/character/sheet/sheetLayout";

export function CharacterSheetScreen({ character }: { character: CharacterSheet }) {
  return (
    <GameScreenShell label="Postać">
      <StageLayout
        title={<SheetTitle />}
        stage={<AvatarStage nick={character.nick} appearance={character.appearance} />}
        panelClassName={SHEET_PANEL}
      >
        <div className={WIDE_CARD}>
          <FighterCard level={character.level} experience={character.experience} maxHp={character.maxHp} />
        </div>
        <StatsCard stats={character.stats} />
        <div className="grid gap-3">
          {CURRENCY_GROUPS.map((group) => (
            <CurrencyCard key={group.id} group={group} wallet={character.wallet} />
          ))}
        </div>
        <div className={WIDE_CARD}>
          <EquipmentCard />
        </div>
      </StageLayout>
    </GameScreenShell>
  );
}
