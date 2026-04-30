/* ─── Segal Build — Category System Types ─── */

export type UnitType = 'area' | 'linear' | 'item' | 'allow';
export type CategoryArchetype = 'assembly' | 'trade' | 'element' | 'compliance';
export type DimensionMode = 'area' | 'linear' | 'wall' | 'room' | 'item' | 'roof' | 'none';

export type ScopeQuestion = {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'checkbox';
  options?: string[];
  dependsOn?: { questionId: string; values: string[] };
};

export type CategoryRelation = {
  categoryId: string;
  type: 'auto' | 'suggested';
};

export type WorkCategory = {
  id: string;
  label: string;
  icon: string;
  group: string;
  archetype: CategoryArchetype;
  dimensionMode: DimensionMode;
  bundles: string[];
  supportsPcItems: boolean;
  usesParametric: boolean;
  questions: ScopeQuestion[];
  stages: Array<{
    name: string;
    trade: string;
    rate: number;
    unit: UnitType;
    duration: number;
    description: string;
  }>;
  pcItems: Array<{
    description: string;
    allowance: number;
    unit: string;
  }>;
  inclusions: string[];
  exclusions: string[];
  relations: CategoryRelation[];
  contingencySuggestion: number;
  workType: string;
};

export const CATEGORY_GROUPS: Record<string, string> = {
  wet: 'Wet Areas & Interiors',
  structural: 'Structural & Extensions',
  external: 'External Works',
  trades: 'Trades & Services',
  specialty: 'Specialty',
};

const ARCHETYPE_DEFAULTS: Record<
  CategoryArchetype,
  { dimensionMode: DimensionMode; supportsPcItems: boolean; usesParametric: boolean }
> = {
  assembly: { dimensionMode: 'area', supportsPcItems: true, usesParametric: false },
  trade: { dimensionMode: 'none', supportsPcItems: false, usesParametric: true },
  element: { dimensionMode: 'wall', supportsPcItems: false, usesParametric: false },
  compliance: { dimensionMode: 'none', supportsPcItems: false, usesParametric: false },
};

function inferArchetype(id: string, group: string): CategoryArchetype {
  if (id === 'fireSafety' || id === 'accessibility' || id === 'smartHome') return 'compliance';
  if (group === 'trades') return 'trade';
  if (['internalWalls', 'cladding', 'fencing', 'decking', 'retainingWalls', 'rendering', 'paving', 'guttersFascia', 'brickwork', 'insulation', 'acoustic', 'ceilings'].includes(id)) return 'element';
  return 'assembly';
}

export function cat(
  id: string, label: string, icon: string, group: string,
  questions: ScopeQuestion[], stages: WorkCategory['stages'],
  pcItems: WorkCategory['pcItems'], inclusions: string[], exclusions: string[],
  relations: CategoryRelation[], contingency = 10, workType = 'renovation',
): WorkCategory {
  const archetype = inferArchetype(id, group);
  const defs = ARCHETYPE_DEFAULTS[archetype];
  return {
    id, label, icon, group, archetype,
    dimensionMode: defs.dimensionMode, bundles: [],
    supportsPcItems: defs.supportsPcItems, usesParametric: defs.usesParametric,
    questions, stages, pcItems, inclusions, exclusions, relations,
    contingencySuggestion: contingency, workType,
  };
}

export function catX(
  id: string, label: string, icon: string, group: string,
  archetype: CategoryArchetype, questions: ScopeQuestion[],
  stages: WorkCategory['stages'], pcItems: WorkCategory['pcItems'],
  inclusions: string[], exclusions: string[], relations: CategoryRelation[],
  options: {
    dimensionMode?: DimensionMode; bundles?: string[];
    supportsPcItems?: boolean; usesParametric?: boolean;
    contingency?: number; workType?: string;
  } = {},
): WorkCategory {
  const defs = ARCHETYPE_DEFAULTS[archetype];
  return {
    id, label, icon, group, archetype,
    dimensionMode: options.dimensionMode ?? defs.dimensionMode,
    bundles: options.bundles ?? [],
    supportsPcItems: options.supportsPcItems ?? defs.supportsPcItems,
    usesParametric: options.usesParametric ?? defs.usesParametric,
    questions, stages, pcItems, inclusions, exclusions, relations,
    contingencySuggestion: options.contingency ?? 10,
    workType: options.workType ?? 'renovation',
  };
}
