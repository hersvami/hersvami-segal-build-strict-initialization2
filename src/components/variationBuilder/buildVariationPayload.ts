import type { PreliminariesSettings, Project, ProjectBaseline, QuotePricing, QuoteScope, Variation } from '../../types/domain';
import type { TradeAnalysis } from '../../utils/ai/tradeAnalyser';
import { getEstimatorReviewFlags } from '../../utils/estimatorReview';
import { generateId } from '../../utils/helpers';

type Args = { project: Project; documentType: 'quote' | 'variation'; scopes: QuoteScope[]; pricing: QuotePricing; existingQuotes: Variation[]; varRefQuote: string; varReason: string; baseline: ProjectBaseline; preliminaries?: PreliminariesSettings; tradeAnalyses?: TradeAnalysis[]; analysisFallback?: boolean; contingencyPct?: number };

export function buildVariationPayload(args: Args): Variation {
  const now = new Date().toISOString();
  const nextVariationCount = args.existingQuotes.filter((v) => v.documentType === 'variation').length + 1;
  const reviewFlags = getEstimatorReviewFlags(args.scopes, args.pricing, { tradeAnalyses: args.tradeAnalyses || [], analysisFallback: args.analysisFallback, contingencyPct: args.contingencyPct });
  return {
    id: generateId(),
    title: args.documentType === 'quote' ? `Quote - ${args.project.name}` : `Variation ${args.scopes.map((s) => s.categoryLabel).join(', ')}`,
    description: args.scopes.map((s) => s.description).filter(Boolean).join('\n\n'),
    status: 'draft', documentType: args.documentType, scopes: args.scopes, pricing: args.pricing,
    changeLog: [{ id: generateId(), action: 'created', timestamp: now, user: 'Builder', details: `${args.documentType} created with ${args.scopes.length} scope(s)` }],
    createdAt: now, updatedAt: now, internalNotes: [], source: 'internal',
    referenceQuoteId: args.documentType === 'variation' ? args.varRefQuote : undefined,
    reasonForChange: args.documentType === 'variation' ? args.varReason : undefined,
    variationNumber: args.documentType === 'variation' ? `V-${String(nextVariationCount).padStart(3, '0')}` : undefined,
    costImpact: args.documentType === 'variation' ? 'additional' : undefined,
    baseline: args.baseline, preliminaries: args.preliminaries, reviewFlags,
  };
}
