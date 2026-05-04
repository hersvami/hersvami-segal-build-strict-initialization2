import { cat, catX, type WorkCategory } from '../types';

export const EXTENDED_SPECIALTY_CATEGORIES: WorkCategory[] = [
  catX('fireSafety', '🔥 Fire & Safety', 'fireSafety', 'specialty', 'compliance',
    [{ id: 'itemType', label: 'Compliance item', type: 'select', options: ['Smoke alarm — 240V hardwired interconnected', 'Smoke alarm — 10yr lithium interconnected', 'Fire door — 60/30/30 rated', 'Fire door — 90/60/30 rated', 'BAL assessment & report'] }, { id: 'count', label: 'How many?', type: 'number' }, { id: 'interconnect', label: 'Interconnect to existing system?', type: 'select', options: ['Yes — extend existing', 'No — standalone'], dependsOn: { questionId: 'itemType', values: ['Smoke alarm — 240V hardwired interconnected', 'Smoke alarm — 10yr lithium interconnected'] } }],
    [{ name: 'Supply & install', trade: 'Electrical', rate: 240, unit: 'item', duration: 0.5, description: 'Per AS3786 — supply, install, test' }],
    [], ['AS3786 / AS1530 compliance certificate', 'Supply, install, test, and tag', 'Battery backup where applicable'], ['Fire sprinkler systems', 'Detection panels / monitored alarms', 'Patching & painting after install'], [], { dimensionMode: 'none', supportsPcItems: false, contingency: 5, workType: 'maintenance' }),
  cat('paving', '🧱 Paving & Driveways', 'paving', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Concrete', 'Pavers', 'Exposed aggregate'] }],
    [{ name: 'Base Preparation', trade: 'Concreting', rate: 45, unit: 'area', duration: 1, description: 'Excavate, base, compact' }, { name: 'Paving/Pour', trade: 'Concreting', rate: 95, unit: 'area', duration: 2, description: 'Lay pavers or pour concrete' }],
    [], ['Base preparation', 'Paving or concrete pour'], ['Drainage', 'Retaining walls'], [{ categoryId: 'concreting', type: 'suggested' }, { categoryId: 'landscaping', type: 'suggested' }]),
];
