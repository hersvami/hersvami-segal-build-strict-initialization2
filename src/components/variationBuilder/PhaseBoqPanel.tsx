import { Layers3 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { PHASE_LABELS, PHASE_ORDER, type PhaseKey } from './phaseGrouping';

type PhaseItem = { id: string; label: string; trade: string; cost: number; source: 'stage' | 'parametric' };

export function PhaseBoqPanel({ phaseGroups }: { phaseGroups: Record<PhaseKey, PhaseItem[]> }) {
  if (!PHASE_ORDER.some((phase) => phaseGroups[phase].length > 0)) return null;
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
      <div className="mb-3 flex items-center gap-2"><Layers3 className="h-4 w-4 text-indigo-700" /><h4 className="text-sm font-semibold text-indigo-900">Phase Grouped BoQ</h4></div>
      <div className="space-y-3">{PHASE_ORDER.filter((phase) => phaseGroups[phase].length > 0).map((phase) => <PhaseBlock key={phase} phase={phase} items={phaseGroups[phase]} />)}</div>
    </div>
  );
}

function PhaseBlock({ phase, items }: { phase: PhaseKey; items: PhaseItem[] }) {
  const total = items.reduce((sum, item) => sum + item.cost, 0);
  return (
    <div className="rounded-lg border border-indigo-100 bg-white p-3">
      <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{PHASE_LABELS[phase]}</span><span className="text-xs font-medium text-indigo-900">{formatCurrency(total)}</span></div>
      <div className="space-y-1.5">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 text-sm"><div className="min-w-0"><div className="font-medium text-slate-800">{item.label}</div><div className="text-xs text-slate-500">{item.trade} · {item.source === 'parametric' ? 'BoQ item' : 'Stage'}</div></div><span className="shrink-0 text-slate-700">{formatCurrency(item.cost)}</span></div>)}</div>
    </div>
  );
}