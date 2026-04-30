/* ─── Segal Build — Create Scope From Category ──────────────────────────────── */

import { getCategoryById } from '../../utils/categories/extended';
import type { ProjectBaseline, QuoteScope, ParametricItem } from '../../types/domain';
import { generateId } from '../../utils/helpers';
import type { TradeAnalysis } from './scopePricing';
import { getDefaultBaseline } from './builderShared';
import { getTemplateDescription, isManualTemplateCategory, syncScopePricing } from './scopePricing';

export function createScopeFromCategory(
  categoryId: string,
  scopeInput?: string,
  tradeAnalysis?: TradeAnalysis,
  baseline: ProjectBaseline = getDefaultBaseline(),
): QuoteScope | null {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  const parametricItems: ParametricItem[] = (tradeAnalysis?.items || []).map((item) => ({
    id: generateId(),
    unitId: item.unitId,
    label: item.label,
    unit: item.unit as 'each' | 'lm' | 'm2' | 'allow',
    rate: item.rate,
    quantity: item.quantity,
  }));

  const isTemplate = isManualTemplateCategory(category.id);
  const scope: QuoteScope = {
    id: generateId(),
    categoryId: category.id,
    categoryLabel: category.label,
    description: tradeAnalysis?.tradeScope || (isTemplate ? getTemplateDescription(category.label) : ''),
    builderNotes: scopeInput || '',
    dimensions: { width: 0, length: 0, height: baseline.ceilingHeightM || 2.4 },
    stages: isManualTemplateCategory(category.id)
      ? []
      : (category.stages || []).map((stage) => ({
          name: stage.name,
          trade: stage.trade,
          cost: stage.rate,
          duration: stage.duration,
          description: stage.description,
          status: 'not-started' as const,
        })),
    inclusions: (category.inclusions || []).map((text) => ({
      id: generateId(),
      text,
      isDefault: true,
    })),
    exclusions: (category.exclusions || []).map((text) => ({
      id: generateId(),
      text,
      isDefault: true,
    })),
    pcItems: (category.pcItems || []).map((item) => ({ ...item, id: generateId() })),
    parametricItems: isManualTemplateCategory(category.id) ? [] : parametricItems,
    answers: {},
  };

  return syncScopePricing(scope, baseline);
}