import { useState, useMemo } from 'react';
import { X, Check, TrendingUp } from 'lucide-react';
import { calculateMaterialEscalationFactor, getEscalatedMaterialRate } from '../../utils/rates/materialRates2021';
import { RAWLINSONS_MATERIAL_RATES_2021_METADATA } from '../../utils/rates/materialRateMetadata';
import { MATERIAL_RATE_CATEGORIES } from '../../utils/rates/materialRates2021';
import type { MaterialRate } from '../../utils/rates/materialRateTypes';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  onClose: () => void;
  onSelect: (rate: MaterialRate, escalatedRate: number, escalationFactor: number) => void;
  categoryId?: string;
};

export function MaterialPcSelectorModal({ onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRates = useMemo(() => {
    const rates = selectedCategory === 'all'
      ? MATERIAL_RATE_CATEGORIES.flatMap((c) => c.items.map((item) => ({ item, category: c.label })))
      : MATERIAL_RATE_CATEGORIES.filter((c) => c.key === selectedCategory)
        .flatMap((c) => c.items.map((item) => ({ item, category: c.label })));
    if (!search) return rates;
    const q = search.toLowerCase();
    return rates.filter((r) => `${r.item.item} ${r.item.unit} ${r.item.type}`.toLowerCase().includes(q));
  }, [search, selectedCategory]);

  const escalationFactor = calculateMaterialEscalationFactor();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Select Material / P.C. Rate</h2>
            <p className="text-xs text-slate-500 mt-0.5">Rawlinsons 2021 — escalated to {MATERIAL_RATE_ESCALATION_TARGET_YEAR} at {(DEFAULT_MATERIAL_ESCALATION_RATE * 100).toFixed(1)}% p.a.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-4 space-y-3 border-b border-slate-100">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search materials... (e.g. basin, benchtop, tile)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            autoFocus
          />
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >All</button>
            {MATERIAL_RATE_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${selectedCategory === cat.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >{cat.label}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredRates.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-8">No rates found.</p>
          )}
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <th className="px-3 py-2">Item</th>
                <th className="px-2 py-2 text-right">Unit</th>
                <th className="px-2 py-2 text-right">2021</th>
                <th className="px-2 py-2 text-right"><TrendingUp className="h-3 w-3 inline" /></th>
                <th className="px-2 py-2 text-right">Escalated</th>
                <th className="px-2 py-2 text-center">Type</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRates.map(({ item, category }, i) => {
                const esc = getEscalatedMaterialRate(item, escalationFactor);
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-900">{item.item}</p>
                      <p className="text-[10px] text-slate-400">{category}</p>
                    </td>
                    <td className="px-2 py-2 text-right text-slate-600">{item.unit}</td>
                    <td className="px-2 py-2 text-right text-slate-500">${item.rate}</td>
                    <td className="px-2 py-2 text-right text-amber-600 text-xs">x{escalationFactor.toFixed(3)}</td>
                    <td className="px-2 py-2 text-right font-semibold text-slate-900">{formatCurrency(esc)}</td>
                    <td className="px-2 py-2 text-center">
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${item.type === 'pc_value' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {item.type === 'pc_value' ? 'PC' : 'Supply'}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => onSelect(item, esc, escalationFactor)}
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white p-1.5 transition-colors"
                        title="Apply rate"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 p-3 text-[10px] text-slate-400 text-center">
          {RAWLINSONS_MATERIAL_RATES_2021_METADATA.source} · {RAWLINSONS_MATERIAL_RATES_2021_METADATA.pricing_notes}
        </div>
      </div>
    </div>
  );
}

const MATERIAL_RATE_ESCALATION_TARGET_YEAR = 2025;
const DEFAULT_MATERIAL_ESCALATION_RATE = 0.05;
