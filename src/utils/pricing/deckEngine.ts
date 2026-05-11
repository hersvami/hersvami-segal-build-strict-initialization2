import type { ProjectBaseline, ParametricItem, PricingSourceMeta } from '../../types/domain';
import { generateId } from '../helpers';

export interface DeckQuantities {
  deckingArea: number;
  deckingLengthLM: number;
  bearerLengthLM: number;
  joistLengthLM: number;
  stumpCount: number;
  concreteVolumeM3: number;
  screwCount: number;
  bracketCount: number;
  bracingLengthLM: number;
}

export interface DeckRate {
  item: string;
  unit: 'm2' | 'lm' | 'each' | 'm3';
  rate: number;
  source: 'rawlinsons' | 'decking_standard' | 'bunnings_verified';
  costType: 'composite' | 'material_only' | 'labour_only';
  gstIncluded: boolean;
}

const DECKING_RATES: Record<string, DeckRate> = {
  // Merbau Decking (Material + Install)
  'merbau_decking_90x19': {
    item: 'Merbau decking 90x19mm supplied and fixed',
    unit: 'lm',
    rate: 12.50, // ~$8.50 material + $4.00 labor
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },
  'merbau_decking_material_only': {
    item: 'Merbau decking 90x19mm supply only',
    unit: 'lm',
    rate: 8.50,
    source: 'bunnings_verified',
    costType: 'material_only',
    gstIncluded: false,
  },
  
  // Treated Pine Decking
  'treated_pine_decking': {
    item: 'Treated pine decking 90x19mm supplied and fixed',
    unit: 'lm',
    rate: 6.80,
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },
  
  // Composite Decking
  'composite_decking': {
    item: 'Composite decking board supplied and fixed',
    unit: 'lm',
    rate: 18.00,
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },

  // Structural Timber (from Rawlinson's logic)
  'bearer_90x45_h3': {
    item: 'H3 treated pine bearer 90x45mm supplied and fixed',
    unit: 'lm',
    rate: 9.50,
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },
  
  'joist_90x45_h3': {
    item: 'H3 treated pine joist 90x45mm supplied and fixed',
    unit: 'lm',
    rate: 9.50,
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },

  // Stumps
  'stump_100x100_h4': {
    item: 'H4 treated pine stump 100x100mm supplied and installed',
    unit: 'each',
    rate: 45.00, // ~$15 timber + $30 install (cutting, positioning, fixing)
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },

  // Concrete Footings
  'concrete_footing_20mpa': {
    item: '20MPa concrete for footings supplied and poured',
    unit: 'm3',
    rate: 380.00, // ~$300 material + $80 labor
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },

  // Fixings
  'decking_screws_ss': {
    item: 'Stainless steel decking screws 12G x 65mm',
    unit: 'each',
    rate: 0.35, // ~$149/box of 500 = $0.30/screw + allowance
    source: 'bunnings_verified',
    costType: 'material_only',
    gstIncluded: false,
  },

  'post_anchor_bracket': {
    item: 'Galvanised post anchor bracket supplied and fixed',
    unit: 'each',
    rate: 22.00, // ~$15 bracket + $7 fix
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },

  // Bracing (for decks >600mm high)
  'cross_bracing_70x35': {
    item: 'Cross bracing 70x35mm H3 between stumps',
    unit: 'lm',
    rate: 5.50,
    source: 'decking_standard',
    costType: 'composite',
    gstIncluded: false,
  },

  // Labor - Deck Installation
  'deck_install_labor': {
    item: 'Deck installation labor (structure + decking)',
    unit: 'm2',
    rate: 180.00,
    source: 'decking_standard',
    costType: 'labour_only',
    gstIncluded: false,
  },
};

/**
 * Calculate exact quantities for a deck based on dimensions
 */
