import { SheetTitle } from "@/components/character/sheet/SheetTitle";
import { SHEET_PANEL, WIDE_CARD } from "@/components/character/sheet/sheetLayout";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { StageLayout } from "@/components/game/StageLayout";

const BLOCK = "fl-card animate-pulse bg-white/5 motion-reduce:animate-none";

const PLACEHOLDERS = [
  { id: "fighter", size: `h-16 ${WIDE_CARD}` },
  { id: "stats", size: "h-52" },
  { id: "wallet", size: "h-52" },
  { id: "equipment", size: `h-36 ${WIDE_CARD}` },
] as const;

export function CharacterSheetSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Wczytujemy zawodnika…</span>
      <GameScreenShell label="Postać">
        <StageLayout title={<SheetTitle />} stage={<div className={`${BLOCK} h-full`} />} panelClassName={SHEET_PANEL}>
          {PLACEHOLDERS.map(({ id, size }) => (
            <div key={id} className={`${BLOCK} ${size}`} aria-hidden="true" />
          ))}
        </StageLayout>
      </GameScreenShell>
    </div>
  );
}
