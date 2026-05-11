// Clean, professional category labels without emojis
// Used as a reference for all category definitions

export const CATEGORY_LABELS: Record<string, string> = {
  // Wet areas
  flooring: 'Flooring',
  painting: 'Painting',
  demolition: 'Demolition',
  electrical: 'Electrical',
  bathroom: 'Bathroom / Wet Areas',
  kitchen: 'Kitchen',
  laundry: 'Laundry',
  toilet: 'Toilet / WC',
  
  // Structural
  structural: 'Structural',
  decking: 'Decking',
  ceilings: 'Ceilings & Cornices',
  internalWalls: 'Internal Walls',
  secondStorey: 'Upper Storey Extension',
  grannyFlat: 'Granny Flat / DPU',
  
  // Trades
  carpentry: 'Carpentry',
  plastering: 'Plastering',
  brickwork: 'Brickwork',
  tiling: 'Tiling',
  plumbing: 'Plumbing & Drainage',
  waterproofing: 'Waterproofing',
  hvac: 'HVAC',
  
  // External
  roofing: 'Roofing — Re-Roof',
  fencing: 'Fencing & Gates',
  concreting: 'Concreting',
  pergola: 'Pergola & Patio',
  landscaping: 'Landscaping',
  pools: 'Pool & Spa',
  windowsDoors: 'Windows & Doors',
  cladding: 'Cladding',
  rendering: 'Rendering',
  paving: 'Paving & Driveways',
  insulation: 'Insulation',
  
  // Specialty
  fireSafety: 'Fire & Safety',
  steelFraming: 'Steel & Framing',
  underpinning: 'Underpinning',
  retainingWalls: 'Retaining Walls',
  cabinetry: 'Cabinetry & Joinery',
};

// Helper to strip any remaining non-ASCII characters from labels
export function cleanLabel(label: string): string {
  return label.replace(/[^\x00-\x7F]/g, '').trim();
}