export function calculateDeckQuantities(baseline: ProjectBaseline): DeckQuantities {
  const length = baseline.deckLengthM || 0;
  const width = baseline.deckWidthM || 0;
  const height = baseline.deckHeightFromGroundM || 0;
  const area = length * width;

  if (area === 0) {
    return {
      deckingArea: 0,
      deckingLengthLM: 0,
      bearerLengthLM: 0,
      joistLengthLM: 0,
      stumpCount: 0,
      concreteVolumeM3: 0,
      screwCount: 0,
      bracketCount: 0,
      bracingLengthLM: 0,
    };
  }

  // Decking boards (90mm wide with 5mm gap = 95mm centers)
  const boardsNeeded = Math.ceil(width / 0.095);
  const deckingLengthLM = boardsNeeded * length;

  // Bearers (run perpendicular to joists, typically 1600mm spacing)
  const bearerSpacing = 1.6;
  const bearerRows = Math.ceil(length / bearerSpacing) + 1;
  const bearerLengthLM = bearerRows * width;

  // Joists (typically 450mm spacing)
  const joistSpacing = 0.45;
  const joistCount = Math.ceil(width / joistSpacing) + 1;
  const joistLengthLM = joistCount * length;

  // Stumps (grid pattern, max 1600mm spacing both ways)
  const stumpsAlongLength = Math.ceil(length / 1.6) + 1;
  const stumpsAlongWidth = Math.ceil(width / 1.6) + 1;
  const stumpCount = stumpsAlongLength * stumpsAlongWidth;

  // Concrete footings (400x400x400mm each = 0.064m³ per footing)
  const concretePerFooting = 0.064;
  const concreteVolumeM3 = stumpCount * concretePerFooting;

  // Screws (approx 1 screw per 300mm of decking board)
  const screwsPerBoard = Math.ceil(length / 0.3);
  const screwCount = boardsNeeded * screwsPerBoard * 1.1; // 10% waste

  // Brackets (one per stump)
  const bracketCount = stumpCount;

  // Cross bracing (required if height > 600mm)
  let bracingLengthLM = 0;
  if (height > 0.6) {
    // Diagonal bracing between stump rows
    const diagonalLength = Math.sqrt(Math.pow(1.6, 2) + Math.pow(height, 2));
    const bracingBays = (stumpsAlongLength - 1) * (stumpsAlongWidth - 1);
    bracingLengthLM = bracingBays * diagonalLength * 0.5; // Brace every second bay
  }

  return {
    deckingArea: area,
    deckingLengthLM: deckingLengthLM,
    bearerLengthLM: bearerLengthLM,
    joistLengthLM: joistLengthLM,
    stumpCount,
    concreteVolumeM3,
    screwCount,
    bracketCount,
    bracingLengthLM,
  };
}

/**
 * Generate parametric items for a deck scope
 */
