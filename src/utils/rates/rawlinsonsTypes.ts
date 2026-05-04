export interface TradeItem {
  item: string;
  unit: string;
  rate: number;
  cost_type: 'composite' | 'material_only' | 'labour_only' | 'hire' | 'provision';
  material_cost: number | null;
  labour_cost: number | null;
  notes: string;
  supply_and_install: boolean;
}

export interface TradeCategory {
  trade: string;
  items: TradeItem[];
}

export interface RawlinsonsData {
  metadata: {
    source: string;
    location: string;
    currency: string;
    gst_included: boolean;
    base_date: string;
    pricing_methodology: string;
    notes: string;
  };
  wage_rates_melbourne: RawlinsonsWageRates;
  trades: TradeCategory[];
}

export type RawlinsonsWageRates = {
  labourer_general: number;
  tradesman_general: number;
  bricklayer: number;
  carpenter: number;
  joiner: number;
  glazier: number;
  painter: number;
  plumbing_labourer: number;
  plumber: number;
  electrician: number;
  mechanical_services: number;
  unit: 'AUD/hour';
};

export type RawlinsonsRateItem = Omit<TradeItem, 'supply_and_install' | 'cost_type' | 'material_cost' | 'labour_cost' | 'notes'> & {
  trade: string;
  supply_and_install?: boolean;
  cost_type?: TradeItem['cost_type'];
  material_cost?: number | null;
  labour_cost?: number | null;
  notes?: string;
  supplyAndInstall?: boolean;
};