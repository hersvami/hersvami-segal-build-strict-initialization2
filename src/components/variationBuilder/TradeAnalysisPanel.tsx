import { AlertCircle, Link2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { getTradeChainSuggestions } from '../../utils/pricing/tradeChain';
import type { TradeAnalysis } from '../../utils/ai/tradeAnalyser';

export type TradeAnalysisPanelProps = {
  tradeAnalyses: TradeAnalysis[];
  addedIds: string[];
  onAddScope: (categoryId: string) => void;
  onRemoveByCategory: (categoryId: string) => void;
  onAddAll: () => void;
  setSelectedCategoryId: (value: string) => void;
  onAcceptSuggestion: (categoryId: string, unitId: string) => void;
};

export function TradeAnalysisPanel({
  tradeAnalyses,
  addedIds,
  onAddScope,
  onRemoveByCategory,
  onAddAll,
  setSelectedCategoryId,
  onAcceptSuggestion,
}: TradeAnalysisPanelProps) {
  if (tradeAnalyses.length === 0) return null;

  const pending = tradeAnalyses.filter((t) => !addedIds.includes(t.categoryId));
  const added = tradeAnalyses.filter((t) => addedIds.includes(t.categoryId));

  return (
    <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-blue-900">
          {tradeAnalyses.length} Trade{tradeAnalyses.length !== 1 ? 's' : ''} Detected
        </h3>
        {pending.length > 0 && (
          <button type="button" onClick={onAddAll}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
            Add All {pending.length} Trades
          </button>
        )}
      </div>

      <div className="space-y-2">
        {tradeAnalyses.map((trade) => {
          const isAdded = addedIds.includes(trade.categoryId);
          const itemCount = trade.items.length;
          const suggestionCount = trade.suggestions.length;
          const previewItems = trade.items.slice(0, 3).map((i) => i.label).join(', ');
          const moreCount = itemCount - 3;
          const chainSuggestions = getTradeChainSuggestions(
            trade.categoryId,
            [...addedIds, ...tradeAnalyses.map((t) => t.categoryId)],
          );

          return (
            <div key={trade.categoryId}
              className={`rounded-lg border px-3 py-2.5 ${
                isAdded ? 'border-emerald-200 bg-emerald-50' : 'border-white bg-white shadow-sm'
              }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-900">{trade.label}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                      trade.confidence >= 0.8 ? 'bg-green-100 text-green-700' :
                      trade.confidence >= 0.5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {Math.round(trade.confidence * 100)}%
                    </span>
                    {itemCount > 0 && (
                      <span className="text-xs text-slate-500">{itemCount} items · {formatCurrency(trade.subtotal)}</span>
                    )}
                  </div>
                  {trade.tradeScope && <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">{trade.tradeScope}</p>}
                  {previewItems && (
                    <p className="mt-0.5 text-xs text-slate-500 truncate">{previewItems}{moreCount > 0 ? ` +${moreCount} more` : ''}</p>
                  )}
                  {itemCount === 0 && <p className="mt-0.5 text-xs text-slate-400">No key items — fill quantities in Details step</p>}
                  {suggestionCount > 0 && (
                    <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50/80 px-2.5 py-2">
                      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-amber-700">
                        Suggested BoQ items
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trade.suggestions.map((item) => (
                          <button
                            key={`${trade.categoryId}-${item.unitId}`}
                            type="button"
                            onClick={() => onAcceptSuggestion(trade.categoryId, item.unitId)}
                            className="rounded-full border border-amber-200 bg-white px-2 py-1 text-[11px] text-amber-800 hover:bg-amber-100"
                            title={item.reason || 'Add suggested item'}
                          >
                            Add {item.label} · {item.quantity} {item.unit} · {formatCurrency(item.rate * item.quantity)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-3 shrink-0">
                  {isAdded ? (
                    <button type="button" onClick={() => onRemoveByCategory(trade.categoryId)}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100">
                      Remove
                    </button>
                  ) : (
                    <button type="button" onClick={() => { setSelectedCategoryId(trade.categoryId); onAddScope(trade.categoryId); }}
                      className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700">
                      Add
                    </button>
                  )}
                </div>
              </div>
              {chainSuggestions.length > 0 && (
                <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50/70 px-2.5 py-2">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-blue-800">
                    <Link2 className="h-3.5 w-3.5" /> Trade Chain suggestions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {chainSuggestions.map((chain) => (
                      <button
                        key={`${trade.categoryId}-${chain.categoryId}`}
                        type="button"
                        onClick={() => { setSelectedCategoryId(chain.categoryId); onAddScope(chain.categoryId); }}
                        className="rounded-full border border-blue-200 bg-white px-2 py-1 text-[11px] text-blue-700 hover:bg-blue-100"
                        title={chain.reason}
                      >
                        Add {chain.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {added.length > 0 && (
        <p className="text-xs text-emerald-700">✓ {added.length} trade{added.length !== 1 ? 's' : ''} added — edit quantities in Details step</p>
      )}

      <div className="rounded-lg border border-dashed border-blue-200 bg-white/70 px-3 py-2 text-xs text-blue-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>These are priced trade scopes. Room templates must be added manually for planning guidance only.</span>
        </div>
      </div>
    </div>
  );
}