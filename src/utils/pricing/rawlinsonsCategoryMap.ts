import type { RawlinsonsMapping } from './benchmarkTypes';

export const RAWLINSONS_CATEGORY_MAP: Record<string, RawlinsonsMapping> = {
  bathroom: { tradeKeywords: ['demolition', 'plumbing', 'waterproofing', 'tiling'], materialKeywords: ['wc', 'basin', 'bath', 'shower', 'tap', 'tile'] },
  kitchen: { tradeKeywords: ['joinery', 'plumbing', 'electrical', 'tiling'], materialKeywords: ['cabinet', 'benchtop', 'sink', 'tap', 'splashback'] },
  laundry: { tradeKeywords: ['plumbing', 'waterproofing', 'tiling', 'joinery'], materialKeywords: ['laundry', 'trough', 'tap', 'tile'] },
  toilet: { tradeKeywords: ['plumbing', 'tiling', 'waterproofing'], materialKeywords: ['wc', 'toilet', 'basin', 'tap'] },
  internalWalls: { tradeKeywords: ['wall framing', 'plasterboard', 'insulation'], materialKeywords: ['stud', 'plasterboard', 'batts'] },
  plastering: { tradeKeywords: ['plasterboard', 'lining', 'ceiling'], materialKeywords: ['plasterboard', 'corner bead'] },
  painting: { tradeKeywords: ['paint', 'painting'], materialKeywords: ['paint', 'wallpaper'] },
  tiling: { tradeKeywords: ['tile', 'tiling'], materialKeywords: ['ceramic', 'mosaic', 'quarry', 'porcelain'] },
  plumbing: { tradeKeywords: ['plumbing', 'drainage', 'sanitary'], materialKeywords: ['wc', 'basin', 'bath', 'shower', 'sink', 'tap', 'hot water'] },
  electrical: { tradeKeywords: ['electrical', 'light', 'power point'], materialKeywords: ['light', 'power point', 'smoke alarm'] },
  carpentry: { tradeKeywords: ['timber', 'framing', 'carpentry'], materialKeywords: ['pine', 'hardwood', 'flooring'] },
  cabinetry: { tradeKeywords: ['joinery', 'cabinet'], materialKeywords: ['cabinet', 'benchtop', 'wardrobe'] },
  flooring: { tradeKeywords: ['flooring', 'carpet', 'vinyl'], materialKeywords: ['carpet', 'vinyl', 'cork', 'rubber'] },
  roofing: { tradeKeywords: ['roof', 'roofing'], materialKeywords: ['colorbond', 'tiles', 'downpipe'] },
  concreting: { tradeKeywords: ['concrete', 'slab', 'formwork'], materialKeywords: ['concrete', 'reinforcement', 'mesh'] },
};

export function getRawlinsonsMapping(categoryId: string): RawlinsonsMapping {
  return RAWLINSONS_CATEGORY_MAP[categoryId] || { tradeKeywords: [categoryId], materialKeywords: [categoryId] };
}