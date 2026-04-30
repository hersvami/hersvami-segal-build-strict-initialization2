import { cat, type WorkCategory } from '../types';

export const STRUCTURAL_EXTRA_CATEGORIES: WorkCategory[] = [
  cat('underpinning', '🏠 Underpinning', 'underpinning', 'structural',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Restumping', 'Underpinning', 'Slab repair'] }],
    [{ name: 'Engineering Assessment', trade: 'Structural', rate: 2500, unit: 'item', duration: 5, description: 'Engineer inspection and report' }, { name: 'Underpinning Works', trade: 'Concreting', rate: 450, unit: 'linear', duration: 5, description: 'Excavate and pour new footings' }, { name: 'Restumping', trade: 'Carpentry', rate: 350, unit: 'item', duration: 3, description: 'Replace stumps and relevel' }],
    [{ description: 'Engineering Report', allowance: 2000, unit: 'item' }], ['Engineering assessment', 'All labour and materials'], ['Internal making good', 'Plumbing adjustments'], [{ categoryId: 'structural', type: 'auto' }, { categoryId: 'concreting', type: 'auto' }], 15, 'structural'),
  cat('retainingWalls', '🧱 Retaining Walls', 'retainingWalls', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Timber sleeper', 'Concrete block', 'Besser block'] }],
    [{ name: 'Excavation & Drainage', trade: 'Landscaping', rate: 120, unit: 'linear', duration: 1, description: 'Excavate and install drainage' }, { name: 'Wall Construction', trade: 'Carpentry', rate: 280, unit: 'linear', duration: 2, description: 'Build retaining wall' }],
    [], ['Drainage behind wall', 'All materials and labour'], ['Engineering for walls >1m', 'Council permits'], [{ categoryId: 'landscaping', type: 'suggested' }, { categoryId: 'concreting', type: 'suggested' }]),
  cat('steelFraming', '🏗️ Steel & Framing', 'steelFraming', 'structural',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Steel beam', 'Timber framing', 'Steel posts'] }],
    [{ name: 'Engineering Design', trade: 'Structural', rate: 1800, unit: 'item', duration: 5, description: 'Engineer specify beam' }, { name: 'Fabrication & Install', trade: 'Structural', rate: 3500, unit: 'item', duration: 2, description: 'Supply and install steel' }],
    [], ['Engineering certification', 'Supply and installation'], ['Crane hire if required', 'Making good'], [{ categoryId: 'structural', type: 'auto' }, { categoryId: 'demolition', type: 'suggested' }], 15, 'structural'),
];