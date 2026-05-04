import type { ProjectBaseline, QuoteScope } from '../types/domain';
import type { TradeAnalysis } from './ai/tradeAnalyser';
import { getCategoryById } from './categories/extended';
import type { WorkCategory } from './categories/types';
import { generateId } from './helpers';
import { getDefaultPCItems, getDefaultInclusions, getDefaultExclusions } from './pricing/quoteDefaults';
import { resolveBenchmarkRate } from './pricing/rawlinsonsBenchmarkResolver';
import { deriveScopeDimensions, syncScopePricing } from '../components/variationBuilder/scopePricing';

export function createScopeFromCategory(
  categoryId: string,
  scopeInput: string,
  tradeAnalysis: TradeAnalysis | undefined,
  baseline: ProjectBaseline,
): QuoteScope | null {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  const dimensions = deriveScopeDimensions(categoryId, baseline);
  const parametricItems = (tradeAnalysis?.items || []).map((item) => ({
    id: generateId(),
    unitId: item.unitId,
    label: item.label,
    unit: item.unit as 'each' | 'lm' | 'm2' | 'allow',
    rate: item.rate,
    quantity: item.quantity,
    pricingSource: resolveBenchmarkRate(categoryId, item.label, item.unit)?.meta,
  }));

  const scope: QuoteScope = {
    id: generateId(),
    categoryId,
    categoryLabel: category.label,
    description: buildTradeSpecificDescription(category, tradeAnalysis, scopeInput),
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

function buildTradeSpecificDescription(
  category: WorkCategory,
  tradeAnalysis: TradeAnalysis | undefined,
  scopeInput: string,
): string {
  const aiScope = (tradeAnalysis?.tradeScope || '').trim();

  if (aiScope && !looksLikeWholeProjectScope(aiScope, category)) {
    return aiScope;
  }

  const label = category.label.replace(/^[^A-Za-z0-9]+\s*/, '');
  const itemLabels = (tradeAnalysis?.items || []).map((item) => item.label).filter(Boolean);

  if (itemLabels.length > 0) {
    return `${label}: ${itemLabels.slice(0, 5).join(', ')}${itemLabels.length > 5 ? ` plus ${itemLabels.length - 5} more item(s)` : ''}.`;
  }

  if (category.stages.length > 0) {
    const stages = category.stages.slice(0, 4).map((stage) => stage.name).join(', ');
    return `${label}: ${stages}.`;
  }

  if (category.inclusions.length > 0) {
    return `${label}: ${category.inclusions.slice(0, 4).join(', ')}.`;
  }

  // Keep room-template categories descriptive, but never copy a whole-project scope into a single trade.
  if (category.archetype === 'assembly' && scopeInput.trim()) return scopeInput.trim();
  return `${label}: scope to be detailed for this trade only.`;
}

function looksLikeWholeProjectScope(text: string, category: WorkCategory): boolean {
  const lower = text.toLowerCase();
  const cleanLabel = category.label.replace(/^[^A-Za-z0-9]+\s*/, '').toLowerCase();
  const wholeProjectSignals = [
    'scope of works:',
    'full bathroom renovation',
    'full kitchen renovation',
    'whole project',
    'all bathroom',
    'all works',
  ];
  const numberedSections = /\*?\*?\s*\d+\.\s+[a-z]/i.test(text);
  const mentionsOtherCommonTrades = [
    'demolition',
    'plumbing',
    'electrical',
    'waterproofing',
    'tiling',
    'painting',
    'cabinetry',
  ].filter((term) => lower.includes(term)).length;

  if (lower.includes(cleanLabel)) return false;
  return wholeProjectSignals.some((signal) => lower.includes(signal)) || numberedSections || mentionsOtherCommonTrades >= 3;
}
