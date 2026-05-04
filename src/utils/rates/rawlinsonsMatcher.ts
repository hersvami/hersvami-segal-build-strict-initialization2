import { RAWLINSONS_2021_METADATA } from './rawlinsonsMetadata';
import { RAWLINSONS_2021_RATES } from './rawlinsonsRates';
import type { RawlinsonsRateItem } from './rawlinsonsTypes';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  demolition: ['demolition', 'excavation', 'site'],
  concreting: ['concrete', 'slab', 'formwork', 'reinforcement'],
  brickwork: ['brick', 'block'],
  structural: ['steel', 'beam', 'column', 'structural'],
  steelFraming: ['steel', 'beam', 'framing'],
  carpentry: ['timber', 'framing', 'floor', 'roof'],
  internalWalls: ['wall framing', 'plasterboard', 'lining'],
  plastering: ['plasterboard', 'lining', 'ceiling'],
  cabinetry: ['cabinet', 'joinery', 'benchtop'],
  kitchen: ['cabinet', 'benchtop', 'sink'],
  windowsDoors: ['door', 'window', 'hardware'],
  roofing: ['roof', 'downpipe', 'eaves'],
  cladding: ['cladding', 'fibre cement', 'weatherboard'],
  insulation: ['insulation', 'batts', 'sarking'],
  flooring: ['flooring', 'carpet', 'vinyl', 'skirting'],
  tiling: ['tiles', 'tiling', 'ceramic', 'quarry'],
  painting: ['paint', 'painting', 'wallpaper'],
  plumbing: ['wc', 'basin', 'bath', 'shower', 'sink', 'drain'],
  electrical: ['light', 'power point', 'smoke alarm', 'electrical'],
  hvac: ['air-conditioning', 'ducted', 'split system'],
  landscaping: ['paving', 'fence', 'lawn', 'topsoil'],
  fencing: ['fence'],
  paving: ['paving', 'concrete paving', 'brick paving'],
};

export function findRawlinsonsRate(categoryId: string, label: string, unit?: string) {
  const haystack = `${categoryId} ${label}`.toLowerCase();
  const keywords = CATEGORY_KEYWORDS[categoryId] || [categoryId];
  const candidates = RAWLINSONS_2021_RATES.map((rate) => ({ rate, score: scoreRate(rate, keywords, haystack, unit) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return candidates[0]?.rate;
}

export function withEscalation(match: RawlinsonsRateItem, escalation: number) {
  return {
    ...match,
    adjustedRate: Math.round(match.rate * escalation * 100) / 100,
    escalation,
    gstIncluded: RAWLINSONS_2021_METADATA.gst_included,
    preliminariesIncluded: false,
  };
}

function scoreRate(rate: RawlinsonsRateItem, keywords: string[], haystack: string, unit?: string) {
  const itemText = `${rate.trade} ${rate.item}`.toLowerCase();
  let score = 0;
  for (const keyword of keywords) if (itemText.includes(keyword)) score += 4;
  for (const token of haystack.split(/\s+/).filter((token) => token.length > 3)) {
    if (itemText.includes(token)) score += 1;
  }
  if (unit && unitsCompatible(unit, rate.unit)) score += 2;
  return score;
}

function unitsCompatible(appUnit: string, rawUnit: string) {
  const app = appUnit.toLowerCase();
  const raw = rawUnit.toLowerCase();
  if ((app === 'area' || app === 'm2') && raw === 'sqm') return true;
  if ((app === 'linear' || app === 'lm' || app === 'm') && raw === 'm') return true;
  if ((app === 'item' || app === 'each') && ['no', 'each', 'point'].includes(raw)) return true;
  if (app === 'allow') return true;
  return app === raw;
}