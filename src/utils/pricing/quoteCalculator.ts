/* ─── Segal Build — Quote Calculator ─── */
import type { QuotePricing } from '../../types/domain';

const GST_RATE = 0.10;

export function calculateQuote(
  tradeCost: number,
  overheadPercent: number,
  profitPercent: number,
  contingencyPercent: number,
): QuotePricing {
  const overhead = tradeCost * (overheadPercent / 100);
  const trueCost = tradeCost + overhead;
  const profit = trueCost * (profitPercent / 100);
  const clientTotal = trueCost + profit;
  const contingency = clientTotal * (contingencyPercent / 100);
  const subtotal = clientTotal + contingency;
  const gst = subtotal * GST_RATE;
  const totalIncGst = subtotal + gst;

  const roundedTradeCost = Math.round(tradeCost);
  const roundedOverhead = Math.round(overhead);
  const roundedProfit = Math.round(profit);
  const roundedContingency = Math.round(contingency);
  const roundedGst = Math.round(gst);
  const roundedSubtotal = Math.round(subtotal);
  const roundedTotalIncGst = Math.round(totalIncGst);

  return {
    overheadPercent,
    profitPercent,
    contingencyPercent,
    gstPercent: 10,
    tradeCost: roundedTradeCost,
    overhead: roundedOverhead,
    profit: roundedProfit,
    contingency: roundedContingency,
    gst: roundedGst,
    clientTotal: Math.round(clientTotal),
    totalIncGst: roundedTotalIncGst,

    // Supplement optional structural parameters for components
    total: roundedTotalIncGst,
    overheadAmount: roundedOverhead,
    profitAmount: roundedProfit,
    contingencyAmount: roundedContingency,
    subtotalExclGst: roundedSubtotal,
    gstAmount: roundedGst,
  };
}

export function calculateStage(
  rate: number,
  unit: 'area' | 'linear' | 'item' | 'allow',
  dimensions: { width: number; length: number; height: number },
  quantity: number = 1,
): number {
  switch (unit) {
    case 'area':
      return rate * (dimensions.width * dimensions.length);
    case 'linear':
      return rate * dimensions.width;
    case 'item':
      return rate * quantity;
    case 'allow':
      return rate;
    default:
      return rate;
  }
}

export function calculateScope(
  stages: Array<{ rate: number; unit: 'area' | 'linear' | 'item' | 'allow'; duration: number }>,
  dimensions: { width: number; length: number; height: number },
): { totalCost: number; totalDuration: number } {
  let totalCost = 0;
  let totalDuration = 0;
  for (const stage of stages) {
    totalCost += calculateStage(stage.rate, stage.unit, dimensions);
    totalDuration += stage.duration;
  }
  return {
    totalCost: Math.round(totalCost),
    totalDuration: Math.round(totalDuration * 10) / 10,
  };
}
