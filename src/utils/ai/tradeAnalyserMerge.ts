import type { TradeAnalysis } from './tradeAnalyserTypes';

export function mergeDetectedTrades(primary: TradeAnalysis[], fallback: TradeAnalysis[]): TradeAnalysis[] {
  const seen = new Set(primary.map((trade) => trade.categoryId));
  const missing = fallback.filter((trade) => !seen.has(trade.categoryId));
  return [...primary, ...missing].sort((a, b) => b.confidence - a.confidence);
}
