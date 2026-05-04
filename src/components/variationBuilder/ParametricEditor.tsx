import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ParametricItem } from '../../types/domain';
import { getUnitsForCategory } from '../../utils/pricing/parametricUnits';
import { formatCurrency, generateId } from '../../utils/helpers';

type Props = { categoryId: string; items: ParametricItem[]; onChange: (items: ParametricItem[]) => void };

export default function ParametricEditor({ categoryId, items, onChange }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const availableUnits = getUnitsForCategory(categoryId);
  const update = (index: number, patch: Partial<ParametricItem>) => { const next = [...items]; next[index] = { ...next[index], ...patch }; onChange(next); };
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const total = items.reduce((sum, i) => sum + i.rate * i.quantity, 0);

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
      <div className="flex items-center justify-between mb-3"><h4 className="font-semibold text-blue-900">Parametric BoQ Items</h4><span className="text-sm font-medium text-blue-700">{items.length} items · {formatCurrency(total)}</span></div>
      {items.length > 0 && (<div className="mb-3 space-y-2">{items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-2 rounded-lg bg-white border border-blue-200 p-2 text-sm">
          <span className="flex-1 min-w-0 truncate font-medium text-slate-900">{item.label}</span>
          <span className="text-xs text-slate-400">{item.unit}</span>
          <input type="number" value={item.quantity} onChange={(e) => update(i, { quantity: Number(e.target.value) })} className="w-16 rounded border border-slate-300 px-1 py-0.5 text-right text-sm" />
          <span className="text-xs text-slate-400">@$</span>
          <input type="number" value={item.rate} onChange={(e) => update(i, { rate: Number(e.target.value) })} className="w-20 rounded border border-slate-300 px-1 py-0.5 text-right text-sm" />
          <span className="text-xs font-medium text-slate-700 w-20 text-right">{formatCurrency(item.rate * item.quantity)}</span>
          <button onClick={() => remove(i)} className="rounded p-1 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>))}</div>)}
      {showAdd ? (
        <div className="space-y-2 rounded-lg border border-blue-300 bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-800">Select items to add:</p>
          <div className="max-h-48 overflow-y-auto space-y-1">{availableUnits.filter((u) => !items.some((item) => item.unitId === u.id)).map((unit) => (
            <button key={unit.id} onClick={() => { onChange([...items, { id: generateId(), unitId: unit.id, label: unit.label, unit: unit.unit as ParametricItem['unit'], rate: unit.rate, quantity: unit.defaultQty || 1 }]); }} className="w-full text-left rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm hover:bg-blue-50">
              <span className="font-medium">{unit.label}</span> <span className="text-xs text-slate-500">· {unit.unit} · ${unit.rate}</span>
            </button>))}</div>
          <button onClick={() => setShowAdd(false)} className="text-xs text-slate-500 hover:text-slate-700">Close</button>
        </div>
      ) : availableUnits.length > 0 && (<button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"><Plus className="h-3.5 w-3.5" /> Add BoQ Item</button>)}
    </div>
  );
}
