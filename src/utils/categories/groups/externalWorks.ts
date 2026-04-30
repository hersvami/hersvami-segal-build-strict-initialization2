import { cat, type WorkCategory } from '../types';

export const EXTERNAL_WORK_CATEGORIES: WorkCategory[] = [
  cat('roofing', '🏠 Roofing — Re-Roof', 'roofing', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Colorbond', 'Tiles', 'Zinc'] }],
    [{ name: 'Remove Old Roof', trade: 'Roofing', rate: 35, unit: 'area', duration: 2, description: 'Remove existing roofing' }, { name: 'Install New Roof', trade: 'Roofing', rate: 120, unit: 'area', duration: 3, description: 'Supply and install new' }],
    [{ description: 'Roofing Material', allowance: 65, unit: '$/m²' }], ['Removal and disposal', 'New roofing installation', 'Flashings and ridges'], ['Structural repairs', 'Guttering', 'Insulation'], [{ categoryId: 'guttersFascia', type: 'auto' }, { categoryId: 'insulation', type: 'suggested' }]),
  cat('fencing', '🏗️ Fencing & Gates', 'fencing', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Timber paling', 'Colorbond', 'Aluminium', 'Pool fence'] }],
    [{ name: 'Post Holes & Posts', trade: 'Carpentry', rate: 45, unit: 'linear', duration: 1, description: 'Dig and set posts' }, { name: 'Fence Construction', trade: 'Carpentry', rate: 120, unit: 'linear', duration: 2, description: 'Build fence' }],
    [], ['All materials and labour', 'Post holes and concrete'], ['Removal of old fence', 'Council permits', 'Pool compliance certification'], []),
  cat('concreting', '🧱 Concreting', 'concreting', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Slab', 'Footings', 'Paths', 'Driveway'] }],
    [{ name: 'Excavation & Prep', trade: 'Concreting', rate: 45, unit: 'area', duration: 1, description: 'Excavate and prepare base' }, { name: 'Form & Pour', trade: 'Concreting', rate: 110, unit: 'area', duration: 2, description: 'Formwork and concrete pour' }],
    [], ['Excavation and prep', 'Concrete supply and pour', 'Basic finish'], ['Reinforcement', 'Exposed aggregate finish', 'Pump hire'], []),
  cat('pergola', '🏠 Pergola & Patio', 'pergola', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Timber pergola', 'Steel patio', 'Insulated roof'] }],
    [{ name: 'Posts & Frame', trade: 'Carpentry', rate: 350, unit: 'area', duration: 2, description: 'Construct frame' }, { name: 'Roofing', trade: 'Roofing', rate: 120, unit: 'area', duration: 2, description: 'Install roofing' }],
    [], ['Complete structure', 'All materials'], ['Council permits', 'Electrical', 'Flooring/paving'], [{ categoryId: 'electrical', type: 'suggested' }, { categoryId: 'paving', type: 'suggested' }]),
];