import { useEffect, useMemo, useState } from 'react';
import type { ParametricItem, PreliminariesSettings, Project, ProjectBaseline, QuoteScope, Variation } from '../../types/domain';
import { analyseScope, type TradeAnalysis } from '../../utils/ai/tradeAnalyser';
import { generateId } from '../../utils/helpers';
import { calcBaselineAdjustment } from '../../utils/pricing/baselineMultipliers';
import { calcScopesTotal } from '../../utils/pricing/engine';
import { calculateQuote } from '../../utils/pricing/quoteCalculator';
import { DEFAULT_PRELIMINARIES_PERCENT } from '../../utils/pricing/preliminaries';
import { polishScopeWithAI } from '../../utils/services';
import { buildVariationPayload } from './buildVariationPayload';
import { clearBuilderDraft, loadBuilderDraft, saveBuilderDraft } from './builderDraft';
import { GEMINI_KEY_STORAGE, getDefaultBaseline, groupCategories, readGeminiKey, type Step } from './builderShared';
import { createScopeFromCategory } from '../../utils/createScopeFromCategory';
import { syncScopePricing } from './scopePricing';

type Args = { project: Project; documentType: 'quote' | 'variation'; existingQuotes: Variation[]; companyOH: number; companyProfit: number; initialVariation?: Variation; onSave: (variation: Variation) => void };

