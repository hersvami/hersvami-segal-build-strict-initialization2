/* ─── Segal Build — Baseline Multipliers ─── */
import type { ProjectBaseline } from '../../types/domain';

export type BaselineAdjustment = {
  scaffoldingCost: number;
  accessLabourMultiplier: number;
  accessSurcharge: number;
  totalAdjustment: number;
  notes: string[];
};

const SCAFFOLD_RATE_PER_M2: Record<string, number> = {
  single: 0,
  double: 65,
  multi: 120,
};

const ACCESS_MULTIPLIER: Record<string, number> = {
  easy: 1.0,
  moderate: 1.075,
  difficult: 1.15,
};

export function calcBaselineAdjustment(
  baseline: ProjectBaseline | undefined,
  rawTradeCost: number,
): BaselineAdjustment {
  if (!baseline) {
    return { scaffoldingCost: 0, accessLabourMultiplier: 1, accessSurcharge: 0, totalAdjustment: 0, notes: [] };
  }

  const notes: string[] = [];
  const area = Math.max(baseline.totalAreaM2 || 0, 0);

  const scaffoldRate = SCAFFOLD_RATE_PER_M2[baseline.storeys] ?? 0;
  const scaffoldingCost = Math.round(scaffoldRate * area);
  if (scaffoldingCost > 0) {
    notes.push(`Scaffolding & roof edge protection (${baseline.storeys}-storey × ${area} m² @ $${scaffoldRate}/m²)`);
  }

  const accessLabourMultiplier = ACCESS_MULTIPLIER[baseline.siteAccess] ?? 1;
  const accessSurcharge = Math.round(rawTradeCost * (accessLabourMultiplier - 1));
  if (accessSurcharge > 0) {
    const pct = Math.round((accessLabourMultiplier - 1) * 100);
    notes.push(`Site access surcharge (${baseline.siteAccess}, +${pct}% labour)`);
  }

  return { scaffoldingCost, accessLabourMultiplier, accessSurcharge, totalAdjustment: scaffoldingCost + accessSurcharge, notes };
}

export function describeBaseline(baseline: ProjectBaseline | undefined): string {
  if (!baseline) return 'No baseline set';
  return `${baseline.totalAreaM2} m² • ${baseline.ceilingHeightM}m high • ${baseline.storeys}-storey • ${baseline.siteAccess} access`;
}
