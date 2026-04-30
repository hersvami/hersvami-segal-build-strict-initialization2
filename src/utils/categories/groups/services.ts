import { cat, type WorkCategory } from '../types';

export const SERVICE_CATEGORIES: WorkCategory[] = [
  cat('plumbing', '🔧 Plumbing & Drainage', 'plumbing', 'trades',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Rough-in', 'Hot water', 'Drainage', 'Gas fitting'] }],
    [{ name: 'Plumbing Rough-in', trade: 'Plumbing', rate: 1800, unit: 'allow', duration: 2, description: 'Rough-in pipework' }, { name: 'Fit-off', trade: 'Plumbing', rate: 800, unit: 'allow', duration: 1, description: 'Connect fixtures' }],
    [{ description: 'Hot Water System', allowance: 2500, unit: 'item' }], ['All labour and materials', 'Compliance certification'], ['Appliance supply', 'Roofing works for flue'], [{ categoryId: 'waterproofing', type: 'suggested' }]),
  cat('waterproofing', '💧 Waterproofing', 'waterproofing', 'trades',
    [{ id: 'area', label: 'Area', type: 'select', options: ['Bathroom', 'Laundry', 'Balcony', 'Basement'] }],
    [{ name: 'Membrane Application', trade: 'Waterproofing', rate: 55, unit: 'area', duration: 1, description: 'AS3740 compliant membrane' }],
    [], ['AS3740 compliance', 'Membrane supply and application', 'Flood test and certification'], ['Structural repairs', 'Tiling over membrane'], [], 10, 'renovation'),
  cat('hvac', '❄️ HVAC', 'hvac', 'trades',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Split system', 'Ducted', 'Evaporative', 'Hydronic'] }],
    [{ name: 'Installation', trade: 'HVAC', rate: 2800, unit: 'item', duration: 1, description: 'Supply and install system' }],
    [{ description: 'A/C Unit', allowance: 3000, unit: 'item' }], ['Installation and commissioning', 'Electrical connection'], ['Structural penetrations', 'Building permit for external unit'], [{ categoryId: 'electrical', type: 'auto' }]),
];