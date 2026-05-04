import { Pencil, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { generateId } from '../../utils/helpers';

type ItemType = { id: string; text: string; isDefault: boolean };
type Props = { title: string; items: ItemType[]; onChange: (items: ItemType[]) => void; color: 'emerald' | 'red'; icon: string };

export function EditableList({ title, items, onChange, color, icon }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);
  const borderColor = color === 'emerald' ? 'border-emerald-200' : 'border-red-200';
  const bgColor = color === 'emerald' ? 'bg-emerald-50' : 'bg-red-50';
  const textColor = color === 'emerald' ? 'text-emerald-700' : 'text-red-700';

  const handleSave = (index: number) => { if (!draft.trim()) return; const next = [...items]; next[index] = { ...next[index], text: draft.trim() }; onChange(next); setEditing(null); setDraft(''); };
  const handleAdd = () => { if (!draft.trim()) return; onChange([...items, { id: generateId(), text: draft.trim(), isDefault: false }]); setDraft(''); setAdding(false); };
  const handleRemove = (index: number) => { onChange(items.filter((_, i) => i !== index)); };

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-3`}>
      <h4 className={`text-xs font-semibold uppercase ${textColor} mb-2`}>{icon} {title}</h4>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {editing === i ? (<><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave(i)} className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm" autoFocus /><button onClick={() => handleSave(i)} className="text-xs font-medium text-blue-600">Save</button><button onClick={() => setEditing(null)} className="text-xs text-slate-400">Cancel</button></>
            ) : (<><span className="flex-1 text-slate-700">{item.text}</span><button onClick={() => { setEditing(i); setDraft(item.text); }} className="text-slate-400 hover:text-slate-600"><Pencil className="h-3 w-3" /></button><button onClick={() => handleRemove(i)} className="text-slate-400 hover:text-red-600"><X className="h-3 w-3" /></button></>)}
          </div>
        ))}
      </div>
      {adding ? (
        <div className="mt-2 flex items-center gap-2"><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="Type item…" className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm" autoFocus /><button onClick={handleAdd} className="text-xs font-medium text-blue-600">Add</button><button onClick={() => setAdding(false)} className="text-xs text-slate-400">Cancel</button></div>
      ) : (<button onClick={() => setAdding(true)} className={`mt-2 flex items-center gap-1 text-xs font-medium ${textColor} hover:opacity-80`}><Plus className="h-3 w-3" /> Add</button>)}
    </div>
  );
}
