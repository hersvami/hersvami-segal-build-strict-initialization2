import { catX, type WorkCategory } from '../types';
import { GENERATED_TRADE_PEOPLE_CATEGORIES } from './generatedTradePeople';

export const INDIVIDUAL_TRADE_CATEGORIES: WorkCategory[] = [
  catX('tiling', '🔲 Tiling', 'tiling', 'trades', 'trade',
    [{ id: 'type', label: 'Tiling scope', type: 'select', options: ['Floor tiling', 'Wall tiling', 'Splashback', 'Wet area tiling', 'Outdoor tiling'] }, { id: 'finish', label: 'Finish level', type: 'select', options: ['Standard ceramic', 'Porcelain', 'Large-format premium', 'Feature tile'] }],
    [{ name: 'Substrate Prep', trade: 'Tiling', rate: 35, unit: 'area', duration: 1, description: 'Prepare substrate for tiling' }, { name: 'Tile Installation', trade: 'Tiling', rate: 145, unit: 'area', duration: 2, description: 'Lay tiles, grout and clean' }],
    [{ description: 'Tiles', allowance: 80, unit: '$/m²' }], ['Tile installation', 'Grouting and clean down'], ['Waterproofing unless listed separately', 'Floor levelling compound'], [{ categoryId: 'waterproofing', type: 'suggested' }],
    { dimensionMode: 'area', usesParametric: true, supportsPcItems: true }),
  catX('carpentry', '🪚 Carpentry', 'carpentry', 'trades', 'trade',
    [{ id: 'type', label: 'Carpentry type', type: 'select', options: ['Fit-off', 'Framing', 'Skirting/architraves', 'Door install', 'General carpentry'] }],
    [{ name: 'Carpentry Labour', trade: 'Carpentry', rate: 950, unit: 'allow', duration: 1, description: 'General carpentry works' }],
    [], ['Labour and standard fixings'], ['Specialty hardware', 'Structural engineering'], [{ categoryId: 'painting', type: 'suggested' }],
    { dimensionMode: 'none', usesParametric: false, supportsPcItems: false }),
  catX('plastering', '🧱 Plastering', 'plastering', 'trades', 'trade',
    [{ id: 'type', label: 'Plastering type', type: 'select', options: ['Patch and make good', 'New plasterboard', 'Ceiling plaster', 'Wet area sheeting'] }],
    [{ name: 'Sheet and Set', trade: 'Plastering', rate: 85, unit: 'area', duration: 2, description: 'Supply, sheet and set plasterboard' }],
    [], ['Plasterboard installation', 'Setting and sanding ready for paint'], ['Painting', 'Insulation'], [{ categoryId: 'painting', type: 'suggested' }],
    { dimensionMode: 'area', usesParametric: false, supportsPcItems: false }),
  catX('brickwork', '🧱 Brickwork', 'brickwork', 'trades', 'trade',
    [{ id: 'type', label: 'Brickwork type', type: 'select', options: ['New wall', 'Opening infill', 'Repair/repointing', 'Feature brickwork'] }],
    [{ name: 'Brickwork', trade: 'Bricklaying', rate: 220, unit: 'area', duration: 2, description: 'Supply and lay brickwork' }],
    [{ description: 'Bricks', allowance: 1.8, unit: 'each' }], ['Bricklaying labour and mortar'], ['Engineering, lintels, painting/rendering'], [{ categoryId: 'rendering', type: 'suggested' }],
    { dimensionMode: 'wall', usesParametric: false, supportsPcItems: true }),
  ...GENERATED_TRADE_PEOPLE_CATEGORIES,
];