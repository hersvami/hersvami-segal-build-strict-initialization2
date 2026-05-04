import { cat, type WorkCategory } from '../types';

export const EXTENDED_WET_JOINERY_CATEGORIES: WorkCategory[] = [
  cat('toilet', '🚽 Toilet / WC', 'toilet', 'wet',
    [{ id: 'type', label: 'Type', type: 'select', options: ['New WC', 'Renovation', 'Relocation'] }, { id: 'tileExtent', label: 'Wall tile extent', type: 'select', options: ['Skirting tile only', '1200mm high walls', '2100mm high walls', 'Floor-to-ceiling walls'] }, { id: 'suiteType', label: 'Toilet suite type', type: 'select', options: ['Back-to-wall', 'Wall-hung', 'Standard close-coupled', 'In-wall cistern'] }],
    [{ name: 'Plumbing Rough-in', trade: 'Plumbing', rate: 1200, unit: 'allow', duration: 1, description: 'New drainage and water supply' }, { name: 'Wall & Floor Prep', trade: 'Carpentry', rate: 800, unit: 'item', duration: 1, description: 'Stud frame, plasterboard' }, { name: 'Tiling', trade: 'Tiling', rate: 155, unit: 'area', duration: 1, description: 'Wall and floor tiles' }, { name: 'Fit-off', trade: 'Plumbing', rate: 600, unit: 'allow', duration: 0.5, description: 'Install toilet suite, cistern' }],
    [{ description: 'Toilet Suite', allowance: 500, unit: 'each' }, { description: 'Hand basin', allowance: 200, unit: 'each' }], ['Plumbing rough-in and fit-off', 'Tiling and waterproofing'], ['Structural alterations', 'Mechanical ventilation'], [{ categoryId: 'plumbing', type: 'auto' }, { categoryId: 'waterproofing', type: 'auto' }]),
  cat('cabinetry', '🪟 Cabinetry & Joinery', 'cabinetry', 'wet',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Built-in robes', 'Shelving', 'Custom joinery', 'Entertainment unit'] }],
    [{ name: 'Design & Measure', trade: 'Carpentry', rate: 500, unit: 'item', duration: 1, description: 'Measure and design' }, { name: 'Manufacture', trade: 'Carpentry', rate: 350, unit: 'linear', duration: 5, description: 'Custom manufacture' }, { name: 'Installation', trade: 'Carpentry', rate: 180, unit: 'linear', duration: 2, description: 'Install and fit out' }],
    [{ description: 'Hardware', allowance: 200, unit: 'allowance' }], ['Custom design and manufacture', 'Installation and adjustment'], ['Electrical work within cabinetry', 'Appliance supply'], []),
];
