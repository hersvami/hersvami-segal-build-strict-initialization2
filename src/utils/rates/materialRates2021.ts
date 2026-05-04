import { CONSTRUCTION_MATERIAL_RATE_CATEGORIES } from './materialRatesConstruction';
import { EXTERNAL_MATERIAL_RATE_CATEGORIES } from './materialRatesExternal';
import { FINISH_MATERIAL_RATE_CATEGORIES } from './materialRatesFinishes';
import { FIXTURE_MATERIAL_RATE_CATEGORIES } from './materialRatesFixtures';
import { RAWLINSONS_MATERIAL_RATES_2021_METADATA } from './materialRateMetadata';
import type { InstalledCostOptions, MaterialRate, RawlinsonsMaterialRatesData } from './materialRateTypes';
import { DEFAULT_MATERIAL_ESCALATION_RATE, GENERAL_TRADE_INSTALL_MARGIN, MATERIAL_RATE_ESCALATION_TARGET_YEAR, MEP_INSTALL_MARGIN } from './materialRateMetadata';

export const MATERIAL_RATE_CATEGORIES = [
  ...CONSTRUCTION_MATERIAL_RATE_CATEGORIES,
  ...FINISH_MATERIAL_RATE_CATEGORIES,
  ...FIXTURE_MATERIAL_RATE_CATEGORIES,
  ...EXTERNAL_MATERIAL_RATE_CATEGORIES,
];

export const RAWLINSONS_MATERIAL_RATES_2021: RawlinsonsMaterialRatesData = {
  metadata: RAWLINSONS_MATERIAL_RATES_2021_METADATA,
  material_rates: Object.fromEntries(MATERIAL_RATE_CATEGORIES.map((category) => [category.key, category.items])),
};

export function getAllMaterialRates(): MaterialRate[] {
  return MATERIAL_RATE_CATEGORIES.flatMap((category) => category.items);
}

export function findMaterialRate(query: string): MaterialRate | undefined {
  const normalized = query.toLowerCase();
  return getAllMaterialRates()
    .map((rate) => ({ rate, score: scoreMaterialRate(rate, normalized) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.rate;
}

export function calculateMaterialEscalationFactor(targetYear = MATERIAL_RATE_ESCALATION_TARGET_YEAR, annualRate = DEFAULT_MATERIAL_ESCALATION_RATE) {
  const baseYear = new Date(RAWLINSONS_MATERIAL_RATES_2021_METADATA.base_date).getFullYear();
  return Math.round(Math.pow(1 + annualRate, Math.max(targetYear - baseYear, 0)) * 10000) / 10000;
}

export function getEscalatedMaterialRate(rate: MaterialRate, escalationFactor = calculateMaterialEscalationFactor()) {
  return Math.round(rate.rate * escalationFactor * 100) / 100;
}

export function calculateInstalledMaterialCost(rate: MaterialRate, options: InstalledCostOptions) {
  const escalatedMaterial = getEscalatedMaterialRate(rate, options.escalationFactor);
  const materialTotal = escalatedMaterial * options.quantity;
  const labourTotal = (options.labourHours || 0) * (options.labourRate || 0);
  const defaultMargin = isMepItem(rate.item) ? MEP_INSTALL_MARGIN : GENERAL_TRADE_INSTALL_MARGIN;
  const margin = options.tradeMargin ?? defaultMargin;
  return Math.round((materialTotal + labourTotal) * (1 + margin));
}

export function applyGstToMaterialRate(value: number) {
  return RAWLINSONS_MATERIAL_RATES_2021_METADATA.gst_included ? value : Math.round(value * 1.1 * 100) / 100;
}

function scoreMaterialRate(rate: MaterialRate, normalizedQuery: string) {
  const text = `${rate.item} ${rate.unit} ${rate.type}`.toLowerCase();
  return normalizedQuery.split(/\s+/).filter((token) => token.length > 2 && text.includes(token)).length;
}

function isMepItem(item: string) {
  const lower = item.toLowerCase();
  return ['electric', 'plumb', 'gas', 'hot water', 'shower', 'basin', 'sink', 'w.c.', 'wc'].some((token) => lower.includes(token));
}