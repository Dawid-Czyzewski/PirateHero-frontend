import { ItemSlot } from "@/components/character/equipment/ItemSlot";
import type { EquipmentSlotDefinition } from "@/modules/character/equipment";

type WornSlotsProps = {
  slots: readonly EquipmentSlotDefinition[];
  className: string;
  slotClassName?: string;
};

export function WornSlots({ slots, className, slotClassName }: WornSlotsProps) {
  return (
    <ul className={`m-0 list-none p-0 ${className}`}>
      {slots.map(({ slot, label }) => (
        <ItemSlot key={slot} caption={label} description={`${label}: pusty slot`} className={slotClassName} />
      ))}
    </ul>
  );
}
