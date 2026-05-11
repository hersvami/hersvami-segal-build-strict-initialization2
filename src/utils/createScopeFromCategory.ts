import type { ProjectBaseline, QuoteScope, ParametricItem } from '../types/domain';
import type { TradeAnalysis } from './ai/tradeAnalyser';
import { getCategoryById } from './categories/extended';
import type { WorkCategory } from './categories/types';
import { generateId } from './helpers';
import { getDefaultPCItems, getDefaultInclusions, getDefaultExclusions } from './pricing/quoteDefaults';
import { resolveBenchmarkRate } from './pricing/rawlinsonsBenchmarkResolver';
import { deriveScopeDimensions, syncScopePricing } from '../components/variationBuilder/scopePricing';
import { generateDynamicBOQ } from './modules/dynamicBOQEngine';
import { MODULE_CONFIGS } from './modules/moduleConfigs';

export function createScopeFromCategory(
  categoryId: string,
  scopeInput: string,
  tradeAnalysis: TradeAnalysis | undefined,
  baseline: ProjectBaseline,
): QuoteScope | null {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  const dimensions = deriveScopeDimensions(categoryId, baseline);
  
  // NEW: Check if we have specific module config (e.g. Decking)
  const moduleConfig = MODULE_CONFIGS[baseline.moduleType as keyof typeof MODULE_CONFIGS];
  let parametricItems: ParametricItem[] = [];
  let description = '';

  if (moduleConfig && baseline.moduleType !== 'generic') {
    // Use the Smart Engine
    // Note: In a real flow, 'scopeInput' here would actually be the JSON string of wizard answers
    // For now, we parse it or use defaults if empty
    let wizardData = {};
    try {
      if (scopeInput.startsWith('{')) wizardData = JSON.parse(scopeInput);
    } catch {}
    
    const boq = generateDynamicBOQ(baseline.moduleType, wizardData, baseline);
    
    // Convert BOQ items to ParametricItems
    parametricItems = boq.items.map(item => ({
      ...item,
      pricingSource: resolveBenchmarkRate(categoryId, item.label, item.unit)?.meta
    }));

    description = `${category.label}: ${moduleConfig.label} configuration.\n` + 
                  (boq.notes.length > 0 ? `Notes: ${boq.notes.join('; ')}` : '');
    
    if (boq.warnings.length > 0) {
      description += `\n⚠️ Warnings: ${boq.warnings.join('; ')}`;
    }

  } else {
    // Fallback to AI/Manual logic for generic or non-configured modules
    parametricItems = (tradeAnalysis?.items || []).map((item) => ({
      id: generateId(),
      unitId: item.unitId,
      label: item.label,
      unit: item.unit as 'each' | 'lm' | 'm2' | 'allow',
      rate: item.rate,
      quantity: item.quantity,
      pricingSource: resolveBenchmarkRate(categoryId, item.label, item.unit)?.meta,
    }));
    description = tradeAnalysis?.tradeScope || `${category.label}: scope to be detailed.`;
  }

  const scope: QuoteScope = {
    id: generateId(),
    categoryId,
    categoryLabel: category.label,
    description,
    builderNotes: scopeInput || undefined,
    stages: [],
    dimensions,
    answers: {},
    pcItems: getDefaultPCItems(categoryId),
    inclusions: getDefaultInclusions(categoryId),
    exclusions: getDefaultExclusions(categoryId),
    parametricItems,
  };

  return syncScopePricing(scope, baseline);
}