/* ─── Segal Build — Trade Chain Suggestions ─── */
import { getCategoryById } from '../categories/extended';

export type ChainSuggestion = {
  categoryId: string;
  label: string;
  relation: 'preceding' | 'following';
  reason: string;
};

type ChainRule = { categoryId: string; relation: 'preceding' | 'following'; reason: string };

const TRADE_CHAIN_MAP: Record<string, ChainRule[]> = {
  plumbing: [
    { categoryId: 'waterproofing', relation: 'following', reason: 'Wet-area plumbing typically flows into waterproofing and fit-off coordination.' },
    { categoryId: 'electrical', relation: 'following', reason: 'Service trades are commonly coordinated together during fit-off.' },
  ],
  waterproofing: [
    { categoryId: 'demolition', relation: 'preceding', reason: 'Renovation waterproofing typically follows strip-out and substrate prep.' },
    { categoryId: 'plumbing', relation: 'preceding', reason: 'Waterproofing generally follows plumbing rough-in in wet areas.' },
  ],
  electrical: [
    { categoryId: 'smartHome', relation: 'following', reason: 'Data, intercom, CCTV and smart devices commonly follow electrical scope.' },
    { categoryId: 'fireSafety', relation: 'following', reason: 'Smoke alarms and compliance devices are commonly coordinated with electrical works.' },
  ],
  internalWalls: [
    { categoryId: 'insulation', relation: 'following', reason: 'Wall framing usually leads into acoustic or thermal insulation.' },
    { categoryId: 'painting', relation: 'following', reason: 'Wall sheeting and setting usually lead into painting.' },
    { categoryId: 'electrical', relation: 'preceding', reason: 'Wall framing often requires electrical rough-in before final lining.' },
  ],
  ceilings: [
    { categoryId: 'insulation', relation: 'preceding', reason: 'Ceiling replacement often requires insulation before sheeting.' },
    { categoryId: 'painting', relation: 'following', reason: 'Ceiling installation usually leads into paint finishing.' },
  ],
  flooring: [
    { categoryId: 'painting', relation: 'following', reason: 'Final floor works are often coordinated with final paint touch-ups.' },
  ],
  windowsDoors: [
    { categoryId: 'painting', relation: 'following', reason: 'Window and door replacement commonly needs internal/external make-good painting.' },
  ],
  rendering: [
    { categoryId: 'painting', relation: 'following', reason: 'Rendered finishes commonly require coating or paint protection.' },
  ],
  cladding: [
    { categoryId: 'insulation', relation: 'preceding', reason: 'External wall cladding often pairs with insulation upgrades.' },
    { categoryId: 'painting', relation: 'following', reason: 'Some cladding systems require paint finishing or touch-up.' },
  ],
  hvac: [
    { categoryId: 'electrical', relation: 'preceding', reason: 'HVAC installation typically requires dedicated electrical circuits.' },
  ],
  concreting: [
    { categoryId: 'landscaping', relation: 'following', reason: 'Concrete paths and slabs often form part of a broader external works package.' },
    { categoryId: 'fencing', relation: 'following', reason: 'External works packages commonly combine concrete edges with fencing or gates.' },
  ],
  pergola: [
    { categoryId: 'electrical', relation: 'following', reason: 'Pergolas and patios commonly add outdoor lighting or GPOs.' },
    { categoryId: 'paving', relation: 'following', reason: 'Outdoor structures often lead into paving or hardscape works.' },
  ],
  landscaping: [
    { categoryId: 'concreting', relation: 'preceding', reason: 'Landscape packages often require paths, edging or slab works first.' },
  ],
  structural: [
    { categoryId: 'demolition', relation: 'preceding', reason: 'Structural openings and beam installs commonly require demolition first.' },
  ],
  pools: [
    { categoryId: 'fencing', relation: 'following', reason: 'Pool projects require compliant fencing.' },
    { categoryId: 'electrical', relation: 'following', reason: 'Pool equipment and lighting commonly require electrical works.' },
    { categoryId: 'landscaping', relation: 'following', reason: 'Pool projects usually finish with external landscape works.' },
  ],
};

export function getTradeChainSuggestions(categoryId: string, existingIds: string[]): ChainSuggestion[] {
  const existing = new Set(existingIds);
  const rules = TRADE_CHAIN_MAP[categoryId] || [];
  const suggestions: ChainSuggestion[] = [];
  for (const rule of rules) {
    if (existing.has(rule.categoryId)) continue;
    const category = getCategoryById(rule.categoryId);
    if (!category) continue;
    suggestions.push({
      categoryId: rule.categoryId,
      label: category.label,
      relation: rule.relation,
      reason: rule.reason,
    });
  }
  return suggestions;
}

export function hasTradeChainSuggestions(categoryId: string, existingIds: string[]): boolean {
  return getTradeChainSuggestions(categoryId, existingIds).length > 0;
}
