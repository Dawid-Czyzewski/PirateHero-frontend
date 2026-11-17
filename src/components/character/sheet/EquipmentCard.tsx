import Image from "next/image";
import { SheetCard } from "@/components/character/sheet/SheetCard";
import { EQUIPMENT_SLOTS } from "@/modules/character/equipment";
import { EQUIPMENT_SLOT_SRC } from "@/modules/character/layerAssets";

export function EquipmentCard() {
  return (
    <SheetCard id="sheet-equipment" title="Ekwipunek">
      <ul className="m-0 grid list-none grid-cols-4 gap-2 p-0">
        {EQUIPMENT_SLOTS.map(({ slot, label }) => (
          <li key={slot} className="grid min-w-0 justify-items-center gap-1 text-center">
            <span className="relative block aspect-square w-full max-w-24">
              <Image src={EQUIPMENT_SLOT_SRC} alt="" fill sizes="96px" className="object-contain opacity-80" />
            </span>
            <span className="font-cond text-[clamp(0.7rem,3vw,0.9rem)] leading-tight font-bold tracking-[.03em] text-ash uppercase">
              {label}
              <span className="sr-only">: pusty slot</span>
            </span>
          </li>
        ))}
      </ul>
    </SheetCard>
  );
}
