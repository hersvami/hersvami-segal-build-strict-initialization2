import { RAWLINSONS_2021_METADATA, RAWLINSONS_2021_WAGE_RATES_MELBOURNE } from './rawlinsonsMetadata';
import { RAWLINSONS_2021_RATES } from './rawlinsonsRates';
import type { RawlinsonsData, TradeCategory, TradeItem } from './rawlinsonsTypes';

export const RAWLINSONS_DATA: RawlinsonsData = {
  metadata: RAWLINSONS_2021_METADATA,
  wage_rates_melbourne: RAWLINSONS_2021_WAGE_RATES_MELBOURNE,
  trades: RAWLINSONS_2021_RATES.reduce<TradeCategory[]>((groups, row) => {
    const existing = groups.find((group) => group.trade === row.trade);
    const item = normalizeItem(row);
    if (existing) existing.items.push(item);
    else groups.push({ trade: row.trade, items: [item] });
    return groups;
  }, []),
};

function normalizeItem(row: (typeof RAWLINSONS_2021_RATES)[number]): TradeItem {
  return {
    item: row.item,
    unit: row.unit,
    rate: row.rate,
    cost_type: row.cost_type || (row.supplyAndInstall || row.supply_and_install ? 'composite' : 'material_only'),
    material_cost: row.material_cost ?? null,
    labour_cost: row.labour_cost ?? null,
    notes: row.notes || '',
    supply_and_install: row.supply_and_install ?? row.supplyAndInstall ?? false,
  };
}