export function useVariationBuilderController(args: Args) {
  const savedDraft = args.initialVariation ? null : loadBuilderDraft(args.project.id, args.documentType);
  const initialBaseline: ProjectBaseline = args.initialVariation?.baseline
    ? { ...getDefaultBaseline(), ...args.initialVariation.baseline }
    : savedDraft?.baseline ? { ...getDefaultBaseline(), ...savedDraft.baseline } : getDefaultBaseline();
  const [step, setStep] = useState<Step>(args.initialVariation ? 'details' : 'baseline');
  const [scopeInput, setScopeInput] = useState(savedDraft?.scopeInput || args.initialVariation?.description || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(savedDraft?.selectedCategoryId || args.initialVariation?.scopes[0]?.categoryId || '');
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);
  const [scopes, setScopes] = useState<QuoteScope[]>(args.initialVariation?.scopes || []);
  const [ohPct, setOhPct] = useState(args.initialVariation?.pricing.overheadPercent ?? args.companyOH);
  const [profitPct, setProfitPct] = useState(args.initialVariation?.pricing.profitPercent ?? args.companyProfit);
  const [contingencyPct, setContingencyPct] = useState(args.initialVariation?.pricing.contingencyPercent ?? 10);
  const [preliminaries, setPreliminaries] = useState<PreliminariesSettings>(args.initialVariation?.preliminaries || { enabled: true, mode: 'percent', percent: DEFAULT_PRELIMINARIES_PERCENT, amount: 0 });
  const [varRefQuote, setVarRefQuote] = useState(args.initialVariation?.referenceQuoteId || '');
  const [varReason, setVarReason] = useState(args.initialVariation?.reasonForChange || '');
  const [baseline, setBaseline] = useState<ProjectBaseline>(initialBaseline);
  const [geminiKey, setGeminiKey] = useState(() => readGeminiKey(args.project.geminiApiKey));
  const [keyRestored, setKeyRestored] = useState(false);
  const [apiPolishing, setApiPolishing] = useState(false);
  const [lastAiModel, setLastAiModel] = useState('');
  const [recogniseFeedback, setRecogniseFeedback] = useState('');
  const [tradeAnalyses, setTradeAnalyses] = useState<TradeAnalysis[]>([]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisFallback, setAnalysisFallback] = useState(false);

  useEffect(() => saveBuilderDraft(args.project.id, args.documentType, { scopeInput, selectedCategoryId, baseline }), [baseline, args.documentType, args.project.id, scopeInput, selectedCategoryId]);
  useEffect(() => { try { const stored = window.localStorage.getItem(GEMINI_KEY_STORAGE); if (stored && stored === geminiKey) { setKeyRestored(true); setTimeout(() => setKeyRestored(false), 4000); } } catch {} }, []);
  useEffect(() => { try { if (geminiKey) window.localStorage.setItem(GEMINI_KEY_STORAGE, geminiKey); else window.localStorage.removeItem(GEMINI_KEY_STORAGE); } catch {} }, [geminiKey]);
  useEffect(() => setScopes((prev) => prev.map((scope) => syncScopePricing(scope, baseline))), [baseline]);

  const groupedCategories = useMemo(groupCategories, []);
  const approvedQuotes = args.existingQuotes.filter((q) => q.documentType === 'quote' && q.status === 'approved');
  const rawTradeCost = useMemo(() => calcScopesTotal(scopes), [scopes]);
  const baselineAdj = useMemo(() => calcBaselineAdjustment(baseline, rawTradeCost), [baseline, rawTradeCost]);
  const preliminariesAmount = preliminaries.enabled
    ? preliminaries.mode === 'fixed' ? preliminaries.amount : Math.round(rawTradeCost * (preliminaries.percent / 100))
    : 0;
  const pricing = calculateQuote(rawTradeCost + baselineAdj.totalAdjustment, ohPct, profitPct, contingencyPct, preliminariesAmount, preliminaries.enabled && preliminaries.mode === 'percent' ? preliminaries.percent : 0);
  const canNext = step === 'baseline' ? baseline.totalAreaM2 > 0 : step === 'scope' ? scopes.length > 0 && (args.documentType === 'quote' || (Boolean(varRefQuote) && Boolean(varReason))) : true;

  const flash = (message: string) => { setRecogniseFeedback(message); setTimeout(() => setRecogniseFeedback(''), 5000); };
  const updateGeminiKey = (value: string) => {
    setGeminiKey(value);
    try {
      if (value) window.localStorage.setItem(GEMINI_KEY_STORAGE, value);
      else window.localStorage.removeItem(GEMINI_KEY_STORAGE);
    } catch {}
  };
  const onScopeChange = (index: number, next: QuoteScope) => setScopes((prev) => prev.map((scope, i) => (i === index ? syncScopePricing(next, baseline) : scope)));
  const onAddScope = (categoryId: string) => { setScopes((prev) => addScope(prev, categoryId, scopeInput, tradeAnalyses, baseline)); setSelectedCategoryId(categoryId); };
  const onAddAll = () => setScopes((prev) => addAllScopes(prev, scopeInput, tradeAnalyses, baseline));
  const onAcceptSuggestion = (categoryId: string, unitId: string) => {
    const suggestion = tradeAnalyses.find((trade) => trade.categoryId === categoryId)?.suggestions.find((item) => item.unitId === unitId);
    if (!suggestion) return;
    setTradeAnalyses((prev) => promoteSuggestedItem(prev, categoryId, unitId));
    setScopes((prev) => prev.map((scope) => scope.categoryId === categoryId ? addSuggestedItemToScope(scope, suggestion, baseline) : scope));
  };
  const onRecognise = () => recognise(scopeInput, baseline.totalAreaM2, geminiKey, setIsAnalysing, setTradeAnalyses, setAnalysisFallback, setLastAiModel, flash);
  const onPolish = async () => polish(scopeInput, geminiKey, setApiPolishing, setScopeInput, setLastAiModel);
  const handleSave = () => {
    clearBuilderDraft(args.project.id, args.documentType);
    const payload = buildVariationPayload({ ...args, scopes, pricing, varRefQuote, varReason, baseline, preliminaries, tradeAnalyses, analysisFallback, contingencyPct });
    if (!args.initialVariation) {
      args.onSave(payload);
      return;
    }

    const now = new Date().toISOString();
    args.onSave({
      ...args.initialVariation,
      title: payload.title || args.initialVariation.title,
      description: payload.description,
      scopes,
      pricing,
      referenceQuoteId: args.documentType === 'variation' ? varRefQuote : args.initialVariation.referenceQuoteId,
      reasonForChange: args.documentType === 'variation' ? varReason : args.initialVariation.reasonForChange,
      baseline,
      preliminaries,
      reviewFlags: payload.reviewFlags,
      updatedAt: now,
      changeLog: [
        ...args.initialVariation.changeLog,
        { id: generateId(), action: 'updated', timestamp: now, user: 'Builder', details: 'Quote updated in builder' },
      ],
    });
  };

  return { step, setStep, baseline, baselineAdj, canNext, handleSave, stepProps: { step, documentType: args.documentType, baseline, rawTradeCost, scopeInput, setScopeInput, selectedCategoryId, setSelectedCategoryId, tradeAnalyses, isAnalysing, analysisFallback, showCategoryBrowser, setShowCategoryBrowser, groupedCategories, scopes, geminiKey, setGeminiKey: updateGeminiKey, apiPolishing, varRefQuote, setVarRefQuote, varReason, setVarReason, approvedQuotes, lastAiModel, recogniseFeedback, keyRestored, pricing, preliminaries, setPreliminaries, ohPct, setOhPct, profitPct, setProfitPct, contingencyPct, setContingencyPct, setBaseline, setScopes, onScopeChange, onRecognise, onPolish, onAddScope, onAddAll, onAcceptSuggestion } };
}

