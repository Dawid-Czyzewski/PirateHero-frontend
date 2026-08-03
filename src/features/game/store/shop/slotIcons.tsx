import type { LucideIcon } from 'lucide-react';
import {
  CircleDot,
  Crown,
  FlaskConical,
  Footprints,
  Gem,
  Shield,
  ShieldPlus,
  Shirt,
  Swords,
} from 'lucide-react';
import type { ShopSlotId } from './types';

export const SHOP_SLOT_ICONS: Record<ShopSlotId, LucideIcon> = {
  helmet: Crown,
  weapon: Swords,
  armor: Shirt,
  shield: ShieldPlus,
  gloves: Shield,
  boots: Footprints,
  amulet: Gem,
  ring: CircleDot,
  potions: FlaskConical,
};
