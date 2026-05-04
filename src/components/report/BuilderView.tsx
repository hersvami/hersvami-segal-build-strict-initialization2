import type { Company, Project, Variation } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { calcScopesTotal } from '../../utils/pricing/engine';
import { calculateQuote } from '../../utils/pricing/quoteCalculator';

type Props = { variation: Variation; project: Project; company: Company; onUpdate: (variation: Variation) => void };

export function BuilderView({ variation, project, company, onUpdate }: Props) {
  const reviewFlags = variation.reviewFlags || [];

  const updateAndReprice = (next: Variation) => {
    const tradeCost = calcScopesTotal(next.scopes);
    onUpdate({
      ...next,
      pricing: calculateQuote(
        tradeCost,
        next.pricing.overheadPercent,
        next.pricing.profitPercent,
        next.pricing.contingencyPercent,
        next.pricing.preliminariesAmountExGst || 0,
        next.pricing.preliminariesPercent || 0,
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const updateStageCost = (scopeIndex: number, stageIndex: number, cost: number) => {
    const scopes = variation.scopes.map((scope, sIndex) => {
      if (sIndex !== scopeIndex) return scope;
      return {
        ...scope,
        stages: scope.stages.map((stage, stIndex) => stIndex === stageIndex ? { ...stage, cost } : stage),
      };
    });
    updateAndReprice({ ...variation, scopes });
  };

  const updateBoq = (scopeIndex: number, itemIndex: number, patch: { quantity?: number; rate?: number }) => {
    const scopes = variation.scopes.map((scope, sIndex) => {
      if (sIndex !== scopeIndex) return scope;
      return {
        ...scope,
        parametricItems: (scope.parametricItems || []).map((item, iIndex) => iIndex === itemIndex ? { ...item, ...patch } : item),
      };
    });
    updateAndReprice({ ...variation, scopes });
  };

  const updateMargin = (patch: Partial<Variation['pricing']>) => {
    const nextPricing = { ...variation.pricing, ...patch };
    onUpdate({
      ...variation,
      pricing: calculateQuote(calcScopesTotal(variation.scopes), nextPricing.overheadPercent, nextPricing.profitPercent, nextPricing.contingencyPercent, nextPricing.preliminariesAmountExGst || 0, nextPricing.preliminariesPercent || 0),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-3 p-4">
      <div className="text-sm text-slate-500">{company.name} · {project.name}</div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">Edit saved quote pricing</div>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-xs text-slate-600">Overhead %<input type="number" value={variation.pricing.overheadPercent} onChange={(e) => updateMargin({ overheadPercent: Number(e.target.value) })} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" /></label>
          <label className="text-xs text-slate-600">Profit %<input type="number" value={variation.pricing.profitPercent} onChange={(e) => updateMargin({ profitPercent: Number(e.target.value) })} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" /></label>
          <label className="text-xs text-slate-600">Contingency %<input type="number" value={variation.pricing.contingencyPercent} onChange={(e) => updateMargin({ contingencyPercent: Number(e.target.value) })} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" /></label>
        </div>
      </div>
      <div className="space-y-3">
        {variation.scopes.map((scope, scopeIndex) => (
          <div key={scope.id} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 flex justify-between text-sm font-semibold"><span>{scope.categoryLabel}</span><span>{formatCurrency(calcScopesTotal([scope]))}</span></div>
            {scope.stages.map((stage, stageIndex) => (
              <div key={`${stage.name}-${stageIndex}`} className="grid grid-cols-[1fr_100px_110px] items-center gap-2 border-t border-slate-100 py-2 text-sm">
                <div><p className="font-medium text-slate-800">{stage.name}</p><p className="text-xs text-slate-500">{stage.description}</p></div>
                <span className="text-xs text-slate-500">{stage.trade}</span>
                <input type="number" value={stage.cost || 0} onChange={(e) => updateStageCost(scopeIndex, stageIndex, Number(e.target.value))} className="rounded border border-slate-300 px-2 py-1 text-right text-sm" />
              </div>
            ))}
            {(scope.parametricItems || []).map((item, itemIndex) => (
              <div key={item.id} className="grid grid-cols-[1fr_70px_90px_100px] items-center gap-2 border-t border-slate-100 py-2 text-sm">
                <span className="font-medium text-slate-800">{item.label}</span>
                <input type="number" value={item.quantity} onChange={(e) => updateBoq(scopeIndex, itemIndex, { quantity: Number(e.target.value) })} className="rounded border border-slate-300 px-2 py-1 text-right text-sm" />
                <input type="number" value={item.rate} onChange={(e) => updateBoq(scopeIndex, itemIndex, { rate: Number(e.target.value) })} className="rounded border border-slate-300 px-2 py-1 text-right text-sm" />
                <span className="text-right font-semibold">{formatCurrency(item.quantity * item.rate)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="flex justify-between text-sm"><span>Trade Cost</span><span className="font-medium">{formatCurrency(variation.pricing.tradeCost)}</span></div>
        <div className="flex justify-between text-sm"><span>Overhead ({variation.pricing.overheadPercent}%)</span><span>{formatCurrency(variation.pricing.overheadAmount)}</span></div>
        <div className="flex justify-between text-sm"><span>Profit ({variation.pricing.profitPercent}%)</span><span>{formatCurrency(variation.pricing.profitAmount)}</span></div>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-semibold"><span>Total incl GST</span><span>{formatCurrency(variation.pricing.total)}</span></div>
      </div>
      {reviewFlags.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-amber-900">Saved Estimator Review Flags</h4>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{reviewFlags.length}</span>
          </div>
          <div className="space-y-1.5">
            {reviewFlags.slice(0, 6).map((flag) => (
              <div key={flag.id} className="text-xs text-amber-900">
                <span className="font-medium">{flag.severity.toUpperCase()}: {flag.title}</span>
                {flag.categoryLabel && <span className="text-amber-700"> · {flag.categoryLabel}</span>}
              </div>
            ))}
          </div>
          {reviewFlags.length > 6 && <p className="mt-2 text-xs text-amber-700">Plus {reviewFlags.length - 6} more flag(s).</p>}
        </div>
      )}
    </div>
  );
}
