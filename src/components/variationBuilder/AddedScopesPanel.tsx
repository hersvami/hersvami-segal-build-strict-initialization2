import { Trash2 } from 'lucide-react';
import type { QuoteScope } from '../../types/domain';
import { isManualTemplateCategory } from './scopePricing';

type Props = { scopes: QuoteScope[]; onRemoveScope: (categoryId: string) => void };

export function AddedScopesPanel({ scopes, onRemoveScope }: Props) {
  if (scopes.length === 0) return null;
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-emerald-900">Added Scopes ({scopes.length})</h4>
      <div className="space-y-2">
        {scopes.map((scope) => {
          const isTemplate = isManualTemplateCategory(scope.categoryId);
          return (
            <div key={scope.id} className="flex items-center justify-between rounded-lg bg-white border border-emerald-200 px-3 py-2">
              <div>
                <div className="flex items-center gap-2"><span className="font-medium text-sm text-slate-900">{scope.categoryLabel}</span>{isTemplate && (<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">Template only</span>)}</div>
                {scope.description && (<p className="text-xs text-slate-500 truncate max-w-md">{scope.description}</p>)}
                {isTemplate && (<p className="text-[11px] text-amber-700">No pricing by default — use trades for costed work.</p>)}
              </div>
              <button onClick={() => onRemoveScope(scope.categoryId)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" aria-label={`Remove ${scope.categoryLabel}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
