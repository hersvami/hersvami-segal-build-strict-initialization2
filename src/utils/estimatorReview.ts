import type { EstimatorReviewFlag, QuotePricing, QuoteScope } from '../types/domain';
import type { TradeAnalysis } from './ai/tradeAnalyser';
import { calcScopeTotal } from './pricing/engine';
import { getCategoryById } from './categories/extended';

export type { EstimatorReviewFlag };

type ReviewOptions = {
  analysisFallback?: boolean;
  tradeAnalyses?: TradeAnalysis[];
  contingencyPct?: number;
};

const isZero = (value: number | undefined) => !value || value <= 0;

export function getEstimatorReviewFlags(
  scopes: QuoteScope[],
  pricing: QuotePricing,
  options: ReviewOptions = {},
): EstimatorReviewFlag[] {
  const flags: EstimatorReviewFlag[] = [];

  if (scopes.length === 0) {
    flags.push({
      id: 'no-scopes',
      severity: 'critical',
      title: 'No scopes added',
      message: 'Add at least one priced trade scope before issuing a quote or variation.',
    });
  }

  if (pricing.tradeCost <= 0 || pricing.total <= 0) {
    flags.push({
      id: 'zero-total',
      severity: 'critical',
      title: 'Zero-dollar total',
      message: 'The document total is zero. Confirm rates, quantities and scope pricing before saving.',
    });
  }

  if ((options.contingencyPct || 0) >= 15) {
    flags.push({
      id: 'high-contingency',
      severity: 'warning',
      title: 'High contingency',
      message: 'Contingency is 15% or higher. Note the reason if this is due to structural risk, access or unknown site conditions.',
    });
  }

  if (options.analysisFallback) {
    flags.push({
      id: 'ai-fallback',
      severity: 'warning',
      title: 'Keyword fallback used',
      message: 'AI recognition did not run or returned no structured result. Review category selection and quantities manually.',
    });
  }

  for (const analysis of options.tradeAnalyses || []) {
    if (analysis.confidence < 0.5) {
      flags.push({
        id: `low-confidence-${analysis.categoryId}`,
        severity: 'warning',
        title: 'Low AI confidence',
        message: `${analysis.label} was detected at ${Math.round(analysis.confidence * 100)}% confidence. Confirm this trade is required.`,
        categoryLabel: analysis.label,
      });
    }
  }

  for (const scope of scopes) {
    const category = getCategoryById(scope.categoryId);
    const scopeTotal = calcScopeTotal(scope);
    const isManualTemplate = category?.archetype === 'assembly';

    if (!scope.description.trim()) {
      flags.push({
        id: `missing-description-${scope.id}`,
        severity: 'warning',
        title: 'Missing scope description',
        message: 'Add customer-facing scope wording before sending this document.',
        scopeId: scope.id,
        categoryLabel: scope.categoryLabel,
      });
    }

    if (isManualTemplate) {
      flags.push({
        id: `manual-template-${scope.id}`,
        severity: 'info',
        title: 'Manual template only',
        message: 'This room template is for planning notes. Ensure costed trade scopes are added separately.',
        scopeId: scope.id,
        categoryLabel: scope.categoryLabel,
      });
    }

    if (!isManualTemplate && scopeTotal <= 0) {
      flags.push({
        id: `zero-cost-${scope.id}`,
        severity: 'critical',
        title: 'Scope has no cost',
        message: 'This priced scope has no trade, stage or BoQ cost. Add rates or remove the scope.',
        scopeId: scope.id,
        categoryLabel: scope.categoryLabel,
      });
    }

    if (category?.dimensionMode !== 'none' && category?.dimensionMode !== 'item') {
      const { width, length, height } = scope.dimensions;
      if (isZero(width) || isZero(length) || isZero(height)) {
        flags.push({
          id: `missing-dimensions-${scope.id}`,
          severity: 'warning',
          title: 'Dimensions need review',
          message: 'One or more dimensions are zero. Confirm the measured quantity used for pricing.',
          scopeId: scope.id,
          categoryLabel: scope.categoryLabel,
        });
      }
    }

    if (scope.inclusions.length === 0) {
      flags.push({
        id: `no-inclusions-${scope.id}`,
        severity: 'info',
        title: 'No inclusions listed',
        message: 'Add inclusions so the client understands what is covered.',
        scopeId: scope.id,
        categoryLabel: scope.categoryLabel,
      });
    }

    if (scope.exclusions.length === 0) {
      flags.push({
        id: `no-exclusions-${scope.id}`,
        severity: 'info',
        title: 'No exclusions listed',
        message: 'Add exclusions to reduce contract ambiguity.',
        scopeId: scope.id,
        categoryLabel: scope.categoryLabel,
      });
    }

    for (const item of scope.parametricItems || []) {
      if (item.quantity <= 0 || item.rate <= 0) {
        flags.push({
          id: `bad-boq-${item.id}`,
          severity: 'critical',
          title: 'BoQ item has zero rate or quantity',
          message: `${item.label} needs a positive rate and quantity before issuing.`,
          scopeId: scope.id,
          categoryLabel: scope.categoryLabel,
        });
      }
    }
  }

  return flags;
}
