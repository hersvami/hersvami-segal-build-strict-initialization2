import { cat, type WorkCategory } from '../types';

export const ENVELOPE_SPECIALTY_CATEGORIES: WorkCategory[] = [
  cat('rendering', '🎨 Rendering', 'rendering', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Cement render', 'Texture coat', 'Acrylic'] }],
    [{ name: 'Surface Prep', trade: 'Carpentry', rate: 25, unit: 'area', duration: 1, description: 'Clean and prepare' }, { name: 'Render Application', trade: 'Carpentry', rate: 85, unit: 'area', duration: 2, description: 'Supply and apply render' }],
    [], ['Surface preparation', 'Quality render finish'], ['Painting (separate)', 'Structural repairs'], [{ categoryId: 'painting', type: 'suggested' }, { categoryId: 'cladding', type: 'suggested' }]),
  cat('cladding', '🧱 Cladding', 'cladding', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Weatherboard', 'Fibre cement', 'Metal'] }],
    [{ name: 'Wall Prep', trade: 'Carpentry', rate: 35, unit: 'area', duration: 1, description: 'Prepare wall surface' }, { name: 'Cladding Install', trade: 'Carpentry', rate: 120, unit: 'area', duration: 3, description: 'Supply and fix cladding' }],
    [], ['Sarking and wrap', 'Cladding supply and install'], ['Insulation (separate)', 'Painting (if required)'], [{ categoryId: 'insulation', type: 'suggested' }, { categoryId: 'painting', type: 'suggested' }]),
  cat('insulation', '🛡️ Insulation', 'insulation', 'specialty',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Wall', 'Ceiling', 'Underfloor', 'Acoustic'] }],
    [{ name: 'Installation', trade: 'Carpentry', rate: 35, unit: 'area', duration: 1, description: 'Install bulk/batt insulation' }],
    [], ['Supply and installation', 'Code-compliant R-values'], ['Making good linings'], [{ categoryId: 'ceilings', type: 'suggested' }]),
];
