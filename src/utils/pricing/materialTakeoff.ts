import type { MaterialItem, ProjectBaseline, QuoteScope, MaterialPreferences } from '../../types/domain';
import { getAllParametricUnits } from './parametricUnits';
import { generateId } from '../helpers';

export const DEFAULT_PREFERENCES: MaterialPreferences = {
  tileSize: '600x600',
  tileType: 'Porcelain',
  deckingProfile: '140x19',
  deckingTimber: 'Merbau',
  showerScreenType: 'Frameless',
  vanitySize: '900mm',
  benchtopMaterial: 'Stone (Caesarstone)',
  flooringType: 'Engineered Timber',
  flooringWidth: '190mm',
  carpetGrade: 'Standard Nylon',
  paintFinish: 'Low Sheen',
  paintBrand: 'Dulux',
  insulationType: 'Glasswool R2.5',
  windowType: 'Aluminium',
};

type MaterialCalc = {
  key: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  notes?: string;
};

type Dims = { width: number; length: number; height: number };

export function generateMaterialList(
  scopes: QuoteScope[],
  baseline: ProjectBaseline,
  prefs: MaterialPreferences = DEFAULT_PREFERENCES,
): MaterialItem[] {
  const allUnits = getAllParametricUnits();
  const map = new Map<string, MaterialCalc>();

  const add = (item: MaterialCalc) => {
    const ex = map.get(item.key);
    if (ex) {
      ex.quantity = Math.round((ex.quantity + item.quantity) * 100) / 100;
      ex.estimatedCost += item.estimatedCost;
    } else {
      map.set(item.key, { ...item });
    }
  };

  // 1. Explicit Parametric Items
  for (const scope of scopes) {
    for (const p of scope.parametricItems || []) {
      const u = allUnits.find((x) => x.id === p.unitId);
      add({ key: `par-${p.unitId}`, category: scope.categoryLabel, description: u?.label || p.label, quantity: p.quantity, unit: p.unit, estimatedCost: p.rate * p.quantity, notes: u?.description });
    }
  }

  // 2. Per-Scope Hidden Materials
  for (const scope of scopes) {
    const d = scope.dimensions || { width: baseline.lengthM || 0, length: baseline.widthM || 0, height: baseline.heightM || 2.4 };
    const area = (d.width || 0) * (d.length || 0);
    const per = ((d.width || 0) + (d.length || 0)) * 2;

    switch (scope.categoryId) {
      case 'decking': genDeck(add, area, per, d, prefs); break;
      case 'bathroom': genBathroom(add, area, per, d, prefs); break;
      case 'kitchen': genKitchen(add, area, per, d, prefs); break;
      case 'flooring': genFlooring(add, area, per, prefs); break;
      case 'painting': genPainting(add, area, per, d, prefs); break;
      case 'tiling': genTiling(add, area, per, d, prefs); break;
      case 'insulation': genInsulation(add, area, per, d, prefs); break;
      case 'windowsDoors': genWindows(add, area, per, d, prefs); break;
      case 'carpentry': genCarpentry(add, area, per, d, prefs); break;
      case 'plumbing': genPlumbing(add, area, per, d, prefs); break;
      case 'electrical': genElectrical(add, area, per, d, prefs); break;
      case 'concreting': genConcreting(add, area, per, d, prefs); break;
      case 'roofing': genRoofing(add, area, per, d, prefs); break;
      case 'fencing': genFencing(add, area, per, d, prefs); break;
      case 'waterproofing': genWaterproofing(add, area, per, d, prefs); break;
      case 'plastering': genPlastering(add, area, per, d, prefs); break;
      case 'demolition': genDemolition(add, area, per, d, prefs); break;
      case 'brickwork': genBrickwork(add, area, per, d, prefs); break;
      case 'structural': genStructural(add, area, per, d, prefs); break;
      case 'hvac': genHVAC(add, area, per, d, prefs); break;
      case 'landscaping': genLandscaping(add, area, per, d, prefs); break;
      case 'pergola': genPergola(add, area, per, d, prefs); break;
      case 'paving': genPaving(add, area, per, d, prefs); break;
      case 'cladding': genCladding(add, area, per, d, prefs); break;
      case 'rendering': genRendering(add, area, per, d, prefs); break;
      case 'ceilings': genCeiling(add, area, per, d, prefs); break;
      case 'internalWalls': genIntWall(add, area, per, d, prefs); break;
      case 'cabinetry': genCabinetry(add, area, per, d, prefs); break;
      default:
        if (area > 0) add({ key: `misc-${scope.categoryId}`, category: scope.categoryLabel, description: `Miscellaneous materials for ${scope.categoryLabel}`, quantity: 1, unit: 'allow', estimatedCost: 0, notes: 'Add specific items manually.' });
    }
  }

  return Array.from(map.values()).map((i) => ({ id: generateId(), category: i.category, description: i.description, quantity: i.quantity, unit: i.unit, estimatedCost: Math.round(i.estimatedCost), notes: i.notes }));
}

