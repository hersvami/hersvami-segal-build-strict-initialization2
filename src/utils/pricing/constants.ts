/* ─── Segal Build — Pricing Constants ─── */
import type { SolutionTemplate, StageTemplate } from './types';

export const TRADE_MARKERS = [
  'Demo', 'Carpentry', 'Plumbing', 'Electrical', 'Tiling', 'Painting',
  'Plastering', 'Waterproofing', 'Cabinetry', 'Flooring', 'Glass',
  'Roofing', 'Landscaping', 'Concreting', 'Structural',
] as const;

export const DEFAULT_OH = 12;
export const DEFAULT_PROFIT = 15;
export const GST_RATE = 0.10;

export const CONTINGENCY_BY_TYPE: Record<string, number> = {
  renovation: 10,
  new_build: 5,
  extension: 8,
  structural: 15,
  maintenance: 5,
  default: 10,
};

export function fixedCostTrades(): string[] {
  return ['Demo', 'Electrical rough-in', 'Plumbing rough-in'];
}

export const DEFAULT_SOLUTIONS: SolutionTemplate[] = [
  { name: 'Essential', description: 'Quality standard materials', multiplier: 1.0, stages: [] },
  { name: 'Standard', description: 'Mid-range premium materials', multiplier: 1.3, stages: [] },
  { name: 'Premium', description: 'High-end designer materials', multiplier: 1.7, stages: [] },
];

export const createStage = (
  name: string, trade: string, rate: number,
  unit: StageTemplate['unit'], duration: number, description: string,
): StageTemplate => ({ name, trade, rate, unit, duration, description });
