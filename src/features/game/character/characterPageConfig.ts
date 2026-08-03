import { Clover, Heart, Shield, Sword, Zap } from 'lucide-react';
import type { ItemStats } from './characterTypes';

export const BASE_STATS: Required<ItemStats> = {
  strength: 20,
  agility: 15,
  endurance: 25,
  intelligence: 10,
  luck: 8,
};

export const statIcons = {
  strength: Sword,
  agility: Zap,
  endurance: Heart,
  intelligence: Shield,
  luck: Clover,
} as const;

export const statColors = {
  strength: 'text-red-400',
  agility: 'text-yellow-400',
  endurance: 'text-pink-400',
  intelligence: 'text-blue-400',
  luck: 'text-green-400',
} as const;
