import { ItemSlot } from "@/components/character/equipment/ItemSlot";
import { SheetCard } from "@/components/character/sheet/SheetCard";
import { backpackPlaces, type BackpackState } from "@/modules/character/equipment";

export function BackpackCard({ backpack }: { backpack: BackpackState }) {
  const usage = `${backpack.used}/${backpack.capacity}`;

  return (
    <SheetCard
      id="sheet-backpack"
      title="Plecak"
      aside={
        <p className="m-0 mb-1.5 font-cond text-base font-bold text-gold-light tabular-nums">
          <span aria-hidden="true">{usage}</span>
          <span className="sr-only">
            Zajęte miejsca: {backpack.used} z {backpack.capacity}
          </span>
        </p>
      }
    >
      <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-6 sm:gap-2.5">
        {backpackPlaces(backpack).map((place) => (
          <ItemSlot key={place} description={`Plecak, miejsce ${place}: puste`} />
        ))}
      </ul>
    </SheetCard>
  );
}