// --- Generators ---

function genDeck(a: (i: MaterialCalc) => void, area: number, _p: number, _d: Dims, p: MaterialPreferences) { if (area <= 0) return; const w = 1.10; const c = p.deckingTimber === 'Merbau' ? 120 : p.deckingTimber === 'Spotted Gum' ? 140 : p.deckingTimber === 'Blackbutt' ? 110 : 60; a({ key: 'deck-boards', category: 'Decking', description: `${p.deckingTimber} Decking (${p.deckingProfile}mm)`, quantity: Math.round(area * w * 10) / 10, unit: 'm2', estimatedCost: area * w * c, notes: '10% waste' }); a({ key: 'deck-screws', category: 'Decking', description: 'Stainless Deck Screws (#8 x 65mm)', quantity: Math.ceil(area * 12 / 100), unit: 'pack of 100', estimatedCost: Math.ceil((area * 12 / 100) * 25), notes: '12 per m2' }); }
function genBathroom(a: (i: MaterialCalc) => void, area: number, per: number, d: Dims, p: MaterialPreferences) { if (area <= 0) return; const wa = per * d.height; const tc = p.tileType === 'Natural Stone' ? 150 : p.tileType === 'Porcelain' ? 75 : 45; const vc = p.vanitySize === '1200mm' ? 1400 : p.vanitySize === '900mm' ? 850 : 500; const sc = p.showerScreenType.includes('Frameless') && !p.showerScreenType.includes('Semi') ? 1800 : 900; a({ key: 'bath-floor-tiles', category: 'Tiling', description: `Floor Tiles (${p.tileSize} ${p.tileType})`, quantity: Math.round(area * 1.10 * 10) / 10, unit: 'm2', estimatedCost: area * 1.10 * tc, notes: '10% waste' }); a({ key: 'bath-wall-tiles', category: 'Tiling', description: 'Wall Tiles (300x600 Ceramic)', quantity: Math.round(wa * 1.15 * 10) / 10, unit: 'm2', estimatedCost: wa * 1.15 * 45, notes: '15% waste' }); a({ key: 'bath-adhesive', category: 'Adhesives', description: 'Tile Adhesive (20kg)', quantity: Math.ceil((area + wa) / 4), unit: 'bag', estimatedCost: Math.ceil((area + wa) / 4) * 25 }); a({ key: 'bath-waterproof', category: 'Waterproofing', description: 'Liquid Membrane (15L)', quantity: 1, unit: 'bucket', estimatedCost: 180, notes: 'AS 3740' }); a({ key: 'bath-toilet', category: 'Fixtures', description: 'Toilet Suite (Back-to-Wall)', quantity: 1, unit: 'each', estimatedCost: 650 }); a({ key: 'bath-vanity', category: 'Fixtures', description: `Vanity + Basin (${p.vanitySize})`, quantity: 1, unit: 'each', estimatedCost: vc }); a({ key: 'bath-shower', category: 'Fixtures', description: `Shower Screen (${p.showerScreenType})`, quantity: 1, unit: 'each', estimatedCost: sc, notes: 'AS 1288' }); }
function genKitchen(a: (i: MaterialCalc) => void, area: number, _p: number, d: Dims, p: MaterialPreferences) { if (area <= 0) return; const bl = d.length || 3; const bc = p.benchtopMaterial === 'Stone (Caesarstone)' ? 850 : p.benchtopMaterial === 'Porcelain' ? 1200 : p.benchtopMaterial === 'Timber' ? 650 : 300; a({ key: 'kitch-cab', category: 'Cabinetry', description: 'Base + Overhead Cabinetry (MR MDF)', quantity: Math.round(bl * 10) / 10, unit: 'lm', estimatedCost: bl * 1100 }); a({ key: 'kitch-bench', category: 'Cabinetry', description: `${p.benchtopMaterial} Benchtop (20mm)`, quantity: Math.round(bl * 10) / 10, unit: 'lm', estimatedCost: bl * bc }); a({ key: 'kitch-splash', category: 'Tiling', description: 'Splashback Tiles', quantity: Math.round(bl * 0.6 * 1.15 * 10) / 10, unit: 'm2', estimatedCost: bl * 0.6 * 1.15 * 85 }); a({ key: 'kitch-sink', category: 'Fixtures', description: 'Kitchen Sink (Undermount)', quantity: 1, unit: 'each', estimatedCost: 550 }); a({ key: 'kitch-tap', category: 'Fixtures', description: 'Kitchen Mixer Tap', quantity: 1, unit: 'each', estimatedCost: 350 }); }
function genFlooring(a: (i: MaterialCalc) => void, area: number, per: number, p: MaterialPreferences) { if (area <= 0) return; const c = p.flooringType === 'Solid Timber' ? 180 : p.flooringType === 'Engineered Timber' ? 140 : p.flooringType === 'Bamboo' ? 120 : p.flooringType === 'Hybrid' ? 90 : 60; a({ key: 'flr-boards', category: 'Flooring', description: `${p.flooringType} Boards (${p.flooringWidth})`, quantity: Math.round(area * 1.10 * 10) / 10, unit: 'm2', estimatedCost: area * 1.10 * c, notes: '10% waste' }); a({ key: 'flr-under', category: 'Flooring', description: 'PE Foam Underlay', quantity: Math.round(area * 1.05 * 10) / 10, unit: 'm2', estimatedCost: area * 1.05 * 5 }); a({ key: 'flr-trans', category: 'Flooring', description: 'Transition/Scotia Strips', quantity: Math.round(per * 1.1), unit: 'lm', estimatedCost: Math.round(per * 1.1 * 12) }); }
function genTiling(a: (i: MaterialCalc) => void, area: number, per: number, d: Dims, p: MaterialPreferences) { if (area <= 0) return; const wa = per * d.height; const tc = p.tileType === 'Natural Stone' ? 150 : p.tileType === 'Porcelain' ? 75 : 45; a({ key: 'tile-floor', category: 'Tiling', description: `Floor Tiles (${p.tileSize} ${p.tileType})`, quantity: Math.round(area * 1.10 * 10) / 10, unit: 'm2', estimatedCost: area * 1.10 * tc }); a({ key: 'tile-wall', category: 'Tiling', description: `Wall Tiles (${p.tileType})`, quantity: Math.round(wa * 1.15 * 10) / 10, unit: 'm2', estimatedCost: wa * 1.15 * 55 }); a({ key: 'tile-adj', category: 'Adhesives', description: 'Tile Adhesive (20kg)', quantity: Math.ceil((area + wa) / 4), unit: 'bag', estimatedCost: Math.ceil((area + wa) / 4) * 25 }); }
function genPainting(a: (i: MaterialCalc) => void, area: number, per: number, d: Dims, p: MaterialPreferences) { if (area <= 0) return; const ta = per * d.height + area; const pc = p.paintBrand === 'Dulux' ? 60 : p.paintBrand === 'Wattyl' ? 55 : 45; a({ key: 'paint-top', category: 'Painting', description: `${p.paintBrand} Topcoat (${p.paintFinish})`, quantity: Math.ceil(ta / 12 * 2), unit: 'liters', estimatedCost: Math.ceil(ta / 12 * 2) * pc, notes: '2 coats' }); a({ key: 'paint-prim', category: 'Painting', description: `${p.paintBrand} Primer/Sealer`, quantity: Math.ceil(ta / 15), unit: 'liters', estimatedCost: Math.ceil(ta / 15) * 40 }); a({ key: 'paint-cons', category: 'Painting', description: 'Consumables (Rollers, Tape)', quantity: 1, unit: 'set', estimatedCost: Math.round(ta / 20) * 40 }); }
function genInsulation(a: (i: MaterialCalc) => void, area: number, _p: number, _d: Dims, p: MaterialPreferences) { if (area <= 0) return; const cp = p.insulationType.includes('R3.5') ? 85 : p.insulationType.includes('R2.5') ? 65 : 50; a({ key: 'ins-batts', category: 'Insulation', description: `${p.insulationType} Batts`, quantity: Math.ceil(area / 5.5), unit: 'pack', estimatedCost: Math.ceil(area / 5.5) * cp }); a({ key: 'ins-fix', category: 'Insulation', description: 'Staples / Fixings', quantity: Math.ceil(area / 20), unit: 'box', estimatedCost: Math.ceil(area / 20) * 35 }); }
function genWindows(a: (i: MaterialCalc) => void, _a: number, per: number, _d: Dims, p: MaterialPreferences) { if (per <= 0) return; const nw = Math.round(per / 3); const cw = p.windowType === 'Timber' ? 1200 : p.windowType === 'uPVC' ? 800 : 500; a({ key: 'win-units', category: 'Windows', description: `${p.windowType} Window (1200x1200)`, quantity: nw, unit: 'each', estimatedCost: nw * cw }); a({ key: 'win-flash', category: 'Windows', description: 'Flashing & Sealant', quantity: nw * 4, unit: 'lm', estimatedCost: nw * 4 * 5 }); }
function genCarpentry(a: (i: MaterialCalc) => void, _a: number, per: number, _d: Dims, _p: MaterialPreferences) { if (per <= 0) return; a({ key: 'carp-studs', category: 'Carpentry', description: 'MGP10 Studs (90x45mm)', quantity: Math.ceil(per / 0.6), unit: 'each', estimatedCost: Math.ceil(per / 0.6) * 12, notes: '600mm centers' }); a({ key: 'carp-plates', category: 'Carpentry', description: 'MGP10 Plates (90x45mm)', quantity: Math.round(per * 2 * 1.05 * 10) / 10, unit: 'lm', estimatedCost: Math.round(per * 2 * 1.05) * 10, notes: '5% waste' }); a({ key: 'carp-nails', category: 'Carpentry', description: 'Framing Nails (75mm)', quantity: Math.ceil(per / 5), unit: 'kg', estimatedCost: Math.ceil(per / 5) * 8 }); }
function genPlumbing(a: (i: MaterialCalc) => void, _a: number, per: number, _d: Dims, _p: MaterialPreferences) { if (per <= 0) return; a({ key: 'plumb-cop', category: 'Plumbing', description: 'Copper Pipe (15mm)', quantity: Math.round(per * 2 * 1.1 * 10) / 10, unit: 'lm', estimatedCost: Math.round(per * 2 * 1.1) * 12, notes: '10% for bends' }); a({ key: 'plumb-pvc', category: 'Plumbing', description: 'PVC Waste Pipe (100mm)', quantity: Math.round(per * 1.1 * 10) / 10, unit: 'lm', estimatedCost: Math.round(per * 1.1) * 15 }); }
function genElectrical(a: (i: MaterialCalc) => void, area: number, per: number, _d: Dims, _p: MaterialPreferences) { if (area <= 0) return; a({ key: 'elec-cab', category: 'Electrical', description: 'Twin & Earth Cable (2.5mm)', quantity: Math.round(per * 3 * 1.1), unit: 'lm', estimatedCost: Math.round(per * 3 * 1.1) * 2.5 }); a({ key: 'elec-gpo', category: 'Electrical', description: 'Double GPOs', quantity: Math.ceil(area / 10), unit: 'each', estimatedCost: Math.ceil(area / 10) * 25, notes: '1 per 10m2' }); a({ key: 'elec-lt', category: 'Electrical', description: 'LED Downlights', quantity: Math.ceil(area / 6), unit: 'each', estimatedCost: Math.ceil(area / 6) * 35, notes: '1 per 6m2' }); }
function genConcreting(a: (i: MaterialCalc) => void, area: number, _p: number, _d: Dims, _p2: MaterialPreferences) { if (area <= 0) return; const v = area * 0.1; a({ key: 'conc-mix', category: 'Concreting', description: '20MPa Ready-Mix Concrete', quantity: Math.round(v * 1.05 * 100) / 100, unit: 'm3', estimatedCost: Math.round(v * 1.05) * 220, notes: '5% waste' }); a({ key: 'conc-mesh', category: 'Concreting', description: 'SL82 Reinforcement Mesh', quantity: Math.round(area * 1.05 * 10) / 10, unit: 'm2', estimatedCost: area * 1.05 * 12, notes: '5% overlap' }); }
function genRoofing(a: (i: MaterialCalc) => void, area: number, per: number, _d: Dims, _p: MaterialPreferences) { if (area <= 0) return; a({ key: 'roof-sheet', category: 'Roofing', description: 'COLORBOND Roof Sheeting', quantity: Math.round(area * 1.15 * 1.10 * 10) / 10, unit: 'm2', estimatedCost: area * 1.15 * 1.10 * 45, notes: '10% waste' }); a({ key: 'roof-gut', category: 'Roofing', description: 'Quad Gutter + Downpipes', quantity: Math.round(per * 1.2), unit: 'lm', estimatedCost: Math.round(per * 1.2) * 35 }); }
function genFencing(a: (i: MaterialCalc) => void, _a: number, per: number, _d: Dims, _p: MaterialPreferences) { if (per <= 0) return; a({ key: 'fence-pan', category: 'Fencing', description: 'Colorbond Fence Panels (1.8m)', quantity: Math.round(per * 1.05), unit: 'lm', estimatedCost: per * 1.05 * 85 }); a({ key: 'fence-post', category: 'Fencing', description: 'Steel Fence Posts', quantity: Math.ceil(per / 2.4), unit: 'each', estimatedCost: Math.ceil(per / 2.4) * 35, notes: '2.4m centers' }); }
function genWaterproofing(a: (i: MaterialCalc) => void, area: number, per: number, _d: Dims, _p: MaterialPreferences) { if (area <= 0) return; a({ key: 'wp-mem', category: 'Waterproofing', description: 'Liquid Membrane (Class III)', quantity: Math.round(area * 1.2 * 10) / 10, unit: 'm2', estimatedCost: area * 1.2 * 12, notes: '20% upturns' }); a({ key: 'wp-band', category: 'Waterproofing', description: 'Bond Breaker Tape', quantity: Math.round(per * 1.1), unit: 'lm', estimatedCost: Math.round(per * 1.1) * 8 }); }
function genPlastering(a: (i: MaterialCalc) => void, area: number, per: number, d: Dims, _p: MaterialPreferences) { if (area <= 0) return; const ta = area + per * d.height; a({ key: 'plas-board', category: 'Plastering', description: 'Plasterboard (10mm)', quantity: Math.round(ta * 1.05 * 10) / 10, unit: 'm2', estimatedCost: ta * 1.05 * 18, notes: '5% waste' }); a({ key: 'plas-comp', category: 'Plastering', description: 'Joint Compound + Tape', quantity: Math.ceil(ta / 30), unit: 'bucket', estimatedCost: Math.ceil(ta / 30) * 45 }); }
function genDemolition(a: (i: MaterialCalc) => void, area: number, _p: number, _d: Dims, _p2: MaterialPreferences) { if (area <= 0) return; a({ key: 'demo-skip', category: 'Demolition', description: 'Skip Bin (6m3)', quantity: Math.ceil(area / 20), unit: 'each', estimatedCost: Math.ceil(area / 20) * 450 }); }
function genBrickwork(a: (i: MaterialCalc) => void, area: number, per: number, d: Dims, _p: MaterialPreferences) { if (area <= 0) return; const wa = per * d.height; const nb = wa * 50; a({ key: 'brick-units', category: 'Brickwork', description: 'Common Clay Bricks', quantity: Math.ceil(nb * 1.05), unit: 'each', estimatedCost: Math.ceil(nb * 1.05) * 1.2, notes: '50 per m2' }); a({ key: 'brick-mortar', category: 'Brickwork', description: 'Mortar Mix (20kg)', quantity: Math.ceil(wa / 2), unit: 'bag', estimatedCost: Math.ceil(wa / 2) * 12 }); }
function genStructural(a: (i: MaterialCalc) => void, _a: number, per: number, _d: Dims, _p: MaterialPreferences) { if (per <= 0) return; a({ key: 'str-steel', category: 'Structural', description: 'Steel UB Beam (200UB25)', quantity: Math.round(per * 0.3), unit: 'lm', estimatedCost: Math.round(per * 0.3) * 120 }); }
function genHVAC(a: (i: MaterialCalc) => void, area: number, _p: number, _d: Dims, _p2: MaterialPreferences) { if (area <= 0) return; a({ key: 'hvac-unit', category: 'HVAC', description: 'Split System AC (7kW)', quantity: Math.ceil(area / 30), unit: 'each', estimatedCost: Math.ceil(area / 30) * 2500, notes: '1 per 30m2' }); }
function genLandscaping(a: (i: MaterialCalc) => void, area: number, _p: number, _d: Dims, _p2: MaterialPreferences) { if (area <= 0) return; a({ key: 'land-turf', category: 'Landscaping', description: 'Roll Turf', quantity: Math.round(area * 1.05 * 10) / 10, unit: 'm2', estimatedCost: area * 1.05 * 12, notes: '5% waste' }); a({ key: 'land-soil', category: 'Landscaping', description: 'Topsoil', quantity: Math.round(area * 0.1 * 1.1), unit: 'm3', estimatedCost: area * 0.1 * 1.1 * 65, notes: '100mm depth' }); }
function genPergola(a: (i: MaterialCalc) => void, _a: number, per: number, _d: Dims, _p: MaterialPreferences) { if (per <= 0) return; a({ key: 'perg-post', category: 'Pergola', description: 'H4 Treated Pine Posts (150x150)', quantity: 4, unit: 'each', estimatedCost: 340 }); a({ key: 'perg-beam', category: 'Pergola', description: 'MGP10 Beams (190x45)', quantity: Math.round(per * 1.1), unit: 'lm', estimatedCost: Math.round(per * 1.1) * 15 }); }
function genPaving(a: (i: MaterialCalc) => void, area: number, _p: number, _d: Dims, _p2: MaterialPreferences) { if (area <= 0) return; a({ key: 'pave-pavers', category: 'Paving', description: 'Concrete Pavers (400x400x40mm)', quantity: Math.round(area * 1.05), unit: 'm2', estimatedCost: area * 1.05 * 45, notes: '5% waste' }); a({ key: 'pave-sand', category: 'Paving', description: 'Bedding Sand', quantity: Math.round(area * 0.05), unit: 'm3', estimatedCost: area * 0.05 * 80, notes: '50mm bed' }); }
function genCladding(a: (i: MaterialCalc) => void, _a: number, per: number, d: Dims, _p: MaterialPreferences) { if (per <= 0) return; const wa = per * d.height; a({ key: 'clad-sheet', category: 'Cladding', description: 'Fibre Cement Cladding', quantity: Math.round(wa * 1.10), unit: 'm2', estimatedCost: wa * 1.10 * 55, notes: '10% waste' }); }
function genRendering(a: (i: MaterialCalc) => void, _a: number, per: number, d: Dims, _p: MaterialPreferences) { if (per <= 0) return; const wa = per * d.height; a({ key: 'rend-mix', category: 'Rendering', description: 'Cement Render Mix', quantity: Math.round(wa * 0.015 * 1.10 * 100) / 100, unit: 'm3', estimatedCost: wa * 0.015 * 1.10 * 280, notes: '15mm thick' }); }
function genCeiling(a: (i: MaterialCalc) => void, area: number, per: number, _d: Dims, _p: MaterialPreferences) { if (area <= 0) return; a({ key: 'ceil-board', category: 'Ceilings', description: 'Plasterboard Ceiling (10mm)', quantity: Math.round(area * 1.05), unit: 'm2', estimatedCost: area * 1.05 * 18, notes: '5% waste' }); a({ key: 'ceil-corn', category: 'Ceilings', description: 'Cornice (75mm)', quantity: Math.round(per * 1.1), unit: 'lm', estimatedCost: Math.round(per * 1.1) * 12 }); }
function genIntWall(a: (i: MaterialCalc) => void, _a: number, per: number, d: Dims, _p: MaterialPreferences) { if (per <= 0) return; const wa = per * d.height * 2; a({ key: 'int-stud', category: 'Internal Walls', description: 'MGP10 Studs (70x35mm)', quantity: Math.ceil(per / 0.6), unit: 'each', estimatedCost: Math.ceil(per / 0.6) * 10, notes: '600mm centers' }); a({ key: 'int-board', category: 'Internal Walls', description: 'Plasterboard (10mm) Both Sides', quantity: Math.round(wa * 1.05), unit: 'm2', estimatedCost: wa * 1.05 * 18 }); }
function genCabinetry(a: (i: MaterialCalc) => void, _a: number, _p: number, d: Dims, p: MaterialPreferences) { const bl = d.length || 3; const bc = p.benchtopMaterial === 'Stone (Caesarstone)' ? 850 : p.benchtopMaterial === 'Porcelain' ? 1200 : p.benchtopMaterial === 'Timber' ? 650 : 300; a({ key: 'cab-units', category: 'Cabinetry', description: 'Base + Overhead Cabinetry (MR MDF)', quantity: Math.round(bl * 10) / 10, unit: 'lm', estimatedCost: bl * 1100 }); a({ key: 'cab-bench', category: 'Cabinetry', description: `${p.benchtopMaterial} Benchtop`, quantity: Math.round(bl * 10) / 10, unit: 'lm', estimatedCost: bl * bc }); }
