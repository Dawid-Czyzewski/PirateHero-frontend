export type EquipmentSlot = "gloves" | "shorts" | "shoes" | "accessory";

export type EquipmentSide = "left" | "right";

export type EquipmentSlotDefinition = {
  slot: EquipmentSlot;
  label: string;
  side: EquipmentSide;
};

export type BackpackState = {
  used: number;
  capacity: number;
};

export const EQUIPMENT_SLOTS: readonly EquipmentSlotDefinition[] = [
  { slot: "gloves", label: "Rękawice", side: "left" },
  { slot: "shorts", label: "Spodenki", side: "left" },
  { slot: "shoes", label: "Buty", side: "right" },
  { slot: "accessory", label: "Dodatek", side: "right" },
];

export const EMPTY_BACKPACK: BackpackState = { used: 0, capacity: 6 };

export function slotsOnSide(side: EquipmentSide): readonly EquipmentSlotDefinition[] {
  return EQUIPMENT_SLOTS.filter((definition) => definition.side === side);
}

export function backpackPlaces({ capacity }: BackpackState): readonly number[] {
  return Array.from({ length: capacity }, (_, index) => index + 1);
}
