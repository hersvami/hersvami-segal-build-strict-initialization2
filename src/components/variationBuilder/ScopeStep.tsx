import { useMemo } from 'react';
import type { QuoteScope } from '../../types/domain';
import type { TradeAnalysis } from '../../utils/ai/tradeAnalyser';
import { AddedScopesPanel } from './AddedScopesPanel';
import { ScopeInputPanel } from './ScopeInputPanel';
import { TradeAnalysisPanel } from './TradeAnalysisPanel';
import { CategoryBrowserPanel } from './CategoryBrowserPanel';

type CategoryOption = { id: string; label: string };
type GroupedCategories = Record<string, CategoryOption[]>;
type Recognition = { categoryId: string; label: string; confidence: number };

type Props = { documentType: 'quote' | 'variation'; scopeInput: string; setScopeInput: (value: string) => void; selectedCategoryId?: string; setSelectedCategoryId: (value: string) => void; recognised?: Recognition[]; tradeAnalyses: TradeAnalysis[]; isAnalysing: boolean; analysisFallback: boolean; showCategoryBrowser: boolean; setShowCategoryBrowser: (value: boolean) => void; groupedCategories: GroupedCategories; scopes: QuoteScope[]; geminiKey: string; setGeminiKey: (value: string) => void; apiPolishing: boolean; varRefQuote: string; setVarRefQuote: (value: string) => void; varReason: string; setVarReason: (value: string) => void; approvedQuotes: Array<{ id: string; title: string }>; lastAiModel: string; recogniseFeedback?: string; keyRestored?: boolean; onRecognise: () => void; onPolish: () => Promise<void>; onAddScope: (categoryId: string) => void; onRemoveScope: (index: number) => void; onAddAll: () => void; onAcceptSuggestion: (categoryId: string, unitId: string) => void };

export function ScopeStep({ documentType, scopeInput, setScopeInput, selectedCategoryId, setSelectedCategoryId, recognised, tradeAnalyses, isAnalysing, analysisFallback, showCategoryBrowser, setShowCategoryBrowser, groupedCategories, scopes, geminiKey, setGeminiKey, apiPolishing, varRefQuote, setVarRefQuote, varReason, setVarReason, approvedQuotes, lastAiModel, recogniseFeedback, keyRestored, onRecognise, onPolish, onAddScope, onRemoveScope, onAddAll, onAcceptSuggestion }: Props) {
  void selectedCategoryId; void recognised;
  const addedIds = useMemo(() => scopes.map((scope) => scope.categoryId), [scopes]);
  const handleRemoveByCategory = (categoryId: string) => { const index = scopes.findIndex((scope) => scope.categoryId === categoryId); if (index >= 0) onRemoveScope(index); };

  return (
    <div className="space-y-5">
      <ScopeInputPanel documentType={documentType} scopeInput={scopeInput} setScopeInput={setScopeInput} geminiKey={geminiKey} setGeminiKey={setGeminiKey} apiPolishing={apiPolishing} isAnalysing={isAnalysing} varRefQuote={varRefQuote} setVarRefQuote={setVarRefQuote} varReason={varReason} setVarReason={setVarReason} approvedQuotes={approvedQuotes} lastAiModel={lastAiModel} recogniseFeedback={recogniseFeedback} analysisFallback={analysisFallback} hasTradeAnalyses={tradeAnalyses.length > 0} keyRestored={keyRestored} onRecognise={onRecognise} onPolish={onPolish} />
      <TradeAnalysisPanel tradeAnalyses={tradeAnalyses} addedIds={addedIds} onAddScope={onAddScope} onRemoveByCategory={handleRemoveByCategory} onAddAll={onAddAll} setSelectedCategoryId={setSelectedCategoryId} onAcceptSuggestion={onAcceptSuggestion} />
      <CategoryBrowserPanel showCategoryBrowser={showCategoryBrowser} setShowCategoryBrowser={setShowCategoryBrowser} groupedCategories={groupedCategories} addedIds={addedIds} onToggleCategory={(categoryId, added) => { if (added) handleRemoveByCategory(categoryId); else onAddScope(categoryId); }} />
      <AddedScopesPanel scopes={scopes} onRemoveScope={handleRemoveByCategory} />
    </div>
  );
}
