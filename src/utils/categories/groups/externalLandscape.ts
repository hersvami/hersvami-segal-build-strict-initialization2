import { cat, type WorkCategory } from '../types';

export const EXTERNAL_LANDSCAPE_CATEGORIES: WorkCategory[] = [
  cat('landscaping', '🌿 Landscaping', 'landscaping', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Garden beds', 'Turf', 'Full landscape', 'Irrigation'] }],
    [{ name: 'Site Prep', trade: 'Landscaping', rate: 25, unit: 'area', duration: 1, description: 'Clear and prepare' }, { name: 'Landscaping', trade: 'Landscaping', rate: 85, unit: 'area', duration: 3, description: 'Supply and install' }],
    [], ['All materials and labour', 'Basic planting'], ['Retaining walls', 'Irrigation systems', 'Lighting'], [{ categoryId: 'concreting', type: 'suggested' }]),
  cat('pools', '🏊 Pool & Spa', 'pools', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Concrete pool', 'Fiberglass', 'Renovation'] }],
    [{ name: 'Excavation & Steel', trade: 'Concreting', rate: 25000, unit: 'item', duration: 3, description: 'Excavate and steel fix' }, { name: 'Shell Construction', trade: 'Concreting', rate: 30000, unit: 'item', duration: 3, description: 'Shotcrete/gunite shell' }, { name: 'Tile & Coping', trade: 'Tiling', rate: 8000, unit: 'item', duration: 2, description: 'Waterline tile and coping' }, { name: 'Equipment & Finish', trade: 'Plumbing', rate: 12000, unit: 'item', duration: 2, description: 'Pump, filter, interior finish' }],
    [{ description: 'Pool Equipment', allowance: 5000, unit: 'allowance' }], ['Pool shell construction', 'Equipment installation', 'Compliance fencing (separate)'], ['Pool fencing', 'Landscaping', 'Heating'], [{ categoryId: 'fencing', type: 'auto' }, { categoryId: 'electrical', type: 'auto' }, { categoryId: 'landscaping', type: 'suggested' }]),
  cat('windowsDoors', '🪟 Windows & Doors', 'windowsDoors', 'external',
    [{ id: 'type', label: 'Type', type: 'select', options: ['Window replacement', 'New window', 'Door replacement', 'New door', 'Stacker/sliding'] }],
    [{ name: 'Remove Existing', trade: 'Carpentry', rate: 250, unit: 'item', duration: 0.5, description: 'Remove old window/door' }, { name: 'Install New', trade: 'Carpentry', rate: 650, unit: 'item', duration: 1, description: 'Install new window/door' }],
    [{ description: 'Window/Door Unit', allowance: 1200, unit: 'item' }], ['Supply and install', 'Making good internal/external'], ['Structural alterations for new openings', 'Council permits', 'Flyscreens/security'], [{ categoryId: 'painting', type: 'suggested' }]),
];