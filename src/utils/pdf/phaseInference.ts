import type { ParametricItem } from '../../types/domain';

export function inferPhaseFromStage(stage: { name: string; trade: string }): string {
  const text = `${stage.name} ${stage.trade}`.toLowerCase();
  if (['demo', 'remove', 'strip', 'prep'].some((token) => text.includes(token))) return 'preparation';
  if (['plumbing', 'electrical', 'hvac'].some((token) => text.includes(token))) return 'services';
  if (['tiling', 'painting', 'waterproofing', 'flooring'].some((token) => text.includes(token))) return 'finishes';
  return 'structure';
}

export function inferPhaseFromParametric(item: Pick<ParametricItem, 'label' | 'unit' | 'phase'>): string {
  if (item.phase) return item.phase;
  const text = `${item.label} ${item.unit}`.toLowerCase();
  if (['prep', 'remove', 'demo'].some((token) => text.includes(token))) return 'preparation';
  if (['point', 'circuit', 'pipe', 'duct'].some((token) => text.includes(token))) return 'services';
  if (['tile', 'paint', 'floor', 'waterproof'].some((token) => text.includes(token))) return 'finishes';
  return 'structure';
}
