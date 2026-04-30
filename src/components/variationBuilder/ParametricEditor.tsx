import React, { useState } from 'react';
import { BoQItem, TradeCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { tradeCategories } from '../../data/tradeCategories';
import { getRememberedRate } from '../../utils/rateMemory';

interface ParametricEditorProps {
  items: BoQItem[];
  onItemsChange: (items: BoQItem[]) => void;
  onRateChange: (itemId: string, newRate: number) => void;
}

const ParametricEditor: React.FC<ParametricEditorProps> = ({ 
  items, 
  onItemsChange, 
  onRateChange 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TradeCategory | null>(null);

  const handleRemoveItem = (itemId: string) => {
    onItemsChange(items.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    onItemsChange(items.map(item => 
      item.id === itemId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleAddItem = () => {
    if (!selectedCategory) return;

    // NEW: Check for remembered rate before creating item
    const rememberedRate = getRememberedRate(selectedCategory.id);

    const newItem: BoQItem = {
      id: Date.now().toString(),
      type: 'parametric',
      categoryId: selectedCategory.id,
      name: selectedCategory.name,
      unit: selectedCategory.unit,
      // Use remembered rate if available, otherwise default or 0
      rate: rememberedRate ?? selectedCategory.defaultRate ?? 0, 
      quantity: 0,
      isRateOverridden: !!rememberedRate // Mark as overridden if we used memory
    };

    onItemsChange([...items, newItem]);
    setSelectedCategory(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-gray-700">Bill of Quantities Items</h4>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition"
        >
          {isAdding ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded border mb-4 animate-fade-in">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Item Type</label>
          <select 
            className="w-full p-2 border rounded mb-3"
            value={selectedCategory?.id || ''}
            onChange={(e) => {
              const cat = tradeCategories.find(c => c.id === e.target.value);
              setSelectedCategory(cat || null);
            }}
          >
            <option value="">-- Choose a trade item --</option>
            {tradeCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name} ({cat.unit})</option>
            ))}
          </select>
          
          {selectedCategory && (
            <div className="flex justify-end">
              <button 
                onClick={handleAddItem}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 text-sm"
              >
                Add {selectedCategory.name}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Unit Rate ($)</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.name}
                  <div className="text-xs text-gray-500">{item.unit}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseFloat(e.target.value) || 0)}
                    className="w-24 p-1 text-right border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      value={item.rate || ''}
                      onChange={(e) => onRateChange(item.id, parseFloat(e.target.value) || 0)}
                      className={`w-28 p-1 text-right border rounded outline-none ${
                        item.isRateOverridden 
                          ? 'border-green-500 bg-green-50 text-green-700 font-bold' 
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {item.isRateOverridden && (
                      <span className="text-xs text-green-600 ml-2" title="Saved Rate">💾</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCurrency((item.quantity || 0) * (item.rate || 0))}
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-xs underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 italic">
                  No items added. Click "+ Add Item" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParametricEditor;
