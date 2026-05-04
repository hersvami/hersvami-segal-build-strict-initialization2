import { cat, type WorkCategory } from '../types';

export const BUILD_CATEGORIES: WorkCategory[] = [
  cat('secondStorey', '🏢 Upper Storey Extension', 'secondStorey', 'structural',
    [{ id: 'size', label: 'Size', type: 'select', options: ['Single room', 'Full upper storey extension'] }],
    [{ name: 'Engineering & Permits', trade: 'Structural', rate: 8000, unit: 'item', duration: 10, description: 'Engineer and council' }, { name: 'Strengthening', trade: 'Structural', rate: 25000, unit: 'item', duration: 4, description: 'Strengthen existing structure' }, { name: 'Upper Storey Construction', trade: 'Carpentry', rate: 85000, unit: 'item', duration: 8, description: 'Full upper storey extension build' }],
    [{ description: 'Staircase', allowance: 8000, unit: 'item' }], ['Engineering and permits', 'Structural strengthening', 'Full construction'], ['Temporary accommodation', 'Asbestos removal', 'Landscaping'], [{ categoryId: 'structural', type: 'auto' }, { categoryId: 'roofing', type: 'auto' }], 15, 'new_build'),
  cat('multiUnit', '🏘️ Multi-Unit', 'multiUnit', 'structural',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Dual occupancy', 'Townhouses', 'Triplex'] }],
    [{ name: 'Site Works & Foundation', trade: 'Concreting', rate: 80000, unit: 'item', duration: 4, description: 'Site cut, footings, slab' }, { name: 'Construction', trade: 'Carpentry', rate: 250000, unit: 'item', duration: 12, description: 'Full multi-unit build' }],
    [], ['Multi-unit construction', 'All trades'], ['DA and CDC approvals', 'Architect fees', 'Landscaping'], [{ categoryId: 'newHomeBuild', type: 'suggested' }], 10, 'new_build'),
  cat('grannyFlat', '🏠 Granny Flat / DPU', 'grannyFlat', 'structural',
    [{ id: 'size', label: 'Size', type: 'select', options: ['1 bed (40-50m²)', '2 bed (60-70m²)'] }],
    [{ name: 'Site Prep & Slab', trade: 'Concreting', rate: 22000, unit: 'item', duration: 3, description: 'Site prep and slab' }, { name: 'Frame to Lock-up', trade: 'Carpentry', rate: 45000, unit: 'item', duration: 4, description: 'Frame, roof, lock-up' }, { name: 'Fit-out', trade: 'Carpentry', rate: 35000, unit: 'item', duration: 4, description: 'All finishes and trades' }],
    [{ description: 'Kitchen', allowance: 8000, unit: 'allowance' }, { description: 'Bathroom', allowance: 10000, unit: 'allowance' }], ['Complete granny flat construction', 'Kitchen and bathroom included'], ['DA/CDC approval', 'Utility connections', 'Landscaping'], [{ categoryId: 'newHomeBuild', type: 'suggested' }, { categoryId: 'landscaping', type: 'suggested' }], 8, 'new_build'),
];
