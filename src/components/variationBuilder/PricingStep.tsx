import React, { useState } from 'react';
import { Variation, Scope, TradeScope } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import ParametricEditor from './ParametricEditor';
import { saveRateOverride } from '../../utils/rateMemory';

interface PricingStepProps {
  variation: Variation;
  onUpdate: (variation: Variation) => void;
  onBack: () => void;
  onNext: () => void;
}

const PricingStep: React.FC<PricingStepProps> = ({ 
  variation, 
  onUpdate, 
  onBack, 
  onNext 
}) => {
  const [expandedScopes, setExpandedScopes] = useState<Set<string>>(new Set());

  const toggleScope = (scopeId: string) => {
    const newExpanded = new Set(expandedScopes);
    if (newExpanded.has(scopeId)) {
      newExpanded.delete(scopeId);
    } else {
      newExpanded.add(scopeId);
    }
    setExpandedScopes(newExpanded);
  };

  const updateStageCost = (scopeId: string, newCost: number) => {
    onUpdate({
      ...variation,
      scopes: variation.scopes?.map(scope => 
        scope.id === scopeId 
          ? { ...scope, stageAllowance: newCost, isStageOverridden: true } 
          : scope
      ) || []
    });
  };

  const updateParamRate = (itemId: string, newRate: number) => {
    onUpdate(prev => {
      if (!prev.baseline || !prev.scopes) return prev;

      const updatedScopes = prev.scopes.map(scope => {
        if (scope.type !== 'trade') return scope;
        
        const updatedItems = scope.boqItems.map(item => {
          if (item.id === itemId && item.type === 'parametric') {
            return { ...item, rate: newRate, isRateOverridden: true };
          }
          return item;
        });

        return { ...scope, boqItems: updatedItems };
      });

      // NEW: Save to rate memory when user manually changes a rate
      const scope = prev.scopes.find(s => s.type === 'trade' && s.boqItems.some(i => i.id === itemId));
      if (scope && scope.type === 'trade') {
        const item = scope.boqItems.find(i => i.id === itemId);
        if (item && item.type === 'parametric' && item.categoryId) {
          saveRateOverride(item.categoryId, newRate);
        }
      }

      return { ...prev, scopes: updatedScopes };
    });
  };

  const calculateScopeTotal = (scope: Scope) => {
    if (scope.type === 'trade') {
      if (scope.stageAllowance !== undefined && scope.isStageOverridden) {
        return scope.stageAllowance;
      }
      return scope.boqItems.reduce((sum, item) => {
        if (item.type === 'parametric') {
          return sum + (item.quantity * (item.rate || 0));
        }
        return sum + (item.fixedPrice || 0);
      }, 0);
    }
    return 0;
  };

  const grandTotal = variation.scopes?.reduce((sum, scope) => sum + calculateScopeTotal(scope), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Pricing & Rates</h2>
        <p className="text-gray-600 mb-6">
          Review calculated quantities from baseline. Adjust unit rates or override total stage costs.
          <span className="block text-sm text-green-600 mt-1">💡 Green fields indicate saved rates that will be reused.</span>
        </p>

        {variation.scopes?.map(scope => (
          <div key={scope.id} className="border rounded-lg mb-4 overflow-hidden">
            <div 
              className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => toggleScope(scope.id)}
            >
              <div className="flex items-center space-x-3">
                <span className={`transform transition-transform ${expandedScopes.has(scope.id) ? 'rotate-90' : ''}`}>▶</span>
                <h3 className="font-semibold text-lg">{scope.name}</h3>
                {scope.isStageOverridden && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Manual Override</span>}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total</div>
                <div className="font-bold text-xl">{formatCurrency(calculateScopeTotal(scope))}</div>
              </div>
            </div>

            {expandedScopes.has(scope.id) && scope.type === 'trade' && (
              <div className="p-4 bg-white border-t">
                {/* Stage Cost Override */}
                <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-100">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Total Stage Cost Override (Optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={scope.stageAllowance ?? ''}
                      onChange={(e) => updateStageCost(scope.id, parseFloat(e.target.value) || 0)}
                      placeholder="Auto-calculated"
                      className="flex-1 p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Setting this ignores individual item calculations for this trade.
                  </p>
                </div>

                {/* Parametric Items Editor */}
                <ParametricEditor 
                  items={scope.boqItems.filter(i => i.type === 'parametric')}
                  onItemsChange={(newItems) => {
                    // Handle bulk changes if needed, mostly handled by individual rate updates now
                    const updatedScopes = variation.scopes?.map(s => 
                      s.id === scope.id ? { ...s, boqItems: newItems } : s
                    );
                    onUpdate({ ...variation, scopes: updatedScopes });
                  }}
                  onRateChange={updateParamRate}
                />
              </div>
            )}
          </div>
        ))}

        {(!variation.scopes || variation.scopes.length === 0) && (
          <div className="text-center py-10 text-gray-500">
            No scopes added yet. Go back to Scope Selection to add trades.
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-gray-800 text-white p-6 rounded-lg shadow-lg sticky bottom-4">
        <div>
          <div className="text-sm text-gray-400">Estimated Total</div>
          <div className="text-3xl font-bold">{formatCurrency(grandTotal)}</div>
        </div>
        <div className="flex space-x-4">
          <button onClick={onBack} className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded font-semibold transition">
            Back
          </button>
          <button onClick={onNext} className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded font-semibold transition">
            Next: Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingStep;
