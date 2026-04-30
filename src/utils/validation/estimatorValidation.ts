import type { ProjectBaseline, QuoteScope } from '../../types/domain';
import { getEstimatorReviewFlags } from '../estimatorReview';
import { calculateQuote } from '../pricing/quoteCalculator';
import { getTradeChainSuggestions } from '../pricing/tradeChain';
import { getAllParametricUnits } from '../pricing/parametricUnits';
import { TRADE_RATE_DIRECTORY } from '../trades/tradeRateDirectory';
import { getAnswerPricingAdjustment } from '../../components/variationBuilder/answerPricing';
import { deriveScopeDimensions, syncScopePricing } from '../../components/variationBuilder/scopePricing';

export type ValidationResult = {
  name: string;
  passed: boolean;
  details: string;
};

export function runEstimatorValidation(): ValidationResult[] {
  return [
    validateQuoteMath(),
    validateDimensionPropagation(),
    validateTradeChainSuggestions(),
    validateRateProvenance(),
    validateEstimatorFlags(),
    validateAnswerPricing(),
  ];
}

function validateQuoteMath(): ValidationResult {
  const pricing = calculateQuote(1000, 10, 20, 5);
  return {
    name: 'Quote math includes overhead, margin, contingency and GST',
    passed: pricing.total === 1525 && pricing.gstAmount === 139,
    details: `Expected total 1525 and GST 139, received total ${pricing.total} and GST ${pricing.gstAmount}.`,
  };
}

function validateDimensionPropagation(): ValidationResult {
  const baseline: ProjectBaseline = { totalAreaM2: 25, storeys: 'single', siteAccess: 'easy', ceilingHeightM: 2.7 };
  const dimensions = deriveScopeDimensions('painting', baseline);
  return {
    name: 'Project baseline propagates into scope dimensions',
    passed: dimensions.width === 25 && dimensions.length === 1 && dimensions.height === 2.7,
    details: `Painting dimensions resolved to ${dimensions.width} x ${dimensions.length} x ${dimensions.height}.`,
  };
}

function validateTradeChainSuggestions(): ValidationResult {
  const suggestions = getTradeChainSuggestions('plumbing', ['plumbing']);
  const ids = suggestions.map((suggestion) => suggestion.categoryId);
  return {
    name: 'Trade-chain suggestions identify related trades',
    passed: ids.includes('waterproofing') && ids.includes('electrical'),
    details: `Plumbing suggestions: ${ids.join(', ') || 'none'}.`,
  };
}

function validateRateProvenance(): ValidationResult {
  const missingUnitMetadata = getAllParametricUnits().filter((unit) => !unit.rateConfidence || !unit.rateSource);
  const missingTradeMetadata = TRADE_RATE_DIRECTORY.filter((trade) => !trade.rateConfidence || !trade.rateSource);
  return {
    name: 'Rates carry provenance metadata',
    passed: missingUnitMetadata.length === 0 && missingTradeMetadata.length === 0,
    details: `${missingUnitMetadata.length} unit rates and ${missingTradeMetadata.length} trade rates missing metadata.`,
  };
}

function validateEstimatorFlags(): ValidationResult {
  const pricing = calculateQuote(0, 10, 10, 10);
  const flags = getEstimatorReviewFlags([], pricing);
  return {
    name: 'Estimator flags catch empty/zero documents',
    passed: flags.some((flag) => flag.id === 'no-scopes') && flags.some((flag) => flag.id === 'zero-total'),
    details: `Generated flags: ${flags.map((flag) => flag.id).join(', ')}.`,
  };
}

function validateAnswerPricing(): ValidationResult {
  const scope: QuoteScope = {
    id: 'test',
    categoryId: 'painting',
    categoryLabel: 'Painting',
    description: 'Painting works',
    stages: [],
    dimensions: { width: 0, length: 0, height: 2.4 },
    answers: {},
    questionAnswers: [{ questionId: 'prep', answer: 'Full prep & patching' }],
    pcItems: [],
    inclusions: [],
    exclusions: [],
  };
  const adjustment = getAnswerPricingAdjustment(scope);
  const priced = syncScopePricing(scope, { totalAreaM2: 20, storeys: 'single', siteAccess: 'easy', ceilingHeightM: 2.4 });
  return {
    name: 'Category answers influence pricing',
    passed: adjustment.multiplier > 1 && priced.stages.some((stage) => stage.rateOverrideNote),
    details: `Answer multiplier ${adjustment.multiplier}; priced stages ${priced.stages.length}.`,
  };
}