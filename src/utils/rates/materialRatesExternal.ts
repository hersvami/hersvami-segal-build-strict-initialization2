import type { MaterialRateCategory } from './materialRateTypes';

export const INSULATION_SARKING_PC_RATES: MaterialRateCategory = { key: 'insulation_sarking_pc', label: 'Insulation & Sarking PC', items: [
  { item: 'Glasswool Batts R1.5', unit: 'sqm', rate: 6.5, type: 'pc_value' },
  { item: 'Glasswool Batts R2.0', unit: 'sqm', rate: 6.5, type: 'pc_value' },
  { item: 'Glasswool Batts R2.5', unit: 'sqm', rate: 7, type: 'pc_value' },
  { item: 'Polyester Batts R2.5', unit: 'sqm', rate: 9.5, type: 'pc_value' },
  { item: 'Polyester Blanket 50mm', unit: 'sqm', rate: 6.4, type: 'pc_value' },
  { item: 'Aluminium Foil Sarking 430/530 Double Sided', unit: 'sqm', rate: 3.8, type: 'pc_value' },
  { item: 'Reflective Air Cell Insulation (Closed Cell)', unit: 'sqm', rate: 8.5, type: 'pc_value' },
] };

export const LANDSCAPING_EXTERNAL_PC_RATES: MaterialRateCategory = { key: 'landscaping_external_pc', label: 'Landscaping & External PC', items: [
  { item: 'Top Soil (Spread & Levelled)', unit: 'cum', rate: 63.2, type: 'pc_value' },
  { item: 'Roll Turf (400mm Wide)', unit: 'sqm', rate: 9, type: 'pc_value' },
  { item: 'Pine Bark Chips', unit: 'cum', rate: 73.5, type: 'pc_value' },
  { item: 'Blue Metal Chips (50mm deep incl. plastic)', unit: 'sqm', rate: 11.2, type: 'pc_value' },
  { item: 'River Pebbles (50mm deep incl. plastic)', unit: 'sqm', rate: 15.9, type: 'pc_value' },
  { item: 'Lightweight Planting Mixture', unit: 'cum', rate: 107, type: 'pc_value' },
  { item: 'Synthetic Turf 9600 Denier (Sand Filled)', unit: 'sqm', rate: 32, type: 'pc_value' },
] };

export const EXTERNAL_MATERIAL_RATE_CATEGORIES = [
  INSULATION_SARKING_PC_RATES,
  LANDSCAPING_EXTERNAL_PC_RATES,
];