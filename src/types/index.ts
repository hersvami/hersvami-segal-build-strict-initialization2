export * from './domain';
export type { AppState } from './appState';

// Legacy type aliases used by rateMemory.ts and tradeTemplates.ts
export type BoQItem = {
  id: string;
  type: 'parametric' | 'fixed';
  categoryId?: string;
  name: string;
  unit: string;
  quantity: number;
  rate?: number;
  fixedPrice?: number;
  isRateOverridden?: boolean;
};

export type { TradeCategory } from '../utils/tradeCategories';
