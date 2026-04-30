import type { ProjectBaseline, QuoteScope, Variation } from '../../types/domain';
import type { TradeAnalysis } from '../../utils/ai/tradeAnalyser';
import { BaselineStep } from './BaselineStep';
import { ScopeStep } from './ScopeStep';
import { ScopeDetailEditor } from './Editors';
import { PricingStep } from './PricingStep';
import { ReviewStep } from './ReviewStep';
import type { Step } from './builderShared';

type Props = {
  step: Step;
  documentType: 'quote' | 'variation';
  baseline: ProjectBaseline;
  rawTradeCost: number;
  scopeInput: string;
  setScopeInput: (value: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (value: string) => void;
  tradeAnalyses: TradeAnalysis[];
  isAnalysing: boolean;
  analysisFallback: boolean;
  showCategoryBrowser: boolean;
  setShowCategoryBrowser: (value: boolean) => void;
  groupedCategories: Record<string, Array<{ id: string; label: string }>>;
  scopes: QuoteScope[];
  geminiKey: string;
  setGeminiKey: (value: string) => void;
  apiPolishing: boolean;
  varRefQuote: string;
  setVarRefQuote: (value: string) => void;
  varReason: string;
  setVarReason: (value: string) => void;
  approvedQuotes: Variation[];
  lastAiModel: string;
  recogniseFeedback: string;
  keyRestored: boolean;
  pricing: any;
  ohPct: number;
  setOhPct: (v: number) => void;
  profitPct: number;
  setProfitPct: (v: number) => void;
  contingencyPct: number;
  setContingencyPct: (v: number) => void;
  setBaseline: (value: ProjectBaseline) => void;
  setScopes: (next: QuoteScope[]) => void;
  onScopeChange: (index: number, next: QuoteScope) => void;
  onRecognise: () => void;
  onPolish: () => Promise<void>;
  onAddScope: (categoryId: string) => void;
  onAddAll: () => void;
  onAcceptSuggestion: (categoryId: string, unitId: string) => void;
};

export function BuilderStepContent({
  step,
  documentType,
  baseline,
  rawTradeCost,
  scopeInput,
  setScopeInput,
  selectedCategoryId,
  setSelectedCategoryId,
  tradeAnalyses,
  isAnalysing,
  analysisFallback,
  showCategoryBrowser,
  setShowCategoryBrowser,
  groupedCategories,
  scopes,
  geminiKey,
  setGeminiKey,
  apiPolishing,
  varRefQuote,
  setVarRefQuote,
  varReason,
  setVarReason,
  approvedQuotes,
  lastAiModel,
  recogniseFeedback,
  keyRestored,
  pricing,
  ohPct,
  setOhPct,
  profitPct,
  setProfitPct,
  contingencyPct,
  setContingencyPct,
  setBaseline,
  setScopes,
  onScopeChange,
  onRecognise,
  onPolish,
  onAddScope,
  onAddAll,
  onAcceptSuggestion,
}: Props) {
  if (step === 'baseline') {
    return <BaselineStep baseline={baseline} setBaseline={setBaseline} previewTradeCost={rawTradeCost} />;
  }

  if (step === 'scope') {
    return (
      <ScopeStep
        documentType={documentType}
        scopeInput={scopeInput}
        setScopeInput={setScopeInput}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        recognised={[]}
        tradeAnalyses={tradeAnalyses}
        isAnalysing={isAnalysing}
        analysisFallback={analysisFallback}
        showCategoryBrowser={showCategoryBrowser}
        setShowCategoryBrowser={setShowCategoryBrowser}
        groupedCategories={groupedCategories}
        scopes={scopes}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        apiPolishing={apiPolishing}
        varRefQuote={varRefQuote}
        setVarRefQuote={setVarRefQuote}
        varReason={varReason}
        setVarReason={setVarReason}
        approvedQuotes={approvedQuotes.map((q) => ({ id: q.id, title: q.title }))}
        lastAiModel={lastAiModel}
        recogniseFeedback={recogniseFeedback}
        keyRestored={keyRestored}
        onRecognise={onRecognise}
        onPolish={onPolish}
        onAddScope={onAddScope}
        onRemoveScope={(index) => setScopes(scopes.filter((_, i) => i !== index))}
        onAddAll={onAddAll}
        onAcceptSuggestion={onAcceptSuggestion}
      />
    );
  }

  if (step === 'details') {
    return (
      <div className="space-y-6">
        {scopes.map((scope, index) => (
          <ScopeDetailEditor
            key={scope.id}
            scope={scope}
            index={index}
            tradeAnalysis={tradeAnalyses.find((t) => t.categoryId === scope.categoryId)}
            onChange={(next) => onScopeChange(index, next)}
          />
        ))}
      </div>
    );
  }

  if (step === 'pricing') {
    return (
      <PricingStep
        scopes={scopes}
        setScopes={setScopes}
        ohPct={ohPct}
        setOhPct={setOhPct}
        profitPct={profitPct}
        setProfitPct={setProfitPct}
        contingencyPct={contingencyPct}
        setContingencyPct={setContingencyPct}
      />
    );
  }

  return (
    <ReviewStep
      scopes={scopes}
      pricing={pricing}
      ohPct={ohPct}
      profitPct={profitPct}
      contingencyPct={contingencyPct}
      analysisFallback={analysisFallback}
      tradeAnalyses={tradeAnalyses}
    />
  );
}