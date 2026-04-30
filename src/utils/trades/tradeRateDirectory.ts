import { TRADE_RATES_A_TO_F } from './tradeRatesAtoF';
import { TRADE_RATES_G_TO_M } from './tradeRatesGtoM';
import { TRADE_RATES_N_TO_Z } from './tradeRatesNtoZ';
import { DEFAULT_RATE_CONFIDENCE, DEFAULT_RATE_REVIEW_DATE, DEFAULT_RATE_SOURCE, type TradeRateItem } from './tradeRateTypes';

export const TRADE_RATE_DIRECTORY: TradeRateItem[] = [
  ...TRADE_RATES_A_TO_F,
  ...TRADE_RATES_G_TO_M,
  ...TRADE_RATES_N_TO_Z,
].map((item) => ({
  ...item,
  rateSource: item.rateSource || DEFAULT_RATE_SOURCE,
  rateConfidence: item.rateConfidence || DEFAULT_RATE_CONFIDENCE,
  lastReviewed: item.lastReviewed || DEFAULT_RATE_REVIEW_DATE,
})).sort((a, b) => a.trade.localeCompare(b.trade));