import { useState } from 'react';
import { CATEGORY_GROUPS } from '../../utils/categories/types';

type CategoryOption = { id: string; label: string };
type Props = { showCategoryBrowser: boolean; setShowCategoryBrowser: (value: boolean) => void; groupedCategories: Record<string, CategoryOption[]>; addedIds: string[]; onToggleCategory: (categoryId: string, isAdded: boolean) => void };

export function CategoryBrowserPanel({ showCategoryBrowser, setShowCategoryBrowser, groupedCategories, addedIds, onToggleCategory }: Props) {
  const [search, setSearch] = useState('');

  if (!showCategoryBrowser) {
    return (<button type="button" onClick={() => setShowCategoryBrowser(true)} className="w-full rounded-xl border-2 border-dashed border-slate-300 py-4 text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600">Browse All Categories</button>);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-slate-900">Browse Categories</h3><button onClick={() => setShowCategoryBrowser(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button></div>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories…" className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <div className="max-h-96 overflow-y-auto space-y-4">
        {Object.entries(groupedCategories).map(([group, categories]) => {
          const filtered = categories.filter((c) => !search || c.label.toLowerCase().includes(search.toLowerCase()));
          if (filtered.length === 0) return null;
          return (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{CATEGORY_GROUPS[group] || group}</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {filtered.map((cat) => {
                  const isAdded = addedIds.includes(cat.id);
                  return (<button key={cat.id} type="button" onClick={() => onToggleCategory(cat.id, isAdded)} className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${isAdded ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'}`}>
                    <span className="font-medium">{cat.label}</span>{isAdded && <span className="ml-1 text-xs text-emerald-600">✓</span>}
                  </button>);
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
