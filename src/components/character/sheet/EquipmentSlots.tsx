import { EQUIPMENT_SLOTS } from "@/modules/character/equipment";

export function EquipmentSlots() {
  return (
    <section aria-labelledby="sheet-equipment">
      <h2 className="sr-only" id="sheet-equipment">
        Ekwipunek
      </h2>
      <ul className="m-0 grid list-none grid-cols-4 gap-2.5 p-0 sm:gap-4">
        {EQUIPMENT_SLOTS.map(({ slot, label }) => (
          <li
            key={slot}
            className="grid aspect-square place-content-center rounded-md border-2 border-dashed border-white/30 bg-black/45 p-1 text-center"
          >
            <span className="font-display text-[clamp(0.8rem,3.4vw,1.05rem)] tracking-wide text-ash uppercase">{label}</span>
            <span className="sr-only">: pusty slot</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
