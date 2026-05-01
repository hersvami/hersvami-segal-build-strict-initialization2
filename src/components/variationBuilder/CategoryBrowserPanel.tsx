import React, { useState } from 'react';
import { TradeCategory } from '../../types';
import { tradeCategories } from '../../utils/tradeCategories';

type Props = {
  onAddCategory: (category: TradeCategory) => void;
  existingScopeIds: string[];
};

export default function CategoryBrowserPanel({ onAddCategory, existingScopeIds }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Group categories by their group property
  const groupedCategories = tradeCategories.reduce((acc, cat) => {
    const group = cat.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(cat);
    return acc;
  }, {} as Record<string, TradeCategory[]>);

  const groups = Object.keys(groupedCategories);

  // Filter categories based on search and group
  const filteredGroups = Object.entries(groupedCategories).filter(([group, cats]) => {
    if (selectedGroup !== 'all' && group !== selectedGroup) return false;
    
    const filteredCats = cats.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filteredCats.length > 0;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search trades (e.g., Plumbing, Electrical)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Groups</option>
          {groups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      {/* Categories List */}
      <div className="space-y-6">
        {filteredGroups.map(([group, categories]) => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {group}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => {
                // FIX: Safely check if category is already added to prevent crash
                const isAdded = (existingScopeIds || []).includes(cat.id);
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => !isAdded && onAddCategory(cat)}
                    disabled={isAdded}
                    className={`
                      flex items-start p-4 rounded-lg border text-left transition-all
                      ${isAdded 
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed' 
                        : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer'
                      }
                    `}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900">{cat.name}</h4>
                        {isAdded && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            Added
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{cat.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-400">Unit: {cat.unit}</span>
                        {cat.defaultRate > 0 && (
                          <span className="text-xs text-slate-400">• Est. ${cat.defaultRate}/{cat.unit}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No trades found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}