export function createDeckParametricItems(baseline: ProjectBaseline): ParametricItem[] {
  const qty = calculateDeckQuantities(baseline);
  const material = baseline.deckMaterial || 'merbau';

  if (qty.deckingArea === 0) return [];

  const items: ParametricItem[] = [];

  // Select decking rate based on material
  let deckingRateKey = 'merbau_decking_90x19';
  if (material === 'treated_pine') deckingRateKey = 'treated_pine_decking';
  if (material === 'composite') deckingRateKey = 'composite_decking';

  const deckingRate = DECKING_RATES[deckingRateKey];

  // 1. Decking Boards
  items.push({
    id: generateId(),
    unitId: `deck_${material}`,
    label: deckingRate.item,
    unit: 'lm',
    rate: deckingRate.rate,
    quantity: parseFloat(qty.deckingLengthLM.toFixed(1)),
    notes: `${qty.deckingArea.toFixed(1)}m² deck area, ${baseline.deckMaterial || 'Merbau'} 90x19mm`,
    phase: 'finishes',
    pricingSource: buildPricingSource(deckingRate),
  });

  // 2. Bearers
  const bearerRate = DECKING_RATES['bearer_90x45_h3'];
  items.push({
    id: generateId(),
    unitId: 'deck_bearer',
    label: bearerRate.item,
    unit: 'lm',
    rate: bearerRate.rate,
    quantity: parseFloat(qty.bearerLengthLM.toFixed(1)),
    notes: `H3 treated pine, ${qty.bearerLengthLM.toFixed(0)}lm @ 1600mm spacing`,
    phase: 'structure',
    pricingSource: buildPricingSource(bearerRate),
  });

  // 3. Joists
  const joistRate = DECKING_RATES['joist_90x45_h3'];
  items.push({
    id: generateId(),
    unitId: 'deck_joist',
    label: joistRate.item,
    unit: 'lm',
    rate: joistRate.rate,
    quantity: parseFloat(qty.joistLengthLM.toFixed(1)),
    notes: `H3 treated pine, ${qty.joistLengthLM.toFixed(0)}lm @ 450mm spacing`,
    phase: 'structure',
    pricingSource: buildPricingSource(joistRate),
  });

  // 4. Stumps
  const stumpRate = DECKING_RATES['stump_100x100_h4'];
  items.push({
    id: generateId(),
    unitId: 'deck_stump',
    label: stumpRate.item,
    unit: 'each',
    rate: stumpRate.rate,
    quantity: qty.stumpCount,
    notes: `H4 treated pine, ${qty.stumpCount} stumps @ ${(baseline.deckHeightFromGroundM || 0).toFixed(1)}m high`,
    phase: 'structure',
    pricingSource: buildPricingSource(stumpRate),
  });

  // 5. Concrete Footings
  const concreteRate = DECKING_RATES['concrete_footing_20mpa'];
  items.push({
    id: generateId(),
    unitId: 'deck_concrete',
    label: concreteRate.item,
    unit: 'm3',
    rate: concreteRate.rate,
    quantity: parseFloat(qty.concreteVolumeM3.toFixed(2)),
    notes: `${qty.stumpCount} x 400x400x400mm footings`,
    phase: 'preparation',
    pricingSource: buildPricingSource(concreteRate),
  });

  // 6. Screws
  const screwRate = DECKING_RATES['decking_screws_ss'];
  items.push({
    id: generateId(),
    unitId: 'deck_screws',
    label: screwRate.item,
    unit: 'each',
    rate: screwRate.rate,
    quantity: Math.ceil(qty.screwCount),
    notes: '304 Stainless steel, 12G x 65mm',
    phase: 'finishes',
    pricingSource: buildPricingSource(screwRate),
  });

  // 7. Post Anchor Brackets
  const bracketRate = DECKING_RATES['post_anchor_bracket'];
  items.push({
    id: generateId(),
    unitId: 'deck_brackets',
    label: bracketRate.item,
    unit: 'each',
    rate: bracketRate.rate,
    quantity: qty.bracketCount,
    notes: 'Galvanised steel, one per stump',
    phase: 'structure',
    pricingSource: buildPricingSource(bracketRate),
  });

  // 8. Cross Bracing (if required)
  if (qty.bracingLengthLM > 0) {
    const bracingRate = DECKING_RATES['cross_bracing_70x35'];
    items.push({
      id: generateId(),
      unitId: 'deck_bracing',
      label: bracingRate.item,
      unit: 'lm',
      rate: bracingRate.rate,
      quantity: parseFloat(qty.bracingLengthLM.toFixed(1)),
      notes: `Required for decks >600mm high (${(baseline.deckHeightFromGroundM || 0).toFixed(1)}m)`,
      phase: 'structure',
      pricingSource: buildPricingSource(bracingRate),
    });
  }

  // 9. Deck Installation Labor (lumped as m²)
  const laborRate = DECKING_RATES['deck_install_labor'];
  items.push({
    id: generateId(),
    unitId: 'deck_labor',
    label: laborRate.item,
    unit: 'm2',
    rate: laborRate.rate,
    quantity: parseFloat(qty.deckingArea.toFixed(1)),
    notes: 'Complete deck installation including structure and decking',
    phase: 'structure',
    pricingSource: buildPricingSource(laborRate),
  });

  return items;
}

function buildPricingSource(rate: DeckRate): PricingSourceMeta {
  return {
    source: rate.source === 'rawlinsons' ? 'Rawlinson\'s 2021' : rate.source === 'bunnings_verified' ? 'Bunnings Live' : 'Decking Standard Rates',
    sourceType: rate.source === 'bunnings_verified' ? 'quoted' : 'benchmark',
    costType: rate.costType,
    baseRate: rate.rate,
    gstIncluded: rate.gstIncluded,
    preliminariesIncluded: false,
    confidence: rate.source === 'bunnings_verified' ? 'verified' : 'benchmark_unverified',
    notes: `Unit rate for ${rate.item}`,
  };
}

/**
 * Get summary of deck costs
 */
export function getDeckCostSummary(baseline: ProjectBaseline): { totalMaterial: number; totalLabor: number; total: number; items: any[] } {
  const items = createDeckParametricItems(baseline);
  
  let totalMaterial = 0;
  let totalLabor = 0;

  items.forEach(item => {
    const lineTotal = item.rate * item.quantity;
    const costType = item.pricingSource?.costType || 'composite';
    
    if (costType === 'material_only') {
      totalMaterial += lineTotal;
    } else if (costType === 'labour_only') {
      totalLabor += lineTotal;
    } else {
      // Composite - split 60/40 material/labor typical for decking
      totalMaterial += lineTotal * 0.6;
      totalLabor += lineTotal * 0.4;
    }
  });

  return {
    totalMaterial,
    totalLabor,
    total: totalMaterial + totalLabor,
    items: items.map(i => ({
      label: i.label,
      quantity: i.quantity,
      unit: i.unit,
      rate: i.rate,
      total: i.rate * i.quantity,
    })),
  };
}