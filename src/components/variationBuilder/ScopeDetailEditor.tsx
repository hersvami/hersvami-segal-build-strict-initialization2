import { useMemo } from 'react';
import type { ParametricItem, QuoteScope } from '../../types/domain';
import type { TradeAnalysis } from '../../utils/ai/tradeAnalyser';
import { getCategoryById } from '../../utils/categories/extended';
import { calcScopeTotal } from '../../utils/pricing/engine';
import { hasParametricUnits } from '../../utils/pricing/parametricUnits';
import { formatCurrency } from '../../utils/helpers';
import { CategoryQuestions } from './CategoryQuestions';
import { EditableList } from './EditableList';
import { ParametricEditor } from './ParametricEditor';
import { PhaseBoqPanel } from './PhaseBoqPanel';
import { ScopeDimensions } from './ScopeDimensions';
import { StageListEditor } from './StageListEditor';
import { groupBoqByPhase } from './phaseGrouping';

type Props = {
  scope: QuoteScope;
  index: number;
  tradeAnalysis?: TradeAnalysis;
  onChange: (next: QuoteScope) => void;
};

export function ScopeDetailEditor({ scope, index, tradeAnalysis, onChange }: Props) {
  void tradeAnalysis;
  const update = (patch: Partial<QuoteScope>) => onChange({ ...scope, ...patch });
  const setParametric = (items: ParametricItem[]) => update({ parametricItems: items });
  const category = getCategoryById(scope.categoryId);
  const total = calcScopeTotal(scope);
  const phaseGroups = useMemo(
    () => groupBoqByPhase(scope.categoryId, scope.stages, scope.parametricItems || []),
    [scope.categoryId, scope.parametricItems, scope.stages],
  );

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">{index + 1}</span>
          {scope.categoryLabel}
        </h3>
        {total > 0 && <span className="text-sm font-medium text-slate-500">Subtotal: {formatCurrency(total)}</span>}
      </div>

      <div>
        <label className="text-xs text-slate-500">Scope Description</label>
        <textarea
          value={scope.description}
          onChange={(e) => update({ description: e.target.value })}
          className="mt-1 min-h-[180px] w-full rounded-lg border border-slate-300 px-3 py-3 text-sm leading-relaxed"
          placeholder="Describe the scope of works…"
        />
      </div>

      <CategoryQuestions scope={scope} onChange={onChange} />
      <ScopeDimensions category={category} scope={scope} onChange={update} />
      {(category?.usesParametric || hasParametricUnits(scope.categoryId)) && (
        <ParametricEditor categoryId={scope.categoryId} items={scope.parametricItems || []} onChange={setParametric} />
      )}
      <PhaseBoqPanel phaseGroups={phaseGroups} />
      <StageListEditor stages={scope.stages} onChange={(stages) => update({ stages })} />
      <EditableList title="Inclusions" items={scope.inclusions} onChange={(inclusions) => update({ inclusions })} color="emerald" icon="✓" />
      <EditableList title="Exclusions" items={scope.exclusions} onChange={(exclusions) => update({ exclusions })} color="red" icon="✗" />
    </div>
  );
}