export type MaterialRateType = 'supply_only' | 'pc_value';

export interface MaterialRate {
  item: string;
  unit: string;
  rate: number;
  type: MaterialRateType;
  notes?: string;
}

export type MaterialRateCategory = {
  key: string;
  label: string;
  items: MaterialRate[];
};

export interface RawlinsonsMaterialRatesData {
  metadata: {
    source: string;
    location: string;
    currency: string;
    gst_included: boolean;
    base_date: string;
    pricing_notes: string;
    column_reference: string;
  };
  material_rates: Record<string, MaterialRate[]>;
}

export type InstalledCostOptions = {
  quantity: number;
  labourHours?: number;
  labourRate?: number;
  tradeMargin?: number;
  escalationFactor?: number;
};