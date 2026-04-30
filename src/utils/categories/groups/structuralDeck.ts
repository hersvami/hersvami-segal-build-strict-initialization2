import { cat, type WorkCategory } from '../types';

export const STRUCTURAL_DECK_CATEGORIES: WorkCategory[] = [
  cat('structural', '🏗️ Structural', 'structural', 'structural',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Wall removal', 'Beam install', 'Opening creation'] }],
    [{ name: 'Engineering', trade: 'Structural', rate: 2500, unit: 'item', duration: 5, description: 'Engineer design & certification' }, { name: 'Propping & Demo', trade: 'Demo', rate: 1800, unit: 'item', duration: 1, description: 'Prop and remove load-bearing' }, { name: 'Beam Install', trade: 'Structural', rate: 4500, unit: 'item', duration: 2, description: 'Supply and install beam' }],
    [{ description: 'Steel Beam', allowance: 2500, unit: 'item' }],
    ['Engineering certification', 'All structural work'], ['Making good finishes', 'Relocating services'], [{ categoryId: 'demolition', type: 'auto' }], 15, 'structural'),
  cat('decking', '🪵 Decking', 'decking', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Merbau', 'Composite', 'Spotted Gum', 'Treated Pine'] }],
    [{ name: 'Subframe', trade: 'Carpentry', rate: 85, unit: 'area', duration: 2, description: 'H4 treated subframe' }, { name: 'Decking Install', trade: 'Carpentry', rate: 180, unit: 'area', duration: 3, description: 'Supply and install decking' }, { name: 'Balustrade', trade: 'Carpentry', rate: 280, unit: 'linear', duration: 2, description: 'If required >1m height' }],
    [{ description: 'Decking Material', allowance: 120, unit: '$/m²' }],
    ['Quality subframe', 'Decking installation', 'Stainless steel fixings'], ['Stumps/foundations', 'Staining/oiling', 'Council permits for >1m'], [{ categoryId: 'fencing', type: 'suggested' }]),
];