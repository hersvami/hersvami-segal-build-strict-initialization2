import { getAllParametricUnits } from '../pricing/parametricUnits';
import { getAllCategories } from '../pricing/scopeRecogniser';
import { buildTradeScopeSummary, dedupeTradeAnalyses, normaliseCategoryId } from './tradeNormaliser';
import type { TradeAnalysis, TradeItem } from './tradeAnalyserTypes';

export function parseGeminiResponse(text: string): TradeAnalysis[] {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const units = getAllParametricUnits();
    const trades: TradeAnalysis[] = [];

    for (const trade of parsed.trades || []) {
      const categoryId = normaliseCategoryId(trade.categoryId, trade.label);
      if (!getAllCategories().some((category) => category.id === categoryId)) continue;

      const items = mapTradeItems(trade.preFilledItems || [], units, true);
      const suggestions = mapTradeItems(trade.suggestedItems || [], units, false);

      trades.push({
        categoryId,
        label: getAllCategories().find((category) => category.id === categoryId)?.label || trade.label,
        confidence: trade.confidence || 0.5,
        tradeScope: buildTradeScopeSummary(trade.label || categoryId, items, trade.tradeScope || ''),
        items,
        suggestions,
        subtotal: items.reduce((sum, item) => sum + item.rate * item.quantity, 0),
      });
    }

    return dedupeTradeAnalyses(trades);
  } catch {
    return [];
  }
}

function mapTradeItems(items: any[], units: ReturnType<typeof getAllParametricUnits>, isPreFilled: boolean): TradeItem[] {
  return items
    .map((item) => {
      const unit = units.find((candidate) => candidate.id === item.unitId);
      if (!unit) return null;
      return {
        unitId: unit.id,
        label: unit.label,
        unit: unit.unit,
        rate: unit.rate,
        quantity: item.quantity || 1,
        isPreFilled,
        reason: item.reason,
      };
    })
    .filter(Boolean) as TradeItem[];
}
