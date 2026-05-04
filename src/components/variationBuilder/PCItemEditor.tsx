import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { PCItem } from '../../types/domain';
import { formatCurrency, generateId } from '../../utils/helpers';

type Props = { items: PCItem[]; onChange: (items: PCItem[]) => void };

export function PCItemEditor({ items, onChange }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ description: '', allowance: 0, unit: 'item' });
  const update = (index: number, patch: Partial<PCItem>) => { const next = [...items]; next[index] = { ...next[index], ...patch }; onChange(next); };
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => { if (!draft.description.trim()) return; onChange([...items, { id: generateId(), description: draft.description.trim(), allowance: draft.allowance, unit: draft.unit }]); setDraft({ description: '', allowance: 0, unit: 'item' }); setShowAdd(false); };
  const total = items.reduce((sum, it) => sum + (it.allowance || 0), 0);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
      <div className="flex items-center justify-between mb-3"><h4 className="font-semibold text-amber-900">PC Items (Prime Cost)</h4><span className="text-sm font-medium text-amber-700">{items.length} item{items.length === 1 ? '' : 's'} · {formatCurrency(total)}</span></div>
      {items.length > 0 && (<div className="mb-3 space-y-2">{items.map((item, i) => (<div key={i} className="flex items-center gap-2 rounded-lg bg-white border border-amber-200 p-2 text-sm"><input value={item.description} onChange={(e) => update(i, { description: e.target.value })} className="flex-1 min-w-0 rounded border-0 bg-transparent px-1 py-0.5 outline-none focus:bg-amber-50" /><span className="text-xs text-slate-400">$</span><input type="number" value={item.allowance} onChange={(e) => update(i, { allowance: Number(e.target.value) })} className="w-20 rounded border-0 bg-transparent px-1 py-0.5 text-right outline-none focus:bg-amber-50" /><span className="text-xs text-slate-400">/{item.unit}</span><button onClick={() => remove(i)} className="rounded p-1 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></div>))}</div>)}
      {showAdd ? (
        <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-3"><input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Item description" className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" autoFocus /><div className="grid grid-cols-2 gap-2"><div><label className="text-xs text-slate-500">Allowance ($)</label><input type="number" value={draft.allowance} onChange={(e) => setDraft({ ...draft, allowance: Number(e.target.value) })} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" /></div><div><label className="text-xs text-slate-500">Unit</label><select value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"><option value="item">Item</option><option value="lm">Lineal metre</option><option value="m2">Square metre</option><option value="set">Set</option></select></div></div><div className="flex gap-2"><button onClick={add} disabled={!draft.description.trim()} className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"><Plus className="h-3 w-3" /> Add PC Item</button><button onClick={() => setShowAdd(false)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">Cancel</button></div></div>
      ) : (<button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800"><Plus className="h-3.5 w-3.5" /> Add PC Item</button>)}
    </div>
  );
}
