import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { TRADE_DIRECTORY } from '../../utils/trades/tradeDirectory';
import { formatCurrency } from '../../utils/helpers';
import { isManualTemplateCategory } from './scopePricing';

type CategoryOption = { id: string; label: string };
type Props = {
  showCategoryBrowser: boolean;
  setShowCategoryBrowser: (value: boolean) => void;
  groupedCategories: Record<string, CategoryOption[]>;
  addedIds: string[];
  onToggleCategory: (categoryId: string, added: boolean) => void;
};

export function CategoryBrowserPanel({
  showCategoryBrowser,
  setShowCategoryBrowser,
  groupedCategories,
  addedIds,
  onToggleCategory,
}: Props) {
  const [query, setQuery] = useState('');
  const allCategories = useMemo(
    () => Object.values(groupedCategories).flat().sort((a, b) => a.label.localeCompare(b.label)),
    [groupedCategories],
  );
  const visibleCategories = allCategories.filter((category) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return category.label.toLowerCase().includes(q) || category.id.toLowerCase().includes(q);
  });
  const visibleTrades = TRADE_DIRECTORY.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return item.trade.toLowerCase().includes(q) || item.keywords.some((keyword) => keyword.includes(q));
  });

  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setShowCategoryBrowser(!showCategoryBrowser)}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
        <Plus className="h-4 w-4" />
        Browse All Categories
        {showCategoryBrowser ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {showCategoryBrowser && (
        <div className="max-h-72 space-y-4 overflow-y-auto rounded-lg bg-slate-50 p-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <strong>Manual room templates:</strong> Bathroom, Kitchen, Laundry and Toilet/WC stay available for planning notes. They do <strong>not</strong> create priced lines by default.
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Search A-Z trade list</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search trade or category..."
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase text-slate-500">Individual Trades A-Z</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {visibleTrades.map((item) => {
                const added = addedIds.includes(item.categoryId);
                return (
                  <button
                    key={item.trade}
                    type="button"
                    onClick={() => onToggleCategory(item.categoryId, added)}
                    className={`rounded-xl border px-3 py-2 text-left transition-colors ${added ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white hover:border-blue-400 hover:text-blue-700'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900">{item.trade}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${added ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                        {added ? 'Added' : 'Add'}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">Rate: {formatCurrency(item.rate)}/{item.unit} · adds scope and questions</p>
                    <p className="mt-0.5 text-[10px] text-amber-700">{item.rateConfidence === 'benchmark_unverified' ? 'Benchmark rate - verify before quoting' : item.rateSource}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase text-slate-500">Work Categories</h4>
            <div className="grid gap-2 sm:grid-cols-2">
            {visibleCategories.map((category) => {
              const added = addedIds.includes(category.id);
              const isTemplate = isManualTemplateCategory(category.id);
              return (
                <button key={category.id} type="button"
                  onClick={() => onToggleCategory(category.id, added)}
                  className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                    added ? 'border-red-200 bg-red-50' :
                    isTemplate ? 'border-amber-200 bg-amber-50 hover:border-amber-300' :
                    'border-slate-200 bg-white hover:border-blue-400 hover:text-blue-700'
                  }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900">{category.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      added ? 'bg-red-100 text-red-700' :
                      isTemplate ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {added ? 'Added' : isTemplate ? 'Template' : 'Priced'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {isTemplate ? 'Manual room guide only · no pricing by default' : 'Select to add, answer questions, then review pricing'}
                  </p>
                </button>
              );
            })}
            </div>
          </div>

          {visibleCategories.length === 0 && visibleTrades.length === 0 && <p className="text-sm text-slate-500">No matching trades found.</p>}
        </div>
      )}
    </div>
  );
}