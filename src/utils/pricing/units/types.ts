export type PhaseKey = 'preparation' | 'structure' | 'services' | 'finishes' | 'external';
export type UnitMeasure = 'each' | 'lm' | 'm2' | 'allow';

export type ParametricUnit = {
  id: string;
  categoryId: string;
  label: string;
  description: string;
  unit: UnitMeasure;
  rate: number;
  trade: string;
  defaultQty?: number;
  complianceRef?: string;
  phase?: PhaseKey;
  rateSource?: string;
  rateConfidence?: 'benchmark_unverified' | 'verified' | 'quoted';
  lastReviewed?: string;
};

const DEFAULT_UNIT_RATE_SOURCE = 'Benchmark default - verify with current Victorian supplier/subcontractor pricing';
const DEFAULT_UNIT_RATE_CONFIDENCE: ParametricUnit['rateConfidence'] = 'benchmark_unverified';
const DEFAULT_UNIT_REVIEW_DATE = '2026-04-29';

export function unit(
  id: string, categoryId: string, label: string, description: string,
  measure: UnitMeasure, rate: number, trade: string, defaultQty: number, phase: PhaseKey,
): ParametricUnit {
  return {
    id, categoryId, label, description, unit: measure, rate, trade, defaultQty, phase,
    rateSource: DEFAULT_UNIT_RATE_SOURCE, rateConfidence: DEFAULT_UNIT_RATE_CONFIDENCE, lastReviewed: DEFAULT_UNIT_REVIEW_DATE,
  };
}
