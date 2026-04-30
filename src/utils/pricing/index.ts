/* ─── Segal Build — Pricing Barrel Exports ─── */
export {
  generateSolutionsFromScope,
  generateSolutionFromCategory,
  calcScopeTotal,
  calcScopesTotal,
} from './engine';
export {
  recogniseScope,
  recogniseScopeWithAI,
  getRelatedCategories,
  getAutoAddCategories,
  getSuggestedCategories,
  suggestContingency,
  getAllCategories,
  getGroupedCategories,
} from './scopeRecogniser';
export { calculateQuote, calculateStage, calculateScope } from './quoteCalculator';
export { getDefaultPCItems, getDefaultInclusions, getDefaultExclusions } from './quoteDefaults';
export { formatCurrency } from '../helpers';
export type { SolutionTemplate, StageTemplate } from './types';
