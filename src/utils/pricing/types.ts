/* ─── Segal Build — Pricing Engine Types ─── */

export type UnitType = 'area' | 'linear' | 'item' | 'allow';

export type StageTemplate = {
  name: string;
  trade: string;
  rate: number;
  unit: UnitType;
  duration: number;
  description: string;
};

export type SolutionTemplate = {
  name: string;
  description: string;
  multiplier: number;
  stages: StageTemplate[];
};
