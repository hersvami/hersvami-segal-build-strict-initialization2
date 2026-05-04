import type { MaterialRateCategory } from './materialRateTypes';

export const BENCHTOPS_SURFACES_PC_RATES: MaterialRateCategory = { key: 'benchtops_surfaces_pc', label: 'Benchtops & Surfaces PC', items: [
  { item: 'Solid Surface (12mm Corian/Staron/Hi-Macs)', unit: 'sqm', rate: 750, type: 'pc_value' },
  { item: 'Quartz Surface (20mm Caesarstone/Essastone)', unit: 'sqm', rate: 750, type: 'pc_value' },
  { item: 'Granite (20mm Natural Stone)', unit: 'sqm', rate: 1450, type: 'pc_value' },
  { item: 'Marble (20mm Natural Stone)', unit: 'sqm', rate: 1450, type: 'pc_value' },
  { item: 'Postformed Laminate (35-40mm Laminex/Polytec)', unit: 'sqm', rate: 500, type: 'pc_value' },
  { item: 'Stainless Steel (Type 304)', unit: 'sqm', rate: 1000, type: 'pc_value' },
  { item: 'Laminated Solid Timber (40mm 2-pack clear)', unit: 'sqm', rate: 1030, type: 'pc_value' },
  { item: 'Glassfibre Reinforced Concrete (GRC)', unit: 'sqm', rate: 1300, type: 'pc_value' },
  { item: 'Colour Backed Glass Splashback (6mm Toughened)', unit: 'sqm', rate: 390, type: 'pc_value' },
] };

export const TILES_PAVING_PC_RATES: MaterialRateCategory = { key: 'tiles_paving_pc', label: 'Tiles & Paving PC', items: [
  { item: 'Ceramic Wall/Floor Tile 150x150mm White Glazed', unit: 'sqm', rate: 29, type: 'pc_value' },
  { item: 'Ceramic Wall/Floor Tile 200x200mm', unit: 'sqm', rate: 40, type: 'pc_value' },
  { item: 'Glazed Mosaic Tile 61x61mm', unit: 'sqm', rate: 40, type: 'pc_value' },
  { item: 'Quarry Tile 250x250mm Light Duty', unit: 'sqm', rate: 33, type: 'pc_value' },
  { item: 'Quarry Tile 300x300mm Heavy Duty', unit: 'sqm', rate: 38, type: 'pc_value' },
  { item: 'Vitreous Unglazed Porcelain 200x200mm', unit: 'sqm', rate: 50, type: 'pc_value' },
  { item: 'Terracotta Floor Tile 300x300mm', unit: 'sqm', rate: 42, type: 'pc_value' },
] };

export const RESILIENT_FLOORING_PC_RATES: MaterialRateCategory = { key: 'resilient_flooring_pc', label: 'Resilient Flooring PC', items: [
  { item: 'Carpet - Nylon Commercial Medium Use (18oz)', unit: 'sqm', rate: 17, type: 'pc_value' },
  { item: 'Carpet - Wool Tufted Medium Use (35-45oz)', unit: 'sqm', rate: 30, type: 'pc_value' },
  { item: 'Carpet - Polypropylene Direct Stick', unit: 'sqm', rate: 10, type: 'pc_value' },
  { item: 'Vinyl Semi-Rigid Tiles 2.0mm (Excelon/Polyflor)', unit: 'sqm', rate: 10, type: 'pc_value' },
  { item: 'Vinyl Homogeneous Sheet 1.5mm', unit: 'sqm', rate: 16.5, type: 'pc_value' },
  { item: 'Linoleum Heavy Duty 2.5mm', unit: 'sqm', rate: 40, type: 'pc_value' },
  { item: 'Cork Tiles 305x305x6.0mm', unit: 'sqm', rate: 35, type: 'pc_value' },
  { item: 'Rubber Tiles Studded 2.7mm', unit: 'sqm', rate: 50, type: 'pc_value' },
] };

export const PAINTING_WALLCOVERINGS_PC_RATES: MaterialRateCategory = { key: 'painting_wallcoverings_pc', label: 'Painting & Wallcoverings PC', items: [
  { item: 'Wallpaper - Domestic Standard', unit: 'sqm', rate: 6.5, type: 'pc_value' },
  { item: 'Vinyl Paper-Backed Fabric', unit: 'sqm', rate: 18, type: 'pc_value' },
  { item: 'Vinyl Fabric - Commercial Heavy Duty', unit: 'sqm', rate: 25, type: 'pc_value' },
  { item: 'Vinyl Fabric - Extra Heavy Duty', unit: 'sqm', rate: 33, type: 'pc_value' },
] };

export const FINISH_MATERIAL_RATE_CATEGORIES = [
  BENCHTOPS_SURFACES_PC_RATES,
  TILES_PAVING_PC_RATES,
  RESILIENT_FLOORING_PC_RATES,
  PAINTING_WALLCOVERINGS_PC_RATES,
];