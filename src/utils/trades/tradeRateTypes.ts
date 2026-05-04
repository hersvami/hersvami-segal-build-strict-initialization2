import type { UnitType } from '../categories/types';

export type TradeRateItem = {
  trade: string;
  categoryId: string;
  keywords: string[];
  rate: number;
  unit: UnitType;
  duration: number;
  description: string;
  rateSource?: string;
  rateConfidence?: 'benchmark_unverified' | 'verified' | 'quoted';
  lastReviewed?: string;
};

export const DEFAULT_RATE_SOURCE = 'Benchmark default - not verified against current Victorian trade quotes';
export const DEFAULT_RATE_CONFIDENCE: TradeRateItem['rateConfidence'] = 'benchmark_unverified';
export const DEFAULT_RATE_REVIEW_DATE = '2026-04-29';
