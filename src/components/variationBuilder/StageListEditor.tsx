import { useState } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import type { JobStage } from '../../types/domain';

type Props = { stages: JobStage[]; onChange: (stages: JobStage[]) => void };

export function StageListEditor({ stages, onChange }: Props) {
  const [showAddStage, setShowAddStage] = useState(false);
  const [draft, setDraft] = useState({ name: '', trade: '', cost: 0, duration: 1 });
  const updateStage = (index: number, patch: Partial<JobStage>) => { const next = [...stages]; next[index] = { ...next[index], ...patch }; onChange(next); };
  const handleAddStage = () => { if (!draft.name.trim()) return; onChange([...stages, { name: draft.name.trim(), trade: draft.trade.trim() || 'General', cost: draft.cost, duration: draft.duration, description: draft.name.trim(), status: 'not-started' }]); setDraft({ name: '', trade: '', cost: 0, duration: 1 }); setShowAddStage(false); };

  return (
    <div className="space-y-1">
      <h4 className="mb-2 text-sm font-medium text-slate-700">Stages / Trades ({stages.length})</h4>
      {stages.map((stage, index) => (
        <div key={index} className="group flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-sm">
          <GripVertical className="h-3 w-3 shrink-0 text-slate-300" />
          <input value={stage.name} onChange={(e) => updateStage(index, { name: e.target.value, description: e.target.value })} className="min-w-0 flex-1 rounded border-0 bg-transparent px-1 py-0.5 font-medium text-slate-900 outline-none focus:bg-white focus:ring-1 focus:ring-blue-300" />
          <input value={stage.trade} onChange={(e) => updateStage(index, { trade: e.target.value })} className="w-24 rounded border-0 bg-transparent px-1 py-0.5 text-xs text-slate-500 outline-none focus:bg-white focus:ring-1 focus:ring-blue-300" />
          <span className="text-xs text-slate-400">$</span>
          <input type="number" value={stage.cost || 0} onChange={(e) => updateStage(index, { cost: Number(e.target.value) })} className="w-20 rounded border-0 bg-transparent px-1 py-0.5 text-right outline-none focus:bg-white focus:ring-1 focus:ring-blue-300" />
          <input type="number" value={stage.duration} onChange={(e) => updateStage(index, { duration: Number(e.target.value) })} className="w-12 rounded border-0 bg-transparent px-1 py-0.5 text-center outline-none focus:bg-white focus:ring-1 focus:ring-blue-300" />
          <span className="text-xs text-slate-400">d</span>
          <button onClick={() => onChange(stages.filter((_, i) => i !== index))} className="rounded p-1 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
      {showAddStage ? (
        <div className="mt-2 space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="grid grid-cols-2 gap-2"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Stage name" className="rounded border border-slate-300 px-2 py-1.5 text-sm" autoFocus /><input value={draft.trade} onChange={(e) => setDraft({ ...draft, trade: e.target.value })} placeholder="Trade" className="rounded border border-slate-300 px-2 py-1.5 text-sm" /></div>
          <div className="grid grid-cols-2 gap-2"><input type="number" value={draft.cost} onChange={(e) => setDraft({ ...draft, cost: Number(e.target.value) })} className="rounded border border-slate-300 px-2 py-1.5 text-sm" /><input type="number" value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: Number(e.target.value) })} className="rounded border border-slate-300 px-2 py-1.5 text-sm" /></div>
          <div className="flex gap-2"><button onClick={handleAddStage} disabled={!draft.name.trim()} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"><Plus className="h-3 w-3" /> Add Stage</button><button onClick={() => setShowAddStage(false)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">Cancel</button></div>
        </div>
      ) : (<button onClick={() => setShowAddStage(true)} className="mt-2 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Add Stage</button>)}
    </div>
  );
}
