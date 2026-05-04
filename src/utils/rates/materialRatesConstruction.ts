import type { MaterialRateCategory } from './materialRateTypes';

export const CONCRETE_CEMENTITIOUS_RATES: MaterialRateCategory = { key: 'concrete_cementitious', label: 'Concrete & Cementitious', items: [
  { item: '20 MPa Ready-Mix Concrete', unit: 'cum', rate: 195, type: 'supply_only', notes: 'Delivered to site' },
  { item: '25 MPa Ready-Mix Concrete', unit: 'cum', rate: 200, type: 'supply_only', notes: 'Delivered to site' },
  { item: '32 MPa Ready-Mix Concrete', unit: 'cum', rate: 210, type: 'supply_only', notes: 'Delivered to site' },
  { item: 'Cement Mortar (pre-bagged)', unit: 'cum', rate: 215, type: 'supply_only' },
  { item: 'Lightweight Concrete (600kg/cum)', unit: 'cum', rate: 720, type: 'supply_only' },
  { item: 'Lightweight Concrete (1200kg/cum)', unit: 'cum', rate: 640, type: 'supply_only' },
  { item: 'Lightweight Concrete (1800kg/cum)', unit: 'cum', rate: 525, type: 'supply_only' },
  { item: 'Brightonlite Cement', unit: 'cum', rate: 102, type: 'supply_only' },
  { item: 'White Cement', unit: 'cum', rate: 104, type: 'supply_only' },
] };

export const REINFORCEMENT_STEEL_RATES: MaterialRateCategory = { key: 'reinforcement_steel', label: 'Reinforcement Steel', items: [
  { item: 'Deformed Y-Bar (cut & delivered, incl. rolling margin)', unit: 'tonne', rate: 1580, type: 'supply_only' },
  { item: 'Fabric Reinforcement SL81 (full sheets)', unit: 'sqm', rate: 27.4, type: 'supply_only' },
  { item: 'Fabric Reinforcement SL92 (full sheets)', unit: 'sqm', rate: 19.85, type: 'supply_only' },
  { item: 'Fabric Reinforcement RL1118 (rectangular)', unit: 'sqm', rate: 33.5, type: 'supply_only' },
] };

export const MASONRY_BRICKS_BLOCKS_RATES: MaterialRateCategory = { key: 'masonry_bricks_blocks', label: 'Masonry, Bricks & Blocks', items: [
  { item: 'Common Clay Brick (230x110x76mm)', unit: '1000', rate: 750, type: 'supply_only' },
  { item: 'Facing Clay Brick', unit: '1000', rate: 900, type: 'supply_only' },
  { item: 'Concrete Masonry Brick (230x110x76mm)', unit: '1000', rate: 673, type: 'supply_only' },
  { item: 'Concrete Hollow Block (100x200x400mm, Natural)', unit: '100', rate: 186, type: 'supply_only' },
  { item: 'Concrete Hollow Block (200x200x400mm, Natural)', unit: '100', rate: 279, type: 'supply_only' },
  { item: 'Concrete Solid Block (100x200x400mm, Natural)', unit: '100', rate: 218, type: 'supply_only' },
  { item: 'Scoria Blend Block 2hr (200x200x400mm)', unit: '100', rate: 405, type: 'supply_only' },
] };

export const TIMBER_CARPENTRY_SUPPLY_RATES: MaterialRateCategory = { key: 'timber_carpentry_supply', label: 'Timber & Carpentry Supply', items: [
  { item: 'Pine 100x50mm MGP10', unit: 'm', rate: 12.65, type: 'supply_only' },
  { item: 'Pine 150x50mm MGP10', unit: 'm', rate: 19.5, type: 'supply_only' },
  { item: 'Pine 200x50mm MGP10', unit: 'm', rate: 25.7, type: 'supply_only' },
  { item: 'Pine 100x38mm MGP10 (Studs)', unit: 'm', rate: 10.25, type: 'supply_only' },
  { item: 'Oregon 90x35mm F7', unit: 'm', rate: 10.85, type: 'supply_only' },
  { item: 'Hardwood 90x45mm F17', unit: 'm', rate: 16.3, type: 'supply_only' },
  { item: 'Laminated Pine Beam (190x80mm B-Grade)', unit: 'm', rate: 22, type: 'supply_only' },
  { item: 'Laminated Oregon Beam (270x80mm B-Grade)', unit: 'm', rate: 26.5, type: 'supply_only' },
] };

export const CONSTRUCTION_MATERIAL_RATE_CATEGORIES = [
  CONCRETE_CEMENTITIOUS_RATES,
  REINFORCEMENT_STEEL_RATES,
  MASONRY_BRICKS_BLOCKS_RATES,
  TIMBER_CARPENTRY_SUPPLY_RATES,
];