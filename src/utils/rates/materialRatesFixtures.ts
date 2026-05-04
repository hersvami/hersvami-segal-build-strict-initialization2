import type { MaterialRateCategory } from './materialRateTypes';

export const SANITARY_FIXTURES_PC_RATES: MaterialRateCategory = { key: 'sanitary_fixtures_pc', label: 'Sanitary Fixtures PC', items: [
  { item: 'W.C. Suite - Plastic Integrated Cistern', unit: 'no', rate: 435, type: 'pc_value' },
  { item: 'W.C. Suite - Vitreous China Close Coupled', unit: 'no', rate: 900, type: 'pc_value' },
  { item: 'W.C. Suite - In-Wall Cistern', unit: 'no', rate: 1050, type: 'pc_value' },
  { item: 'Basin - Wall Mounted 10L', unit: 'no', rate: 420, type: 'pc_value' },
  { item: 'Basin - Vanity 12L', unit: 'no', rate: 355, type: 'pc_value' },
  { item: 'Bath - Porcelain Enamelled Steel 1675x760mm', unit: 'no', rate: 1145, type: 'pc_value' },
  { item: 'Shower Base - Acrylic 900x900mm', unit: 'no', rate: 425, type: 'pc_value' },
  { item: 'Kitchen Sink - 1234mm Single Bowl w/ Drainer', unit: 'no', rate: 540, type: 'pc_value' },
  { item: 'Kitchen Sink - 1842mm Double Bowl w/ Drainer', unit: 'no', rate: 1030, type: 'pc_value' },
  { item: 'Laundry Trough - 45L Flush', unit: 'no', rate: 765, type: 'pc_value' },
  { item: 'Spa Bath - 1650mm (10 jets)', unit: 'no', rate: 1420, type: 'pc_value' },
  { item: 'Urinal - Stainless Steel Single Stall', unit: 'no', rate: 1310, type: 'pc_value' },
  { item: 'Toilet Seat - Hard Plastic Double Flap', unit: 'no', rate: 90, type: 'pc_value' },
] };

export const TAPWARE_VALVES_PC_RATES: MaterialRateCategory = { key: 'tapware_valves_pc', label: 'Tapware & Valves PC', items: [
  { item: 'Basin Combination Set', unit: 'set', rate: 345, type: 'pc_value' },
  { item: 'Basin Mixer Set', unit: 'set', rate: 515, type: 'pc_value' },
  { item: 'Bath Combination Set', unit: 'set', rate: 335, type: 'pc_value' },
  { item: 'Bath Mixer Set with Diverter', unit: 'set', rate: 435, type: 'pc_value' },
  { item: 'Laundry Mixer Set', unit: 'set', rate: 340, type: 'pc_value' },
  { item: 'Pillar Tap - Standard Handle', unit: 'no', rate: 165, type: 'pc_value' },
  { item: 'Shower Mixer Set', unit: 'set', rate: 405, type: 'pc_value' },
  { item: 'Shower Arm & Rose Combination', unit: 'set', rate: 180, type: 'pc_value' },
  { item: 'Sink Combination Set', unit: 'set', rate: 585, type: 'pc_value' },
  { item: 'Sink Mixer Set', unit: 'set', rate: 340, type: 'pc_value' },
  { item: 'Laboratory Set - Two Way', unit: 'set', rate: 550, type: 'pc_value' },
  { item: 'Washing Machine Cock', unit: 'no', rate: 350, type: 'pc_value' },
] };

export const HOT_WATER_UNITS_PC_RATES: MaterialRateCategory = { key: 'hot_water_units_pc', label: 'Hot Water Units PC', items: [
  { item: 'Electric Instantaneous Multi-Point', unit: 'no', rate: 640, type: 'pc_value' },
  { item: 'Electric Storage 80L (Vitreous Glass Lining)', unit: 'no', rate: 625, type: 'pc_value' },
  { item: 'Electric Storage 125L', unit: 'no', rate: 720, type: 'pc_value' },
  { item: 'Gas Continuous Flow 27L (Internal)', unit: 'no', rate: 2340, type: 'pc_value' },
  { item: 'Gas Storage 135L (External 4-Star)', unit: 'no', rate: 1040, type: 'pc_value' },
  { item: 'Heat Pump 310L (Cooler Climates)', unit: 'no', rate: 4190, type: 'pc_value' },
  { item: 'Solar 180L w/ 1 Collector (Electric Booster)', unit: 'no', rate: 4200, type: 'pc_value' },
] };

export const FIXTURE_MATERIAL_RATE_CATEGORIES = [
  SANITARY_FIXTURES_PC_RATES,
  TAPWARE_VALVES_PC_RATES,
  HOT_WATER_UNITS_PC_RATES,
];