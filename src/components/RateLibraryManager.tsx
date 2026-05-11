import { useState, useMemo } from 'react';
import { X, Search, RotateCcw, Check, Upload, FileSpreadsheet } from 'lucide-react';
import { RateImportModal } from './RateImportModal';
import { SupplierQuoteUpload } from './SupplierQuoteUpload';
import { TRADE_RATE_DIRECTORY } from '../utils/trades/tradeRateDirectory';
import { MATERIAL_RATE_CATEGORIES } from '../utils/rates/materialRates2021';
import { RAWLINSONS_MATERIAL_RATES_2021_METADATA } from '../utils/rates/materialRateMetadata';

const OVERRIDE_KEY = 'segal_build_rate_overrides';

type TradeOverride = Record<string, number>;

function loadOverrides(): TradeOverride {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveOverrides(overrides: TradeOverride) {
  try { localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides)); } catch {}
}

type Tab = 'trades' | 'materials';

export function RateLibraryManager({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('trades');
  const [search, setSearch] = useState('');
  const [materialCat, setMaterialCat] = useState('all');
  const [overrides, setOverrides] = useState<TradeOverride>(loadOverrides);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSupplierUpload, setShowSupplierUpload] = useState(false);

  const handleImportClose = () => {
    setShowImport(false);
    setOverrides(loadOverrides());
  };

  const handleSaveOverride = () => {
    if (!editing) return;
    const n = parseFloat(draft);
    if (isNaN(n) || n <= 0) return;
    const next = { ...overrides, [editing]: n };
    setOverrides(next);
    saveOverrides(next);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetOverride = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    setOverrides(next);
    saveOverrides(next);
    setEditing(null);
  };

  const filteredTrades = useMemo(() => {
    const q = search.toLowerCase();
    return TRADE_RATE_DIRECTORY.filter(
      (t) => !q || t.trade.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.some((k) => k.includes(q)),
    );
  }, [search]);

  const filteredMaterials = useMemo(() => {
    const q = search.toLowerCase();
    const items = materialCat === 'all'
      ? MATERIAL_RATE_CATEGORIES.flatMap((c) => c.items.map((item) => ({ item, category: c.label })))
      : MATERIAL_RATE_CATEGORIES.filter((c) => c.key === materialCat)
          .flatMap((c) => c.items.map((item) => ({ item, category: c.label })));
    return items.filter((r) => !q || r.item.item.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }, [search, materialCat]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Rate Library Manager</h1>
          <p className="text-sm text-slate-500">Browse, edit, and reset Rawlinsons benchmark rates</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
          <button onClick={() => setShowImport(true)} className="flex items-center gap-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 text-sm font-medium">
            <Upload className="h-4 w-4" /> Import
          </button>
          <button onClick={() => setShowSupplierUpload(true)} className="flex items-center gap-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 text-sm font-medium">
            <FileSpreadsheet className="h-4 w-4" /> Supplier Quote
          </button>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-3 shrink-0">
        <div className="flex gap-2">
          <button onClick={() => setTab('trades')} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === 'trades' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Trade Rates</button>
          <button onClick={() => setTab('materials')} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === 'materials' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Material / P.C.</button>
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rates..." className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm" />
        </div>
        {tab === 'materials' && (
          <select value={materialCat} onChange={(e) => setMaterialCat(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="all">All categories</option>
            {MATERIAL_RATE_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {tab === 'trades' && (
          <div className="space-y-3">
            {filteredTrades.map((trade) => {
              const key = `trade_${trade.trade}`;
              const hasOverride = key in overrides;
              const currentRate = hasOverride ? overrides[key] : trade.rate;
              return (
                <div key={trade.trade} className={`rounded-lg border p-4 transition-colors ${hasOverride ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{trade.trade}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{trade.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{trade.keywords.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Unit</p>
                        <p className="text-sm font-medium text-slate-700">{trade.unit}</p>
                      </div>
                      <div className="text-right w-24">
                        <p className="text-xs text-slate-400">Benchmark</p>
                        <p className="text-sm text-slate-500">${trade.rate}</p>
                      </div>
                      <div className="text-right w-28">
                        <p className="text-xs text-slate-400">Rate</p>
                        {editing === key ? (
                          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveOverride()} onBlur={handleSaveOverride} className="w-full rounded border border-blue-300 px-2 py-1 text-sm text-right font-semibold text-blue-700 bg-white focus:outline-none" autoFocus />
                        ) : (
                          <button onClick={() => { setEditing(key); setDraft(currentRate.toString()); }} className={`text-sm font-semibold px-2 py-1 rounded transition-colors ${hasOverride ? 'text-amber-700 bg-amber-100 hover:bg-amber-200' : 'text-blue-700 hover:bg-blue-50'}`}>
                            ${currentRate}
                          </button>
                        )}
                      </div>
                      {hasOverride && (
                        <button onClick={() => handleResetOverride(key)} className="rounded p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Reset to benchmark">
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredTrades.length === 0 && <p className="text-center text-sm text-slate-500 py-8">No trade rates match your search.</p>}
          </div>
        )}

        {tab === 'materials' && (
          <div>
            <p className="text-xs text-slate-400 mb-3">{RAWLINSONS_MATERIAL_RATES_2021_METADATA.source} · GST excluded · Material escalation x{calculateEscalation().toFixed(3)}</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                  <th className="pb-2">Item</th>
                  <th className="pb-2 text-right">Unit</th>
                  <th className="pb-2 text-right">Base 2021</th>
                  <th className="pb-2 text-right">Escalated</th>
                  <th className="pb-2 text-center">Type</th>
                  <th className="pb-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map(({ item, category }) => {
                  const escalated = item.rate * calculateEscalation();
                  return (
                    <tr key={item.item} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2 font-medium text-slate-900">{item.item}</td>
                      <td className="py-2 text-right text-slate-600">{item.unit}</td>
                      <td className="py-2 text-right text-slate-500">${item.rate}</td>
                      <td className="py-2 text-right font-semibold text-slate-900">${escalated.toFixed(2)}</td>
                      <td className="py-2 text-center">
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${item.type === 'pc_value' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                          {item.type === 'pc_value' ? 'PC' : 'Supply'}
                        </span>
                      </td>
                      <td className="py-2 text-xs text-slate-500">{category}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredMaterials.length === 0 && <p className="text-center text-sm text-slate-500 py-8">No material rates match your search.</p>}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 px-6 py-3 shrink-0 text-xs text-slate-400 flex items-center justify-between">
        <span>{tab === 'trades' ? filteredTrades.length : filteredMaterials.length} rates shown</span>
        <span>{Object.keys(overrides).length} override(s) active</span>
      </div>

      {showImport && <RateImportModal onClose={handleImportClose} />}
      {showSupplierUpload && <SupplierQuoteUpload onClose={() => { setShowSupplierUpload(false); setOverrides(loadOverrides()); }} />}
    </div>
  );
}

function calculateEscalation(): number {
  const baseYear = 2021;
  const targetYear = 2025;
  const annualRate = 0.05;
  return Math.pow(1 + annualRate, targetYear - baseYear);
}
