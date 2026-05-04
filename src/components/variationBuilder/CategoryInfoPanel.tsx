import { useMemo } from 'react';
import { getCategoryById } from '../../utils/categories/extended';

type Props = { categoryId: string; onClose: () => void };

export function CategoryInfoPanel({ categoryId, onClose }: Props) {
  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
  if (!category) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div><h3 className="text-lg font-bold text-slate-900">{category.icon} {category.label}</h3><span className="inline-block mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{category.group} · {category.archetype}</span></div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">Close</button>
      </div>
      {category.stages.length > 0 && (<div className="mb-3"><h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">Stages</h4><div className="space-y-1">{category.stages.map((stage, i) => (<div key={i} className="flex justify-between text-sm"><span className="text-slate-700">{stage.name}</span><span className="text-slate-500">${stage.rate}/{stage.unit}</span></div>))}</div></div>)}
      {category.pcItems.length > 0 && (<div className="mb-3"><h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">PC Items</h4><div className="space-y-1">{category.pcItems.map((item, i) => (<div key={i} className="flex justify-between text-sm"><span className="text-slate-700">{item.description}</span><span className="text-slate-500">{item.allowance ? `$${item.allowance}` : 'TBD'}</span></div>))}</div></div>)}
      {category.inclusions.length > 0 && (<div className="mb-3"><h4 className="text-xs font-semibold uppercase text-emerald-600 mb-1">Inclusions</h4><ul className="list-none space-y-0.5">{category.inclusions.map((item, i) => (<li key={i} className="text-sm text-slate-600">✓ {item}</li>))}</ul></div>)}
      {category.exclusions.length > 0 && (<div><h4 className="text-xs font-semibold uppercase text-red-500 mb-1">Exclusions</h4><ul className="list-none space-y-0.5">{category.exclusions.map((item, i) => (<li key={i} className="text-sm text-slate-600">✗ {item}</li>))}</ul></div>)}
    </div>
  );
}
