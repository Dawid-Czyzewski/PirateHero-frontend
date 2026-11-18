import { AvatarStage } from "@/components/character/avatar/AvatarStage";
import { BackpackCard } from "@/components/character/equipment/BackpackCard";
import { WornEquipmentOnStage, WornEquipmentRow } from "@/components/character/equipment/WornEquipment";
import { CurrencyCard } from "@/components/character/sheet/CurrencyCard";
import { HealthCard } from "@/components/character/sheet/HealthCard";
import { SHEET_PANEL, WIDE_CARD } from "@/components/character/sheet/sheetLayout";
import { SheetTitle } from "@/components/character/sheet/SheetTitle";
import { StatsCard } from "@/components/character/sheet/StatsCard";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { StageLayout } from "@/components/game/StageLayout";
import { RESOURCES_GROUP, type CharacterSheet } from "@/modules/character/characterSheet";
import { EMPTY_BACKPACK } from "@/modules/character/equipment";

export function CharacterSheetScreen({ character }: { character: CharacterSheet }) {
  return (
    <GameScreenShell>
      <StageLayout
        title={<SheetTitle />}
        stage={
          <AvatarStage
            nick={character.nick}
            appearance={character.appearance}
            overlay={<WornEquipmentOnStage />}
            openTop
          />
        }
        panelClassName={SHEET_PANEL}
      >
        <div className={WIDE_CARD}>
          <WornEquipmentRow />
        </div>
        <div className={WIDE_CARD}>
          <HealthCard maxHp={character.maxHp} />
        </div>
        <StatsCard stats={character.stats} />
        <CurrencyCard group={RESOURCES_GROUP} wallet={character.wallet} />
        <div className={WIDE_CARD}>
          <BackpackCard backpack={EMPTY_BACKPACK} />
        </div>
      </StageLayout>
    </GameScreenShell>
  );
}
