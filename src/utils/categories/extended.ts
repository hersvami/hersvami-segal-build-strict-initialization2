import { CORE_CATEGORIES } from './core';
import { EXTENDED_SPECIALTY_CATEGORIES } from './groups/extendedSpecialty';
import { EXTENDED_WALL_CATEGORIES } from './groups/extendedWalls';
import { EXTENDED_WET_JOINERY_CATEGORIES } from './groups/extendedWetJoinery';
import type { WorkCategory } from './types';

export const EXTENDED_CATEGORIES: WorkCategory[] = [
  ...EXTENDED_WET_JOINERY_CATEGORIES,
  ...EXTENDED_WALL_CATEGORIES,
  ...EXTENDED_SPECIALTY_CATEGORIES,
];

export const ALL_CATEGORIES: WorkCategory[] = [...CORE_CATEGORIES, ...EXTENDED_CATEGORIES];
export const CATEGORY_MAP: Record<string, WorkCategory> = {};
ALL_CATEGORIES.forEach((category) => { CATEGORY_MAP[category.id] = category; });

export function getCategoryById(id: string): WorkCategory | undefined {
  return CATEGORY_MAP[id];
}

export function searchCategories(query: string): WorkCategory[] {
  const q = query.toLowerCase();
  return ALL_CATEGORIES.filter((category) =>
    category.label.toLowerCase().includes(q) ||
    category.id.toLowerCase().includes(q) ||
    category.stages.some((stage) => stage.trade.toLowerCase().includes(q) || stage.name.toLowerCase().includes(q)),
  );
}