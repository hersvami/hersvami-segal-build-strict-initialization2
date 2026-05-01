import { Variation, Scope, TradeScope, BoQItem, TradeCategory } from '../types';
import { tradeCategories } from '../../utils/tradeCategories';
import { getRememberedRate } from './rateMemory';
import { getTradeTemplate } from './tradeTemplates'; // FIX: Added missing import

/**
 * Creates a new trade scope from a category, applying templates, 
 * baseline quantities, and remembered rates.
 */
export const createScopeFromCategory = (
  variation: Variation,
  category: TradeCategory
): TradeScope => {
  const template = getTradeTemplate(category.id);
  
  // 1. Calculate Baseline Quantities
  // FIX: Default to 10m² if no baseline dimensions exist to prevent $0 costs
  const length = variation.baseline?.dimensions?.length || 0;
  const width = variation.baseline?.dimensions?.width || 0;
  const baselineArea = length > 0 && width > 0 ? length * width : 10; 
  
  const baselineVolume = baselineArea * (variation.baseline?.dimensions?.height || 3); // Default height 3m
  
  // 2. Initialize Items from Template or Category Defaults
  let items: BoQItem[] = [];

  if (template && template.items) {
    items = template.items.map(item => {
      if (item.type === 'parametric') {
        // Apply remembered rate if available
        const rememberedRate = getRememberedRate(item.categoryId || '');
        
        return {
          ...item,
          quantity: baselineArea, // Apply calculated area
          rate: rememberedRate ?? item.rate, // Use remembered rate or template rate
          isRateOverridden: !!rememberedRate
        };
      }
      return item;
    });
  } else {
    // Fallback if no template exists
    items = [{
      id: Date.now().toString(),
      type: 'parametric',
      categoryId: category.id,
      name: category.name,
      unit: category.unit,
      quantity: baselineArea,
      rate: category.defaultRate || 0,
      isRateOverridden: false
    }];
  }

  // 3. Construct the Scope
  return {
    id: Date.now().toString(),
    type: 'trade',
    tradeCategoryId: category.id,
    name: category.name,
    status: 'pending',
    boqItems: items,
    notes: '',
    documents: []
  };
};