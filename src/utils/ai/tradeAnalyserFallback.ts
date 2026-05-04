import type { TradeAnalysis } from './tradeAnalyserTypes';
import { getCategoryById } from '../categories/extended';
import { TRADE_RATE_DIRECTORY } from '../trades/tradeRateDirectory';
import { getTradeCategoryId } from '../trades/tradeIds';

const KEYWORD_TRADE_MAP: Record<string, { label: string; keywords: string[] }> = {
  electrical: { label: 'Electrical', keywords: ['electrical', 'electrician', 'power point', 'gpo', 'downlight', 'light', 'switch', 'switchboard', 'exhaust fan', 'smoke alarm'] },
  plumbing: { label: 'Plumbing & Drainage', keywords: ['plumbing', 'plumber', 'hot water', 'drainage', 'toilet', 'shower', 'basin', 'tap', 'pipe', 'sewer', 'gas'] },
  tiling: { label: 'Tiling', keywords: ['tile', 'tiling', 'ceramic', 'porcelain', 'grout'] },
  carpentry: { label: 'Carpentry', keywords: ['carpenter', 'carpentry', 'skirting', 'architrave', 'fit-off carpentry'] },
  plastering: { label: 'Plastering', keywords: ['plasterer', 'plastering', 'plasterboard', 'sheeting', 'setting'] },
  brickwork: { label: 'Brickwork', keywords: ['bricklayer', 'brickwork', 'bricklaying', 'repointing'] },
  waterproofing: { label: 'Waterproofing', keywords: ['waterproof', 'membrane', 'as3740'] },
  painting: { label: 'Painting', keywords: ['paint', 'painting', 'primer', 'undercoat'] },
  flooring: { label: 'Flooring', keywords: ['floor', 'carpet', 'timber floor', 'vinyl'] },
  demolition: { label: 'Demolition', keywords: ['demo', 'demolition', 'remove', 'strip out'] },
  internalWalls: { label: 'Internal Walls', keywords: ['stud wall', 'framing', 'plasterboard', 'partition'] },
  insulation: { label: 'Insulation', keywords: ['insulation', 'batt', 'insulate'] },
  windowsDoors: { label: 'Windows & Doors', keywords: ['window', 'door', 'glazing'] },
  ceilings: { label: 'Ceilings', keywords: ['ceiling', 'cornice'] },
  fireSafety: { label: 'Fire & Safety', keywords: ['smoke alarm', 'fire safety'] },
  cabinetry: { label: 'Cabinetry & Joinery', keywords: ['vanity', 'cabinet', 'joinery'] },
  structural: { label: 'Structural', keywords: ['structural', 'load bearing', 'load-bearing', 'beam', 'lintel', 'wall removal', 'opening'] },
  decking: { label: 'Decking', keywords: ['deck', 'decking', 'merbau', 'composite deck'] },
  roofing: { label: 'Roofing', keywords: ['roof', 'roofing', 're-roof', 'colorbond', 'skylight'] },
  fencing: { label: 'Fencing & Gates', keywords: ['fence', 'fencing', 'gate', 'pool fence', 'colorbond fence'] },
  concreting: { label: 'Concreting', keywords: ['concrete', 'slab', 'footing', 'footings', 'crossover', 'driveway'] },
  hvac: { label: 'HVAC', keywords: ['air con', 'air conditioning', 'hvac', 'split system', 'ducted', 'heating', 'cooling'] },
  pergola: { label: 'Pergola & Patio', keywords: ['pergola', 'patio', 'alfresco', 'verandah', 'carport'] },
  landscaping: { label: 'Landscaping', keywords: ['landscape', 'landscaping', 'turf', 'garden', 'irrigation'] },
  pools: { label: 'Pool & Spa', keywords: ['pool', 'spa'] },
  retainingWalls: { label: 'Retaining Walls', keywords: ['retaining wall', 'retaining'] },
  rendering: { label: 'Rendering', keywords: ['render', 'rendering', 'texture coat', 'acrylic render'] },
  cladding: { label: 'Cladding', keywords: ['cladding', 'weatherboard', 'fibre cement'] },
  paving: { label: 'Paving & Driveways', keywords: ['paving', 'pavers', 'paver', 'exposed aggregate'] },
  underpinning: { label: 'Underpinning', keywords: ['underpin', 'underpinning', 'restump', 'stump', 'slab repair'] },
  steelFraming: { label: 'Steel & Framing', keywords: ['steel beam', 'steel framing', 'lvl beam', 'steel post'] },
  smartHome: { label: 'Smart Home', keywords: ['smart home', 'cctv', 'intercom', 'network', 'automation', 'data point'] },
};

const ASSEMBLY_TRADE_MAP: Record<string, string[]> = {
  bathroom: ['demolition', 'plumbing', 'waterproofing', 'tiling', 'electrical', 'cabinetry'],
  ensuite: ['demolition', 'plumbing', 'waterproofing', 'tiling', 'electrical', 'cabinetry'],
  shower: ['plumbing', 'waterproofing', 'tiling', 'electrical'],
  kitchen: ['demolition', 'plumbing', 'electrical', 'cabinetry', 'tiling', 'painting'],
  laundry: ['demolition', 'plumbing', 'waterproofing', 'tiling', 'cabinetry'],
  toilet: ['plumbing', 'waterproofing', 'tiling'],
  wc: ['plumbing', 'waterproofing', 'tiling'],
};

export function keywordFallback(scopeText: string): TradeAnalysis[] {
  const lower = scopeText.toLowerCase();
  const detected = new Map<string, TradeAnalysis>();

  for (const [categoryId, config] of Object.entries(KEYWORD_TRADE_MAP)) {
    const matched = config.keywords.filter((keyword) => lower.includes(keyword));
    if (matched.length === 0) continue;
    addDetected(detected, categoryId, Math.min((matched.length / config.keywords.length) * 5, 1));
  }

  for (const trade of TRADE_RATE_DIRECTORY) {
    const matched = trade.keywords.filter((keyword) => lower.includes(keyword));
    if (matched.length === 0) continue;
    addDetected(detected, getTradeCategoryId(trade.trade), Math.min(0.65 + matched.length * 0.12, 1));
  }

  for (const [assemblyKeyword, categoryIds] of Object.entries(ASSEMBLY_TRADE_MAP)) {
    if (!lower.includes(assemblyKeyword)) continue;
    for (const categoryId of categoryIds) addDetected(detected, categoryId, 0.55);
  }

  return Array.from(detected.values()).sort((a, b) => b.confidence - a.confidence);
}

function addDetected(map: Map<string, TradeAnalysis>, categoryId: string, confidence: number) {
  const category = getCategoryById(categoryId);
  if (!category || category.archetype === 'assembly') return;
  const existing = map.get(categoryId);
  if (existing && existing.confidence >= confidence) return;
  map.set(categoryId, {
    categoryId,
    label: category.label,
    confidence,
    tradeScope: '',
    items: [],
    suggestions: [],
    subtotal: 0,
  });
}
