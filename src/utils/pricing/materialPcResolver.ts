import type { PricingSourceMeta } from '../../types/domain';
import { calculateMaterialEscalationFactor, findMaterialRate, getEscalatedMaterialRate } from '../rates/materialRates2021';
import { RAWLINSONS_MATERIAL_RATES_2021_METADATA } from '../rates/materialRateMetadata';
import type { MaterialRate } from '../rates/materialRateTypes';
import type { ResolvedBenchmarkRate } from './benchmarkTypes';

export function resolveMaterialPcRate(query: string): ResolvedBenchmarkRate | undefined {
  const match = findMaterialRate(query);
  if (!match) return undefined;
  const escalationFactor = calculateMaterialEscalationFactor();
  const rate = getEscalatedMaterialRate(match, escalationFactor);

  return {
    rate,
    label: match.item,
    unit: match.unit,
    meta: buildMaterialMeta(match, rate, escalationFactor),
  };
}

function buildMaterialMeta(match: MaterialRate, escalatedRate: number, escalationFactor: number): PricingSourceMeta {
  return {
    source: RAWLINSONS_MATERIAL_RATES_2021_METADATA.source,
    sourceType: 'benchmark',
    costType: match.type === 'supply_only' ? 'material_only' : 'pc_value',
    baseRate: match.rate,
    escalationFactor,
    escalatedRate,
    gstIncluded: RAWLINSONS_MATERIAL_RATES_2021_METADATA.gst_included,
    preliminariesIncluded: false,
    confidence: 'benchmark_unverified',
    baseDate: RAWLINSONS_MATERIAL_RATES_2021_METADATA.base_date,
    notes: match.notes || RAWLINSONS_MATERIAL_RATES_2021_METADATA.pricing_notes,
  };
}