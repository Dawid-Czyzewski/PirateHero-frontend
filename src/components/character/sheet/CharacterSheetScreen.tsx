import { AvatarStage } from "@/components/character/avatar/AvatarStage";
import { CurrencyCard } from "@/components/character/sheet/CurrencyCard";
import { EquipmentCard } from "@/components/character/sheet/EquipmentCard";
import { FighterCard } from "@/components/character/sheet/FighterCard";
import { SHEET_PANEL, WIDE_CARD } from "@/components/character/sheet/sheetLayout";
import { SheetTitle } from "@/components/character/sheet/SheetTitle";
import { StatsCard } from "@/components/character/sheet/StatsCard";
import { WalletBar } from "@/components/character/sheet/WalletBar";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { StageLayout } from "@/components/game/StageLayout";
import { RESOURCES_GROUP, type CharacterSheet } from "@/modules/character/characterSheet";

export function CharacterSheetScreen({ character }: { character: CharacterSheet }) {
  return (
    <GameScreenShell label="Postać">
      <StageLayout
        title={<SheetTitle />}
        stage={<AvatarStage nick={character.nick} appearance={character.appearance} />}
        panelClassName={SHEET_PANEL}
      >
        <div className={WIDE_CARD}>
          <FighterCard
            level={character.level}
            experience={character.experience}
            maxHp={character.maxHp}
            aside={<WalletBar wallet={character.wallet} />}
          />
        </div>
        <StatsCard stats={character.stats} />
        <CurrencyCard group={RESOURCES_GROUP} wallet={character.wallet} />
        <div className={WIDE_CARD}>
          <EquipmentCard />
        </div>
      </StageLayout>
    </GameScreenShell>
  );
}
