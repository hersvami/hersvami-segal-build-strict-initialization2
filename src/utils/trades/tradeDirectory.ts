import { TRADE_RATE_DIRECTORY } from './tradeRateDirectory';
import { getTradeCategoryId } from './tradeIds';

export type TradeDirectoryItem = {
  trade: string;
  categoryId: string;
  keywords: string[];
  rate: number;
  unit: string;
  rateSource?: string;
  rateConfidence?: string;
  lastReviewed?: string;
};

export const TRADE_DIRECTORY: TradeDirectoryItem[] = TRADE_RATE_DIRECTORY.map((item) => ({
  trade: item.trade,
  categoryId: getTradeCategoryId(item.trade),
  keywords: item.keywords,
  rate: item.rate,
  unit: item.unit,
  rateSource: item.rateSource,
  rateConfidence: item.rateConfidence,
  lastReviewed: item.lastReviewed,
}));