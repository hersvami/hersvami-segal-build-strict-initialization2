import type { PricingSourceMeta } from '../../types/domain';
import { getEscalatedRawlinsonsRate } from '../rates/rawlinsons2021';
import { RAWLINSONS_2021_METADATA } from '../rates/rawlinsonsMetadata';
import type { ResolvedBenchmarkRate } from './benchmarkTypes';
import { resolveMaterialPcRate } from './materialPcResolver';

export function resolveBenchmarkRate(categoryId: string, label: string, unit?: string): ResolvedBenchmarkRate | undefined {
  const composite = getEscalatedRawlinsonsRate(categoryId, label, unit);
  if (composite && composite.cost_type !== 'material_only') {
    return {
      rate: composite.adjustedRate,
      label: composite.item,
      unit: composite.unit,
      meta: buildCompositeMeta(composite),
    };
  }

  return resolveMaterialPcRate(`${categoryId} ${label}`);
}

function buildCompositeMeta(rate: NonNullable<ReturnType<typeof getEscalatedRawlinsonsRate>>): PricingSourceMeta {
  return {
    source: RAWLINSONS_2021_METADATA.source,
    sourceType: 'benchmark',
    costType: rate.cost_type || (rate.supplyAndInstall || rate.supply_and_install ? 'composite' : 'material_only'),
    baseRate: rate.rate,
    escalationFactor: rate.escalation,
    escalatedRate: rate.adjustedRate,
    gstIncluded: rate.gstIncluded,
    preliminariesIncluded: false,
    confidence: 'benchmark_unverified',
    baseDate: RAWLINSONS_2021_METADATA.base_date,
    notes: rate.notes || rate.sourceLabel,
  };
}