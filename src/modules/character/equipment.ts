export type EquipmentSlot = "gloves" | "shorts" | "shoes" | "accessory";

export const EQUIPMENT_SLOTS: readonly { slot: EquipmentSlot; label: string }[] = [
  { slot: "gloves", label: "Rękawice" },
  { slot: "shorts", label: "Spodenki" },
  { slot: "shoes", label: "Buty" },
  { slot: "accessory", label: "Dodatek" },
];
