import type { ProjectBaseline, QuoteScope } from '../../types/domain';
import { calculateStage } from '../../utils/pricing/quoteCalculator';
import { getCategoryById } from '../../utils/categories/extended';
import { resolveBenchmarkRate } from '../../utils/pricing/rawlinsonsBenchmarkResolver';
import { getAnswerPricingAdjustment } from './answerPricing';

const MANUAL_TEMPLATE_IDS = new Set(['bathroom', 'kitchen', 'laundry', 'toilet']);
const HEIGHT_OVERRIDE_IDS = new Set(['painting', 'insulation', 'ceilings', 'cladding', 'rendering']);

export function isManualTemplateCategory(categoryId: string): boolean {
  return MANUAL_TEMPLATE_IDS.has(categoryId) || getCategoryById(categoryId)?.archetype === 'assembly';
}

export function isTradeOnlyCategory(categoryId: string): boolean {
  const category = getCategoryById(categoryId);
  return category ? category.archetype !== 'assembly' : false;
}

export function deriveScopeDimensions(categoryId: string, baseline: ProjectBaseline, current?: QuoteScope['dimensions']): QuoteScope['dimensions'] {
  const category = getCategoryById(categoryId);
  const area = Math.max(baseline.totalAreaM2 || 0, 0);
  const height = current && current.height && current.height !== baseline.ceilingHeightM && current.height > 0 ? current.height : baseline.ceilingHeightM || 2.4;
  const safeArea = area > 0 ? area : Math.max((current?.width || 0) * (current?.length || 0), 0);
  const side = Math.max(Math.sqrt(safeArea || 1), 1);
  const perimeter = Math.max(side * 4, 1);
  const hasCurrent = Boolean((current?.width || 0) || (current?.length || 0) || (current?.height || 0));
  if (hasCurrent) return { width: current?.width || 0, length: current?.length || 0, height };
  if (HEIGHT_OVERRIDE_IDS.has(categoryId)) return { width: area, length: 1, height };
  switch (category?.dimensionMode) {
    case 'wall': return { width: perimeter, length: height, height };
    case 'room': case 'roof': return { width: side, length: side, height };
    case 'linear': return { width: perimeter, length: perimeter, height };
    default: return { width: area, length: 1, height };
  }
}

export function buildStageCost(categoryId: string, unit: 'area' | 'linear' | 'item' | 'allow', rate: number, dimensions: QuoteScope['dimensions'], stageName = ''): number {
  const benchmark = resolveBenchmarkRate(categoryId, stageName, unit);
  const effectiveRate = benchmark?.meta.costType === 'material_only' ? rate : (benchmark?.rate ?? rate);
  if (unit === 'area' && (categoryId === 'painting' || categoryId === 'cladding' || categoryId === 'rendering')) {
    const footprint = Math.max(dimensions.width * dimensions.length, 0);
    const side = Math.max(Math.sqrt(footprint || 1), 1);
    const wallArea = side * 4 * Math.max(dimensions.height || 2.4, 2.4);
    if (categoryId === 'painting') return Math.round(effectiveRate * (footprint + wallArea));
    return Math.round(effectiveRate * wallArea);
  }
  return Math.round(calculateStage(effectiveRate, unit, dimensions));
}

export function syncScopePricing(scope: QuoteScope, baseline: ProjectBaseline): QuoteScope {
  const category = getCategoryById(scope.categoryId);
  if (!category) return scope;
  const dimensions = deriveScopeDimensions(scope.categoryId, baseline, scope.dimensions);
  if (isManualTemplateCategory(scope.categoryId)) return { ...scope, dimensions, stages: [] };
  if (category.usesParametric && (scope.parametricItems || []).length > 0) return { ...scope, dimensions, stages: [] };
  const answerAdjustment = getAnswerPricingAdjustment(scope);
  const stages = category.stages.map((stage) => ({
    name: stage.name, trade: stage.trade,
    cost: Math.round(buildStageCost(scope.categoryId, stage.unit, stage.rate, dimensions, `${stage.name} ${stage.trade}`) * answerAdjustment.multiplier),
    duration: stage.duration, description: stage.description, status: 'not-started' as const,
    rateOverrideNote: answerAdjustment.note,
    pricingSource: resolveBenchmarkRate(scope.categoryId, `${stage.name} ${stage.trade}`, stage.unit)?.meta,
  }));
  return { ...scope, dimensions, stages };
}

export function getTemplateDescription(label: string): string {
  return `${label} is a manual room template only. Use individual trades for pricing, then keep this template for planning notes and room-specific questions.`;
}

export function needsAreaHeightOverride(categoryId: string): boolean {
  return HEIGHT_OVERRIDE_IDS.has(categoryId);
}

export type TradeAnalysisItem = { unitId: string; label: string; unit: string; rate: number; quantity: number };
export type TradeAnalysis = { categoryId: string; label: string; confidence: number; tradeScope: string; items: TradeAnalysisItem[]; subtotal: number };
