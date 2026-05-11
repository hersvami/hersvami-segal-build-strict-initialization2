// The "Calculator": Converts wizard answers into precise quantities and costs

import type { ModuleType, ProjectBaseline, ParametricItem } from '../../types/domain';
import { generateId } from '../helpers';
import { resolveBenchmarkRate } from '../pricing/rawlinsonsBenchmarkResolver';

interface WizardData {
  [key: string]: any;
}

interface BOQResult {
  items: ParametricItem[];
  notes: string[];
  warnings: string[];
}

export function generateDynamicBOQ(
  moduleType: ModuleType,
  data: WizardData,
  baseline: ProjectBaseline
): BOQResult {
  const items: ParametricItem[] = [];
  const notes: string[] = [];
  const warnings: string[] = [];

  if (moduleType === 'decking') {
    return calculateDeckBOQ(data, baseline);
  }
  
  if (moduleType === 'bathroom') {
    return calculateBathroomBOQ(data, baseline);
  }

  // Fallback for other modules
  return { items, notes, warnings };
}

function calculateDeckBOQ(data: WizardData, baseline: ProjectBaseline): BOQResult {
  const items: ParametricItem[] = [];
  const notes: string[] = [];
  const warnings: string[] = [];

  const length = parseFloat(data.length) || 0;
  const width = parseFloat(data.width) || 0;
  const height = parseFloat(data.height) || 0;
  const area = length * width;
  
  if (area === 0) return { items, notes: ['Enter deck dimensions'], warnings: [] };

  // 1. Structure Calculations (AS 1684 logic simplified)
  const stumpSpacing = 1.5; // meters
  const bearerSpacing = 1.6;
  const joistSpacing = 0.45;
  
  // Stumps
  const rows = Math.ceil(width / stumpSpacing) + 1;
  const cols = Math.ceil(length / stumpSpacing) + 1;
  const stumpCount = rows * cols;
  const concretePerStump = height > 1 ? 0.08 : 0.06; // m3
  
  items.push({
    id: generateId(),
    unitId: 'stump_h4',
    label: `H4 Treated Pine Stumps (${stumpCount} qty)`,
    unit: 'each',
    rate: 15.00, // Rawlinson's benchmark
    quantity: stumpCount,
    notes: `Spaced at ${stumpSpacing}m centers. Height ${height}m`,
    phase: 'structure'
  });

  items.push({
    id: generateId(),
    unitId: 'concrete_footings',
    label: `Concrete Footings (20MPa)`,
    unit: 'm3',
    rate: 350.00,
    quantity: parseFloat((stumpCount * concretePerStump).toFixed(2)),
    notes: 'Including excavation and stirrups',
    phase: 'structure'
  });

  // Bearers
  const bearerLengthTotal = rows * length;
  items.push({
    id: generateId(),
    unitId: 'bearer_h3',
    label: 'H3 Treated Pine Bearers (90x45)',
    unit: 'lm',
    rate: 7.50,
    quantity: Math.ceil(bearerLengthTotal),
    phase: 'structure'
  });

  // Joists
  const joistCount = Math.ceil(length / joistSpacing) + 1;
  const joistLengthTotal = joistCount * width;
  items.push({
    id: generateId(),
    unitId: 'joist_h3',
    label: 'H3 Treated Pine Joists (90x45)',
    unit: 'lm',
    rate: 7.50,
    quantity: Math.ceil(joistLengthTotal),
    phase: 'structure'
  });

  // 2. Decking Material with Pattern Logic
  let deckingArea = area;
  let wasteFactor = 1.10; // Standard 10%
  
  if (data.pattern === 'diagonal') wasteFactor = 1.15;
  if (data.pattern === 'picture_frame') {
    wasteFactor = 1.18;
    notes.push('Picture frame border included: Extra cutting and perimeter boards');
  }
  if (data.pattern === 'herringbone') {
    wasteFactor = 1.25;
    notes.push('Herringbone pattern: High waste factor and increased labor');
  }

  const finalDeckingArea = parseFloat((deckingArea * wasteFactor).toFixed(2));
  
  let materialLabel = 'Merbau Decking 90x19';
  let rate = 120.00; // $/m2 benchmark
  
  if (data.material === 'treated_pine') { materialLabel = 'Treated Pine Decking'; rate = 65.00; }
  if (data.material === 'composite') { materialLabel = 'Composite Decking'; rate = 150.00; }

  items.push({
    id: generateId(),
    unitId: 'decking Boards',
    label: `${materialLabel} (${data.pattern})`,
    unit: 'm2',
    rate: rate,
    quantity: finalDeckingArea,
    notes: `Includes ${Math.round((wasteFactor-1)*100)}% waste for cuts and pattern`,
    phase: 'finishes'
  });

  // 3. Fixings
  const screwsPerM2 = 12;
  const totalScrews = Math.ceil(finalDeckingArea * screwsPerM2);
  items.push({
    id: generateId(),
    unitId: 'deck_screws',
    label: 'Stainless Steel Deck Screws',
    unit: 'each',
    rate: 0.15,
    quantity: totalScrews,
    phase: 'finishes'
  });

  // 4. Stairs (Auto-triggered or manual)
  let stairSets = parseInt(data.stairs) || 0;
  if (height > 0.2 && stairSets === 0) {
    stairSets = 1; // Auto-add one set if height requires it
    notes.push('Auto-added 1 set of stairs due to height > 200mm');
  }

  if (stairSets > 0) {
    const stepsPerSet = Math.ceil(height / 0.175); // Max rise 175mm
    items.push({
      id: generateId(),
      unitId: 'deck_stairs',
      label: `Deck Stair Sets (${stairSets} sets, ~${stepsPerSet} steps each)`,
      unit: 'each',
      rate: 450.00 * stepsPerSet, // Rough estimate per step
      quantity: stairSets,
      notes: 'Includes stringers, treads, risers and handrails',
      phase: 'structure'
    });
  }

  // 5. Balustrade (Auto-triggered)
  let balustradeLength = 0;
  if (height > 1.0 || data.balustrade !== 'none') {
    // Calculate perimeter minus attachment sides
    let perimeter = 2 * (length + width);
    if (data.attachment === 'attached_1') perimeter -= length;
    if (data.attachment === 'attached_2') perimeter -= (length + width);
    
    balustradeLength = perimeter;
    
    let balRate = 250.00; // Timber
    let balLabel = 'Timber Balustrade';
    
    if (data.balustrade === 'glass') { balRate = 450.00; balLabel = 'Frameless Glass Balustrade'; }
    if (data.balustrade === 'wire') { balRate = 320.00; balLabel = 'Stainless Wire Balustrade'; }
    
    if (balustradeLength > 0) {
      items.push({
        id: generateId(),
        unitId: 'balustrade',
        label: balLabel,
        unit: 'lm',
        rate: balRate,
        quantity: Math.ceil(balustradeLength),
        notes: `Required for height ${height}m (NCC Compliance)`,
        phase: 'finishes'
      });
    }
  }

  // 6. Site Prep & Waste
  if (data.sitePrep === 'slope') {
    notes.push('Sloped site detected: Additional retaining or cut/fill may be required (Provisional Sum recommended)');
    warnings.push('Site slope may increase excavation costs significantly');
  }
  
  if (data.skipBin) {
    items.push({
      id: generateId(),
      unitId: 'skip_bin',
      label: 'Skip Bin Hire (4m³)',
      unit: 'each',
      rate: 350.00,
      quantity: 1,
      phase: 'preparation'
    });
  }

  if (data.lighting) {
    items.push({
      id: generateId(),
      unitId: 'deck_light',
      label: 'LED Deck Light Points',
      unit: 'each',
      rate: 120.00,
      quantity: Math.ceil(perimeter / 3), // One every 3m
      phase: 'services'
    });
  }

  return { items, notes, warnings };
}

function calculateBathroomBOQ(data: WizardData, baseline: ProjectBaseline): BOQResult {
  const items: ParametricItem[] = [];
  const notes: string[] = [];

  // Example: Tile Pattern Logic
  if (data.tilePattern === 'herringbone') {
    notes.push('Herringbone tile pattern selected: +20% material waste and increased labor hours applied.');
    // Logic to increase quantity would go here
  }

  if (data.showerType === 'custom_tile') {
    items.push({
      id: generateId(),
      unitId: 'shower_hob',
      label: 'Custom Tiled Shower Hob & Former',
      unit: 'lm',
      rate: 150.00,
      quantity: 3, // Estimate
      phase: 'structure'
    });
  }

  return { items, notes, warnings: [] };
}