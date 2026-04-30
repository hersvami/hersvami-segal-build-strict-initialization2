/* ─── Segal Build — Trade Normaliser ─── */
import type { TradeAnalysis } from './tradeAnalyser';
import { getAllCategories } from '../pricing/scopeRecogniser';

export function normaliseCategoryId(categoryId: string, label?: string): string {
  const cleaned = categoryId.toLowerCase().replace(/[^a-z-]/g, '');
  if (getAllCategories().some((c) => c.id === cleaned)) return cleaned;
  const byLabel = getAllCategories().find((c) => c.label.toLowerCase().includes((label || '').toLowerCase()));
  if (byLabel) return byLabel.id;
  return cleaned;
}

export function buildTradeScopeSummary(tradeLabel: string, items: TradeAnalysis['items'], fallback?: string): string {
  if (fallback && fallback.trim().length > 10) return fallback;
  if (items.length === 0) return `${tradeLabel} — scope to be detailed in report`;
  const itemList = items.slice(0, 4).map((i) => i.label).join(', ');
  return `${tradeLabel}: ${itemList}${items.length > 4 ? ` +${items.length - 4} more items` : ''}`;
}

export function dedupeTradeAnalyses(trades: TradeAnalysis[]): TradeAnalysis[] {
  const seen = new Map<string, TradeAnalysis>();
  for (const trade of trades) {
    const existing = seen.get(trade.categoryId);
    if (!existing || trade.confidence > existing.confidence) {
      seen.set(trade.categoryId, trade);
    }
  }
  return Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence);
}
