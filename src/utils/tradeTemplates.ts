import { BoQItem } from '../types';

interface TradeTemplate {
  id: string;
  items: BoQItem[];
}

const templates: Record<string, TradeTemplate> = {
  demolition: {
    id: 'demolition',
    items: [
      { id: 'demo_1', type: 'parametric', categoryId: 'demolition_skip', name: 'Skip Bin Hire', unit: 'Item', quantity: 1, rate: 450, isRateOverridden: false },
      { id: 'demo_2', type: 'parametric', categoryId: 'earthworks_cut', name: 'Earthworks (Cut)', unit: 'm³', quantity: 10, rate: 45, isRateOverridden: false },
    ],
  },
  concrete: {
    id: 'concrete',
    items: [
      { id: 'conc_1', type: 'parametric', categoryId: 'concrete_slab', name: 'Concrete Slab (100mm)', unit: 'm²', quantity: 50, rate: 150, isRateOverridden: false },
      { id: 'conc_2', type: 'parametric', categoryId: 'concrete_footings', name: 'Concrete Footings', unit: 'm³', quantity: 5, rate: 220, isRateOverridden: false },
    ],
  },
};

export const getTradeTemplate = (tradeId: string): TradeTemplate | undefined => {
  // Simple mapping: if tradeId contains 'demolition', return demolition template, etc.
  if (tradeId.includes('demolition')) return templates.demolition;
  if (tradeId.includes('concrete')) return templates.concrete;
  return undefined;
};