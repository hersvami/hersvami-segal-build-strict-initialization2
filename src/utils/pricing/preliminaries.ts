import type { PricingSourceMeta } from '../../types/domain';

export const DEFAULT_PRELIMINARIES_PERCENT = 10;

export function calculatePreliminaries(tradeCostExGst: number, percent = DEFAULT_PRELIMINARIES_PERCENT) {
  return Math.round(tradeCostExGst * (percent / 100));
}

export function createPreliminariesMeta(percent = DEFAULT_PRELIMINARIES_PERCENT): PricingSourceMeta {
  return {
    source: 'Segal Build preliminaries allowance',
    sourceType: 'manual',
    costType: 'provision',
    baseRate: percent,
    gstIncluded: false,
    preliminariesIncluded: true,
    confidence: 'benchmark_unverified',
    notes: 'Site setup, supervision, scaffolding, temporary works, and insurance allowance.',
  };
}