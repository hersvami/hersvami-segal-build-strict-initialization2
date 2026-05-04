import type { JobStage, ParametricItem } from '../../types/domain';
import { getUnitById } from '../../utils/pricing/parametricUnits';

export type PhaseKey = 'preparation' | 'structure' | 'services' | 'finishes' | 'external';
export const PHASE_ORDER: PhaseKey[] = ['preparation', 'structure', 'services', 'finishes', 'external'];
export const PHASE_LABELS: Record<PhaseKey, string> = { preparation: 'Preparation', structure: 'Structure', services: 'Services', finishes: 'Finishes', external: 'External' };

type PhaseEntry = { id: string; label: string; trade: string; cost: number; source: 'stage' | 'parametric' };

const EXTERNAL_CATEGORY_IDS = new Set(['decking','fencing','concreting','pergola','landscaping','pools','paving','retainingWalls','roofing','roofRepairs','guttersFascia','cladding','rendering','windowsDoors']);
const PREP_TOKENS = ['demo','demolition','remove','strip','prep','preparation','site prep'];
const SERVICE_TRADES = ['plumbing','electrical','hvac','data','compliance'];
const FINISH_TRADES = ['tiling','painting','waterproofing','flooring','plastering','cabinetry','insulation'];
const STRUCTURE_TRADES = ['structural','concreting','carpentry','roofing'];

function isPreparation(label: string, trade: string): boolean { return PREP_TOKENS.some((token) => `${label} ${trade}`.toLowerCase().includes(token)); }
function isTradeIn(trade: string, list: string[]): boolean { return list.some((token) => trade.toLowerCase().includes(token)); }

export function inferPhase(categoryId: string, label: string, trade: string): PhaseKey {
  if (isPreparation(label, trade)) return 'preparation';
  if (EXTERNAL_CATEGORY_IDS.has(categoryId)) return 'external';
  if (isTradeIn(trade, SERVICE_TRADES)) return 'services';
  if (isTradeIn(trade, FINISH_TRADES)) return 'finishes';
  if (isTradeIn(trade, STRUCTURE_TRADES)) return 'structure';
  return 'structure';
}

export function groupBoqByPhase(categoryId: string, stages: JobStage[], parametricItems: ParametricItem[]): Record<PhaseKey, PhaseEntry[]> {
  const grouped: Record<PhaseKey, PhaseEntry[]> = { preparation: [], structure: [], services: [], finishes: [], external: [] };
  for (const stage of stages) {
    const phase = inferPhase(categoryId, stage.name, stage.trade);
    grouped[phase].push({ id: `${stage.name}-${stage.trade}`, label: stage.name, trade: stage.trade, cost: stage.cost || 0, source: 'stage' });
  }
  for (const item of parametricItems) {
    const unit = getUnitById(item.unitId);
    const trade = unit?.trade || categoryId;
    const phase: PhaseKey = (item.phase || unit?.phase) ?? inferPhase(categoryId, item.label, trade);
    grouped[phase].push({ id: item.id, label: item.label, trade, cost: item.rate * item.quantity, source: 'parametric' });
  }
  return grouped;
}
