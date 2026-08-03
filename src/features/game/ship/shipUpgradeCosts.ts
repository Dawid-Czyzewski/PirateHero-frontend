import type {
  ShipUpgradeKind,
  ShipUpgradeLevelPriceDto,
  ShipUpgradePricingMatrixDto,
} from '@/types/ship';
import { MAX_HULL_UPGRADE_LEVEL, MAX_UPGRADE_LEVEL } from '@/features/game/ship/shipConstants';

const LEGACY_BASE_GOLD = 150;
const LEGACY_GOLD_STEP = 30;
const LEGACY_BASE_DIAMONDS = 40;
const LEGACY_DIAMONDS_STEP = 20;

export const CLUB_MAX_UPGRADE_LEVEL = MAX_UPGRADE_LEVEL;

function maxForKind(kind: ShipUpgradeKind): number {
  return kind === 'hull' ? MAX_HULL_UPGRADE_LEVEL : CLUB_MAX_UPGRADE_LEVEL;
}

export function legacyRow(level: number, maxLevel: number): ShipUpgradeLevelPriceDto {
  const L = Math.max(1, level);
  const max = Math.max(1, maxLevel);
  const goldOnlyThrough = Math.floor(max / 2);
  return {
    level: L,
    gold: LEGACY_BASE_GOLD + (L - 1) * LEGACY_GOLD_STEP,
    diamonds:
      L <= goldOnlyThrough ? 0 : LEGACY_BASE_DIAMONDS + (L - 1) * LEGACY_DIAMONDS_STEP,
  };
}

function branchLevels(max: number): ShipUpgradeLevelPriceDto[] {
  return Array.from({ length: max }, (_, i) => legacyRow(i + 1, max));
}

export function buildDefaultShipUpgradePricingMatrix(): ShipUpgradePricingMatrixDto {
  return {
    skills: branchLevels(CLUB_MAX_UPGRADE_LEVEL),
    work: branchLevels(CLUB_MAX_UPGRADE_LEVEL),
    missions: branchLevels(CLUB_MAX_UPGRADE_LEVEL),
    hull: branchLevels(MAX_HULL_UPGRADE_LEVEL),
  };
}

export const DEFAULT_SHIP_UPGRADE_PRICING: ShipUpgradePricingMatrixDto =
  buildDefaultShipUpgradePricingMatrix();

function isValidBranch(rows: unknown): rows is ShipUpgradeLevelPriceDto[] {
  return Array.isArray(rows) && rows.length > 0 && rows.every((r) => r && typeof r === 'object');
}

export function normalizeShipUpgradePricingMatrix(
  m?: ShipUpgradePricingMatrixDto | null
): ShipUpgradePricingMatrixDto {
  const d = DEFAULT_SHIP_UPGRADE_PRICING;
  if (!m) {
    return d;
  }
  return {
    skills: isValidBranch(m.skills) ? m.skills : d.skills,
    work: isValidBranch(m.work) ? m.work : d.work,
    missions: isValidBranch(m.missions) ? m.missions : d.missions,
    hull: isValidBranch(m.hull) ? m.hull : d.hull,
  };
}

export function getNextUpgradeCosts(
  kind: ShipUpgradeKind,
  currentLevel: number,
  matrix?: ShipUpgradePricingMatrixDto | null
): { goldCost: number; diamondsCost: number; newLevel: number } {
  const norm = normalizeShipUpgradePricingMatrix(matrix);
  const newLevel = Math.max(0, Math.floor(currentLevel)) + 1;
  const row = norm[kind]?.find((r) => r.level === newLevel);
  if (row) {
    return { goldCost: row.gold, diamondsCost: row.diamonds, newLevel };
  }
  const fb = legacyRow(newLevel, maxForKind(kind));
  return { goldCost: fb.gold, diamondsCost: fb.diamonds, newLevel };
}
