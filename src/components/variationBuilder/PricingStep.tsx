import type { ParametricItem, PreliminariesSettings, PricingSourceMeta, QuoteScope } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { calcScopeTotal } from '../../utils/pricing/engine';
import { PreliminariesPanel, getPreliminariesAmount } from './PreliminariesPanel';
import { RateSourceBadge } from './RateSourceBadge';

type Props = { scopes: QuoteScope[]; setScopes: (next: QuoteScope[]) => void; preliminaries: PreliminariesSettings; setPreliminaries: (v: PreliminariesSettings) => void; ohPct: number; setOhPct: (v: number) => void; profitPct: number; setProfitPct: (v: number) => void; contingencyPct: number; setContingencyPct: (v: number) => void };

export default function PricingStep({ scopes, setScopes, preliminaries, setPreliminaries, ohPct, setOhPct, profitPct, setProfitPct, contingencyPct, setContingencyPct }: Props) {
  const tradeCost = scopes.reduce((sum, scope) => sum + calcScopeTotal(scope), 0);
  const preliminariesAmount = getPreliminariesAmount(preliminaries, tradeCost);

  const updateScope = (scopeIndex: number, next: QuoteScope) => {
    setScopes(scopes.map((scope, index) => (index === scopeIndex ? next : scope)));
  };

  const updateStageCost = (scopeIndex: number, stageIndex: number, cost: number) => {
    const scope = scopes[scopeIndex];
    const stages = scope.stages.map((stage, index) => index === stageIndex ? { ...stage, cost } : stage);
    updateScope(scopeIndex, { ...scope, stages });
  };

  const updateStageMeta = (scopeIndex: number, stageIndex: number, costType: PricingSourceMeta['costType']) => {
    const scope = scopes[scopeIndex];
    const stages = scope.stages.map((stage, index) => index === stageIndex ? { ...stage, pricingSource: { ...(stage.pricingSource || defaultMeta(stage.cost)), costType } } : stage);
    updateScope(scopeIndex, { ...scope, stages });
  };

  const updateParametricItem = (scopeIndex: number, itemIndex: number, patch: Partial<ParametricItem>) => {
    const scope = scopes[scopeIndex];
    const items = (scope.parametricItems || []).map((item, index) => index === itemIndex ? { ...item, ...patch } : item);
    updateScope(scopeIndex, { ...scope, parametricItems: items });
  };

  const updateItemCostType = (scopeIndex: number, itemIndex: number, costType: PricingSourceMeta['costType']) => {
    const scope = scopes[scopeIndex];
    const items = (scope.parametricItems || []).map((item, index) => index === itemIndex ? { ...item, pricingSource: { ...(item.pricingSource || defaultMeta(item.rate)), costType } } : item);
    updateScope(scopeIndex, { ...scope, parametricItems: items });
  };

  return (
    <div className="space-y-6">
      <div><h3 className="text-lg font-semibold text-slate-900">Pricing & Margins</h3><p className="text-sm text-slate-500 mt-1">Adjust overhead, profit and contingency margins.</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="text-sm font-medium text-slate-700">Overhead %</label><input type="number" value={ohPct} onChange={(e) => setOhPct(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
        <div><label className="text-sm font-medium text-slate-700">Profit %</label><input type="number" value={profitPct} onChange={(e) => setProfitPct(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
        <div><label className="text-sm font-medium text-slate-700">Contingency %</label><input type="number" value={contingencyPct} onChange={(e) => setContingencyPct(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
      </div>
      <PreliminariesPanel settings={preliminaries} baseTradeCost={tradeCost} onChange={setPreliminaries} />
      <div className="space-y-4">
        {scopes.map((scope, scopeIndex) => (
          <div key={scope.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">{scope.categoryLabel}</h4>
              <span className="font-semibold text-slate-900">{formatCurrency(calcScopeTotal(scope))}</span>
            </div>

            {scope.stages.length > 0 && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                <div className="grid grid-cols-[1fr_120px_130px] gap-2 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>Stage</span><span>Trade</span><span className="text-right">Cost</span>
                </div>
                {scope.stages.map((stage, stageIndex) => (
                  <div key={`${stage.name}-${stageIndex}`} className="grid grid-cols-[1fr_120px_130px] items-center gap-2 border-t border-slate-200 px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium text-slate-800">{stage.name}</p>
                      {stage.description && <p className="text-xs text-slate-500">{stage.description}</p>}
                      <RateSourceBadge meta={stage.pricingSource} onCostTypeChange={(costType) => updateStageMeta(scopeIndex, stageIndex, costType)} />
                    </div>
                    <span className="text-slate-500">{stage.trade}</span>
                    <input type="number" value={stage.cost || 0} onChange={(e) => updateStageCost(scopeIndex, stageIndex, Number(e.target.value))} className="rounded-lg border border-slate-300 px-2 py-1 text-right text-sm" />
                  </div>
                ))}
              </div>
            )}

            {(scope.parametricItems || []).length > 0 && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                <div className="grid grid-cols-[1fr_90px_110px_120px] gap-2 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>BoQ item</span><span className="text-right">Qty</span><span className="text-right">Rate</span><span className="text-right">Total</span>
                </div>
                {(scope.parametricItems || []).map((item, itemIndex) => (
                  <div key={item.id} className="grid grid-cols-[1fr_90px_110px_120px] items-center gap-2 border-t border-slate-200 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-800">{item.label}<RateSourceBadge meta={item.pricingSource} onCostTypeChange={(costType) => updateItemCostType(scopeIndex, itemIndex, costType)} /></span>
                    <input type="number" value={item.quantity} onChange={(e) => updateParametricItem(scopeIndex, itemIndex, { quantity: Number(e.target.value) })} className="rounded-lg border border-slate-300 px-2 py-1 text-right text-sm" />
                    <input type="number" value={item.rate} onChange={(e) => updateParametricItem(scopeIndex, itemIndex, { rate: Number(e.target.value) })} className="rounded-lg border border-slate-300 px-2 py-1 text-right text-sm" />
                    <span className="text-right font-semibold text-slate-800">{formatCurrency(item.rate * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 p-4 space-y-2">
        <hr className="border-slate-200" />
        <div className="flex justify-between text-sm"><span>Trade Cost Total</span><span>{formatCurrency(tradeCost)}</span></div>
        <div className="flex justify-between text-sm"><span>Preliminaries</span><span>{formatCurrency(preliminariesAmount)}</span></div>
        <div className="flex justify-between text-sm font-bold"><span>Direct Cost incl. Preliminaries</span><span>{formatCurrency(tradeCost + preliminariesAmount)}</span></div>
      </div>
    </div>
  );
}

function defaultMeta(baseRate: number): PricingSourceMeta {
  return {
    source: 'Manual override',
    sourceType: 'manual',
    costType: 'composite',
    baseRate,
    gstIncluded: false,
    preliminariesIncluded: false,
    confidence: 'benchmark_unverified',
  };
}
