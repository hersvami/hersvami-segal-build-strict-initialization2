import type { PricingSourceMeta } from '../../types/domain';

export type PricingMode = 'composite' | 'material_only' | 'labour_only' | 'hire' | 'provision' | 'pc_value';

export type ResolvedBenchmarkRate = {
  rate: number;
  label: string;
  unit: string;
  meta: PricingSourceMeta;
};

export type RawlinsonsMapping = {
  tradeKeywords: string[];
  materialKeywords: string[];
  preferredCostTypes?: PricingMode[];
};