function promoteSuggestedItem(analyses: TradeAnalysis[], categoryId: string, unitId: string): TradeAnalysis[] {
  return analyses.map((trade) => {
    if (trade.categoryId !== categoryId) return trade;
    const suggestion = trade.suggestions.find((item) => item.unitId === unitId);
    if (!suggestion || trade.items.some((item) => item.unitId === unitId)) return trade;
    const items = [...trade.items, { ...suggestion, isPreFilled: true }];
    return { ...trade, items, suggestions: trade.suggestions.filter((item) => item.unitId !== unitId), subtotal: items.reduce((sum, item) => sum + item.rate * item.quantity, 0) };
  });
}

function addSuggestedItemToScope(scope: QuoteScope, suggestion: TradeAnalysis['suggestions'][number], baseline: ProjectBaseline): QuoteScope {
  if ((scope.parametricItems || []).some((item) => item.unitId === suggestion.unitId)) return scope;
  const nextItem: ParametricItem = { id: generateId(), unitId: suggestion.unitId, label: suggestion.label, unit: suggestion.unit as ParametricItem['unit'], rate: suggestion.rate, quantity: suggestion.quantity, notes: suggestion.reason };
  return syncScopePricing({ ...scope, parametricItems: [...(scope.parametricItems || []), nextItem] }, baseline);
}

function addScope(prev: QuoteScope[], categoryId: string, input: string, analyses: TradeAnalysis[], baseline: ProjectBaseline) {
  if (prev.some((scope) => scope.categoryId === categoryId)) return prev;
  const next = createScopeFromCategory(categoryId, input, analyses.find((t) => t.categoryId === categoryId), baseline);
  return next ? [...prev, next] : prev;
}

function addAllScopes(prev: QuoteScope[], input: string, analyses: TradeAnalysis[], baseline: ProjectBaseline) {
  const existing = new Set(prev.map((scope) => scope.categoryId));
  const nextScopes = analyses.filter((trade) => !existing.has(trade.categoryId)).map((trade) => createScopeFromCategory(trade.categoryId, input, trade, baseline)).filter(Boolean) as QuoteScope[];
  return nextScopes.length > 0 ? [...prev, ...nextScopes] : prev;
}

async function recognise(input: string, area: number, key: string, setBusy: (v: boolean) => void, setTrades: (v: TradeAnalysis[]) => void, setFallback: (v: boolean) => void, setModel: (v: string) => void, flash: (v: string) => void) {
  if (!input.trim()) return flash('Type a scope description first.');
  setBusy(true); setTrades([]);
  const result = await analyseScope(input, area, key || undefined);
  setTrades(result.trades); setFallback(result.fallback);
  if (result.model) setModel(result.model);
  flash(result.trades.length === 0 ? 'No trades detected — try adding more detail to your scope.' : result.fallback ? `Found ${result.trades.length} trades (keyword fallback)` : `AI detected ${result.trades.length} trades with pre-filled items`);
  setBusy(false);
}

async function polish(input: string, key: string, setBusy: (v: boolean) => void, setInput: (v: string) => void, setModel: (v: string) => void) {
  if (!key || !input.trim()) return;
  setBusy(true);
  const result = await polishScopeWithAI(input, key);
  setInput(result.text); if (result.model) setModel(result.model);
  setBusy(false);
}
