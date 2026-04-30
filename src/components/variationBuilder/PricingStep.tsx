import { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import type { QuoteScope } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { calcScopeTotal } from '../../utils/pricing/engine';

type Props = {
  scopes: QuoteScope[];
  setScopes: (scopes: QuoteScope[]) => void;
  ohPct: number;
  setOhPct: (v: number) => void;
  profitPct: number;
  setProfitPct: (v: number) => void;
  contingencyPct: number;
  setContingencyPct: (v: number) => void;
};

export function PricingStep({ scopes, setScopes, ohPct, setOhPct, profitPct, setProfitPct, contingencyPct, setContingencyPct }: Props) {
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  const updateStageCost = (scopeIdx: number, stageIdx: number, cost: number) => {
    const next = [...scopes];
    const stages = [...next[scopeIdx].stages];
    stages[stageIdx] = { ...stages[stageIdx], cost };
    next[scopeIdx] = { ...next[scopeIdx], stages };
    setScopes(next);
  };

  const updateStageNote = (scopeIdx: number, stageIdx: number, note: string) => {
    const next = [...scopes];
    const stages = [...next[scopeIdx].stages];
    stages[stageIdx] = { ...stages[stageIdx], rateOverrideNote: note || undefined };
    next[scopeIdx] = { ...next[scopeIdx], stages };
    setScopes(next);
  };

  const updateParamRate = (scopeIdx: number, itemId: string, rate: number) => {
    const next = [...scopes];
    const items = [...(next[scopeIdx].parametricItems || [])];
    next[scopeIdx] = { ...next[scopeIdx], parametricItems: items.map((it) => it.id === itemId ? { ...it, rate } : it) };
    setScopes(next);
  };

  const updateParamNote = (scopeIdx: number, itemId: string, note: string) => {
    const next = [...scopes];
    const items = [...(next[scopeIdx].parametricItems || [])];
    next[scopeIdx] = { ...next[scopeIdx], parametricItems: items.map((it) => it.id === itemId ? { ...it, notes: note || undefined } : it) };
    setScopes(next);
  };

  const openNoteEditor = (key: string, current?: string) => {
    setEditingNote(key);
    setDraftNote(current || '');
  };

  const saveNote = (scopeIdx: number, itemIdx: number, isParam: boolean, paramId?: string) => {
    if (isParam && paramId) updateParamNote(scopeIdx, paramId, draftNote.trim());
    else updateStageNote(scopeIdx, itemIdx, draftNote.trim());
    setEditingNote(null);
    setDraftNote('');
  };

  const rawTotal = scopes.reduce((sum, s) => sum + calcScopeTotal(s), 0);
  const ohAmount = rawTotal * (ohPct / 100);
  const profitAmount = (rawTotal + ohAmount) * (profitPct / 100);
  const contingencyAmount = (rawTotal + ohAmount + profitAmount) * (contingencyPct / 100);
  const subtotalExclGst = rawTotal + ohAmount + profitAmount + contingencyAmount;
  const gst = subtotalExclGst * 0.1;
  const total = subtotalExclGst + gst;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Pricing & Items</h3>
        <p className="text-sm text-slate-500 mt-1">Review and adjust trade costs. Click ✏️ to add a rate override note (e.g. "Rawlinsons VIC 2025").</p>
      </div>

      <div className="space-y-4">
        {scopes.map((scope, si) => {
          const scopeTotal = calcScopeTotal(scope);
          const paramItems = scope.parametricItems || [];
          return (
            <div key={scope.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-900">{scope.categoryLabel}</h4>
                <span className="text-sm font-medium text-slate-500">{formatCurrency(scopeTotal)}</span>
              </div>

              {/* Stages */}
              {scope.stages.length > 0 && (
                <div className="space-y-2 mb-3">
                  <h5 className="text-xs font-semibold uppercase text-slate-400">Stages</h5>
                  {scope.stages.map((stage, ti) => {
                    const noteKey = `stage-${si}-${ti}`;
                    return (
                      <div key={ti}>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex-1 text-slate-600">{stage.name}</span>
                          <span className="text-xs text-slate-400">{stage.trade}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-400">$</span>
                            <input type="number" value={stage.cost || 0}
                              onChange={(e) => updateStageCost(si, ti, Number(e.target.value))}
                              className="w-24 rounded border border-slate-200 px-2 py-1 text-right text-sm" />
                          </div>
                          <button onClick={() => openNoteEditor(noteKey, stage.rateOverrideNote)}
                            className="rounded p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50" title="Rate override note">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {stage.rateOverrideNote && editingNote !== noteKey && (
                          <p className="ml-1 mt-0.5 text-[11px] text-amber-700 italic">📝 {stage.rateOverrideNote}</p>
                        )}
                        {editingNote === noteKey && (
                          <div className="mt-1 flex items-center gap-2">
                            <input value={draftNote} onChange={(e) => setDraftNote(e.target.value)}
                              placeholder="e.g. Rawlinsons VIC 2025 — $95/m²"
                              className="flex-1 rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs" autoFocus />
                            <button onClick={() => saveNote(si, ti, false)} className="text-xs font-medium text-amber-700">Save</button>
                            <button onClick={() => setEditingNote(null)} className="text-slate-400"><X className="h-3 w-3" /></button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Parametric items */}
              {paramItems.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase text-slate-400">BoQ Items</h5>
                  {paramItems.map((item) => {
                    const noteKey = `param-${si}-${item.id}`;
                    return (
                      <div key={item.id}>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex-1 text-slate-600">{item.label}</span>
                          <span className="text-xs text-slate-400">{item.unit}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-400">$</span>
                            <input type="number" value={item.rate}
                              onChange={(e) => updateParamRate(si, item.id, Number(e.target.value))}
                              className="w-20 rounded border border-slate-200 px-2 py-1 text-right text-sm" />
                          </div>
                          <span className="text-xs text-slate-400">× {item.quantity}</span>
                          <span className="w-20 text-right text-sm font-medium">{formatCurrency(item.rate * item.quantity)}</span>
                          <button onClick={() => openNoteEditor(noteKey, item.notes)}
                            className="rounded p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50" title="Rate override note">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {item.notes && editingNote !== noteKey && (
                          <p className="ml-1 mt-0.5 text-[11px] text-amber-700 italic">📝 {item.notes}</p>
                        )}
                        {editingNote === noteKey && (
                          <div className="mt-1 flex items-center gap-2">
                            <input value={draftNote} onChange={(e) => setDraftNote(e.target.value)}
                              placeholder="e.g. Rawlinsons VIC 2025 — $95/m²"
                              className="flex-1 rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs" autoFocus />
                            <button onClick={() => saveNote(si, 0, true, item.id)} className="text-xs font-medium text-amber-700">Save</button>
                            <button onClick={() => setEditingNote(null)} className="text-slate-400"><X className="h-3 w-3" /></button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Markup controls */}
      <div className="rounded-xl border border-slate-200 p-4 space-y-4">
        <h4 className="font-medium text-slate-900">Markup</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-500">Overhead %</label>
            <input type="number" value={ohPct} onChange={(e) => setOhPct(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Profit %</label>
            <input type="number" value={profitPct} onChange={(e) => setProfitPct(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Contingency %</label>
            <input type="number" value={contingencyPct} onChange={(e) => setContingencyPct(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-slate-600">Trade Cost</span><span className="font-medium">{formatCurrency(rawTotal)}</span></div>
        <div className="flex justify-between"><span className="text-slate-600">Overhead ({ohPct}%)</span><span className="font-medium">{formatCurrency(ohAmount)}</span></div>
        <div className="flex justify-between"><span className="text-slate-600">Profit ({profitPct}%)</span><span className="font-medium">{formatCurrency(profitAmount)}</span></div>
        <div className="flex justify-between"><span className="text-slate-600">Contingency ({contingencyPct}%)</span><span className="font-medium">{formatCurrency(contingencyAmount)}</span></div>
        <hr className="border-blue-200" />
        <div className="flex justify-between"><span className="text-slate-600">Subtotal (excl. GST)</span><span className="font-medium">{formatCurrency(subtotalExclGst)}</span></div>
        <div className="flex justify-between"><span className="text-slate-600">GST (10%)</span><span className="font-medium">{formatCurrency(gst)}</span></div>
        <hr className="border-blue-200" />
        <div className="flex justify-between text-base"><span className="font-bold text-slate-900">Total (incl. GST)</span><span className="font-bold text-blue-700">{formatCurrency(total)}</span></div>
      </div>

      <p className="text-[11px] text-slate-400 italic">Editable defaults — verify against current Rawlinsons edition or supplier quotes (2025 rates)</p>
    </div>
  );
}