export interface TradeCategory {
  id: string;
  name: string;
  unit: string;
  defaultRate?: number;
}

export const tradeCategories: TradeCategory[] = [
  { id: 'demolition_skip', name: 'Skip Bin Hire', unit: 'Item', defaultRate: 450 },
  { id: 'concrete_slab', name: 'Concrete Slab (100mm)', unit: 'm²', defaultRate: 150 },
  { id: 'brickwork_double', name: 'Brickwork (Double Skin)', unit: 'm²', defaultRate: 120 },
  { id: 'carpentry_frame', name: 'Timber Framing', unit: 'm²', defaultRate: 85 },
  { id: 'roofing_tiles', name: 'Tile Roofing', unit: 'm²', defaultRate: 95 },
  { id: 'plumbing_rough', name: 'Plumbing Rough-in', unit: 'm²', defaultRate: 45 },
  { id: 'electrical_rough', name: 'Electrical Rough-in', unit: 'm²', defaultRate: 55 },
  { id: 'plasterboard', name: 'Plasterboard Supply & Fix', unit: 'm²', defaultRate: 35 },
  { id: 'painting_internal', name: 'Internal Painting', unit: 'm²', defaultRate: 18 },
  { id: 'flooring_timber', name: 'Timber Flooring', unit: 'm²', defaultRate: 65 },
  { id: 'tiling_floor', name: 'Floor Tiling', unit: 'm²', defaultRate: 75 },
  { id: 'kitchen_cabinets', name: 'Kitchen Cabinets', unit: 'm', defaultRate: 450 },
  { id: 'bathroom_vanity', name: 'Bathroom Vanity', unit: 'Item', defaultRate: 800 },
  { id: 'door_internal', name: 'Internal Door', unit: 'Item', defaultRate: 250 },
  { id: 'window_alum', name: 'Aluminium Window', unit: 'm²', defaultRate: 350 },
  { id: 'insulation_batch', name: 'Insulation Batts', unit: 'm²', defaultRate: 12 },
  { id: 'concrete_footings', name: 'Concrete Footings', unit: 'm³', defaultRate: 220 },
  { id: 'earthworks_cut', name: 'Earthworks (Cut)', unit: 'm³', defaultRate: 45 },
  { id: 'earthworks_fill', name: 'Earthworks (Fill)', unit: 'm³', defaultRate: 35 },
  { id: 'drainage_storm', name: 'Stormwater Drainage', unit: 'm', defaultRate: 85 },
];
