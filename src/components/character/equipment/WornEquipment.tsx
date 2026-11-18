import { SheetCard } from "@/components/character/sheet/SheetCard";
import { WornSlots } from "@/components/character/equipment/WornSlots";
import { EQUIPMENT_SLOTS, slotsOnSide } from "@/modules/character/equipment";

const TITLE = "Założony ekwipunek";

const SIDE_COLUMN = "pointer-events-auto grid w-[clamp(4.5rem,7vw,6rem)] gap-3 rounded-lg bg-black/45 p-1.5 backdrop-blur-[2px]";

export function WornEquipmentOnStage() {
  return (
    <section
      className="pointer-events-none absolute inset-x-3 top-1/2 z-4 hidden -translate-y-1/2 justify-between desk:flex"
      aria-label={TITLE}
    >
      <WornSlots slots={slotsOnSide("left")} className={SIDE_COLUMN} />
      <WornSlots slots={slotsOnSide("right")} className={SIDE_COLUMN} />
    </section>
  );
}

export function WornEquipmentRow() {
  return (
    <div className="desk:hidden">
      <SheetCard id="sheet-worn" title={TITLE}>
        <WornSlots slots={EQUIPMENT_SLOTS} className="grid grid-cols-4 gap-2" slotClassName="max-w-24 justify-self-center" />
      </SheetCard>
    </div>
  );
}
