/* ─── Segal Build — Quote Defaults ─── */
import { getCategoryById } from '../categories/extended';
import type { PCItem, InclusionItem, ExclusionItem } from '../../types/domain';
import { generateId } from '../helpers';

export function getDefaultPCItems(categoryId: string): PCItem[] {
  const cat = getCategoryById(categoryId);
  if (!cat) return [];
  return cat.pcItems.map(pc => ({
    id: generateId(),
    description: pc.description,
    allowance: pc.allowance,
    unit: pc.unit,
  }));
}

export function getDefaultInclusions(categoryId: string): InclusionItem[] {
  const cat = getCategoryById(categoryId);
  if (!cat) return [];
  return cat.inclusions.map(text => ({
    id: generateId(),
    text,
    isDefault: true,
  }));
}

export function getDefaultExclusions(categoryId: string): ExclusionItem[] {
  const cat = getCategoryById(categoryId);
  if (!cat) return [];
  return cat.exclusions.map(text => ({
    id: generateId(),
    text,
    isDefault: true,
  }));
}
