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
  if (fallback && fallback.trim().length > 10 && !looksLikeProjectWideScope(fallback)) return fallback;
  if (items.length === 0) return `${tradeLabel} — scope to be detailed in report`;
  const itemList = items.slice(0, 4).map((i) => i.label).join(', ');
  return `${tradeLabel}: ${itemList}${items.length > 4 ? ` +${items.length - 4} more items` : ''}`;
}

function looksLikeProjectWideScope(value: string): boolean {
  const text = value.toLowerCase();
  if (text.includes('scope of works:')) return true;
  if (/\*?\*?\s*\d+\.\s+[a-z]/i.test(value)) return true;
  const tradeMentions = ['demolition', 'plumbing', 'electrical', 'waterproofing', 'tiling', 'painting', 'cabinetry']
    .filter((term) => text.includes(term)).length;
  return tradeMentions >= 3;
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
