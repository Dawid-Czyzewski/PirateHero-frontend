import type { LucideIcon } from 'lucide-react';
import type { ShipUpgradePricingMatrixDto } from '@/types/ship';

export interface Member {
  userId: string;
  name: string;
  avatarName?: string;
  level: number;
  role: 'OWNER' | 'MANAGER' | 'MEMBER';
  goldContributed: number;
  diamondsContributed: number;
}

export interface ShipData {
  shipId: string;
  currentUserId: string;
  requiresInvitation: boolean;
  name: string;
  description: string;
  internalNotes: string;
  fame: number;
  gold: number;
  diamonds: number;
  members: Member[];
  upgrades: Record<string, number>;
  maxMembers: number;
  upgradePricing: ShipUpgradePricingMatrixDto;
}

export type ChatMessageKind = 'user' | 'system';

export interface ChatMsg {
  id: string;
  kind: ChatMessageKind;
  author: string;
  text: string;
  time: string;
  createdAtMs: number;
  authorUserId?: string;
  pending?: boolean;
  isOwn?: boolean;
}

export interface EnemyShip {
  shipId: string;
  name: string;
  fame: number;
  members: number;
}

export interface ShipBattleHistoryEntry {
  id: string;
  at: string;
  enemyName: string;
  result: 'win' | 'loss';
  fameDelta: number;
}

export type ShipTab = 'crew' | 'upgrades' | 'description' | 'battles' | 'notes' | 'chat';
export type ShipTabItem = { id: ShipTab; label: string; icon: LucideIcon };
