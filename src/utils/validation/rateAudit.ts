import { getAllParametricUnits } from '../pricing/parametricUnits';
import { TRADE_RATE_DIRECTORY } from '../trades/tradeRateDirectory';

export type RateAuditSummary = {
  totalTradeRates: number;
  totalUnitRates: number;
  unverifiedTradeRates: number;
  unverifiedUnitRates: number;
};

export function getRateAuditSummary(): RateAuditSummary {
  const tradeRates = TRADE_RATE_DIRECTORY;
  const unitRates = getAllParametricUnits();
  return {
    totalTradeRates: tradeRates.length,
    totalUnitRates: unitRates.length,
    unverifiedTradeRates: tradeRates.filter((item) => item.rateConfidence === 'benchmark_unverified').length,
    unverifiedUnitRates: unitRates.filter((item) => item.rateConfidence === 'benchmark_unverified').length,
  };
}

export function hasUnverifiedRates(): boolean {
  const summary = getRateAuditSummary();
  return summary.unverifiedTradeRates > 0 || summary.unverifiedUnitRates > 0;
}
