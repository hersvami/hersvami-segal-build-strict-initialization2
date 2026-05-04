import type { RawlinsonsWageRates } from './rawlinsonsTypes';

export const RAWLINSONS_2021_METADATA = {
  source: 'Rawlinsons Construction Cost Guide 2021 (Edition 29)',
  location: 'Melbourne, VIC, Australia',
  currency: 'AUD',
  gst_included: false,
  base_date: '2021-01-01',
  pricing_methodology:
    "Prices reflect average market rates for $250k-$1.5M projects. Composite rates include materials, labour, waste, fixings, and builder's margin (+7.5% for general trades, +5.0% for electrical/mechanical). Preliminaries, site establishment, and statutory fees are excluded unless explicitly listed.",
  notes:
    "Use 'cost_type' field to distinguish composite vs material/labour splits. Apply annual escalation for current year. GST (10%) must be added where applicable.",
};

export const RAWLINSONS_2021_WAGE_RATES_MELBOURNE: RawlinsonsWageRates = {
  labourer_general: 61,
  tradesman_general: 63.5,
  bricklayer: 64.5,
  carpenter: 61,
  joiner: 64.5,
  glazier: 64,
  painter: 64,
  plumbing_labourer: 61,
  plumber: 73.75,
  electrician: 72.75,
  mechanical_services: 72.75,
  unit: 'AUD/hour',
};