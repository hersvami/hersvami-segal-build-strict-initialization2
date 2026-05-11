// The "Brain" of the app: Defines rules, options, and defaults for every module type

import type { ModuleType } from '../../types/domain';

export interface ModuleOption {
  id: string;
  label: string;
  description?: string;
  costImpact?: 'low' | 'medium' | 'high'; // For UI indication
}

export interface ModuleSection {
  id: string;
  title: string;
  icon: string;
  fields: ModuleField[];
}

export interface ModuleField {
  key: string;
  type: 'select' | 'number' | 'boolean' | 'text';
  label: string;
  helpText?: string;
  options?: ModuleOption[];
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  requiredIf?: (values: Record<string, any>) => boolean;
}

export interface ModuleConfig {
  id: ModuleType;
  label: string;
  icon: string;
  description: string;
  autoTriggers: {
    field: string;
    condition: (value: any, allValues: Record<string, any>) => boolean;
    action: string;
  }[];
  sections: ModuleSection[];
  calculationRules: {
    // Rules for converting inputs to quantities
    // Implemented in dynamicBOQEngine
  };
}

export const MODULE_CONFIGS: Record<ModuleType, ModuleConfig> = {
  generic: {
    id: 'generic',
    label: 'General Building',
    icon: '🏠',
    description: 'Standard internal renovations and general works',
    autoTriggers: [],
    sections: [
      {
        id: 'dimensions',
        title: 'Dimensions',
        icon: '📏',
        fields: [
          { key: 'area', type: 'number', label: 'Floor Area (m²)', defaultValue: 0, min: 0 },
          { key: 'ceilingHeight', type: 'select', label: 'Ceiling Height', options: [{id:'2.4',label:'2.4m (Standard)'},{id:'2.7',label:'2.7m'},{id:'3.0',label:'3.0m'}], defaultValue: '2.4' },
        ]
      }
    ],
    calculationRules: {}
  },

  decking: {
    id: 'decking',
    label: 'Decking & Pergolas',
    icon: '🪵',
    description: 'Decks, patios, and outdoor structures',
    autoTriggers: [
      {
        field: 'height',
        condition: (val) => val > 1.0,
        action: 'Require Balustrade (NCC 3.9.1)'
      },
      {
        field: 'height',
        condition: (val) => val > 0.2,
        action: 'Require Steps'
      }
    ],
    sections: [
      {
        id: 'structure',
        title: 'Structure & Site',
        icon: '🏗️',
        fields: [
          { key: 'length', type: 'number', label: 'Length (m)', defaultValue: 6, min: 0, step: 0.1 },
          { key: 'width', type: 'number', label: 'Width (m)', defaultValue: 6, min: 0, step: 0.1 },
          { key: 'height', type: 'number', label: 'Height from Ground (m)', defaultValue: 1.0, min: 0, step: 0.1, helpText: 'Triggers stumps, bracing & balustrade rules' },
          { key: 'attachment', type: 'select', label: 'Deck Type', options: [
              { id: 'free', label: 'Free Standing', description: 'Independent structure, 4-sided access' },
              { id: 'attached_1', label: 'Attached to House (1 side)', description: 'Ledger board fixed to house, 3-sided access' },
              { id: 'attached_2', label: 'Attached (2 sides)', description: 'L-shaped or corner deck' }
            ], defaultValue: 'free' },
          { key: 'soilType', type: 'select', label: 'Soil Type', options: [
              { id: 'soft', label: 'Soft / Sand' },
              { id: 'medium', label: 'Medium Clay (Standard)' },
              { id: 'hard', label: 'Hard / Rock' },
              { id: 'rock', label: 'Solid Rock' }
            ], defaultValue: 'medium' },
          { key: 'sitePrep', type: 'select', label: 'Site Preparation', options: [
              { id: 'clear', label: 'Clear / Level' },
              { id: 'slope', label: 'Sloped (Requires Retaining/Cut)' },
              { id: 'demo', label: 'Existing Deck to Remove' }
            ], defaultValue: 'clear' },
          { key: 'skipBin', type: 'boolean', label: 'Include Skip Bin?', defaultValue: true, helpText: 'For waste disposal and site cleanup' },
        ]
      },
      {
        id: 'materials',
        title: 'Materials & Finish',
        icon: '🎨',
        fields: [
          { key: 'material', type: 'select', label: 'Decking Material', options: [
              { id: 'merbau', label: 'Merbau Hardwood', costImpact: 'high' },
              { id: 'treated_pine', label: 'Treated Pine', costImpact: 'low' },
              { id: 'composite', label: 'Composite (e.g. Trex)', costImpact: 'high' },
              { id: 'spotted_gum', label: 'Spotted Gum', costImpact: 'high' }
            ], defaultValue: 'merbau' },
          { key: 'pattern', type: 'select', label: 'Board Pattern', options: [
              { id: 'standard', label: 'Standard (Parallel)', description: 'Least waste, standard install' },
              { id: 'diagonal', label: 'Diagonal (45°)', description: '+15% material waste, more labor' },
              { id: 'picture_frame', label: 'Picture Frame Border', description: 'Perimeter border, requires extra cutting' },
              { id: 'herringbone', label: 'Herringbone', description: 'Complex pattern, +25% waste, high labor' }
            ], defaultValue: 'standard' },
          { key: 'subfloor', type: 'select', label: 'Subfloor Finish', options: [
              { id: 'open', label: 'Open Subfloor' },
              { id: 'skirted', label: 'Skirted / Enclosed', description: 'Timber or lattice screening' }
            ], defaultValue: 'open' },
          { key: 'finish', type: 'select', label: 'Finish', options: [
              { id: 'oiled', label: 'Oiled (2 coats)' },
              { id: 'stained', label: 'Stained' },
              { id: 'natural', label: 'Natural Weathered' }
            ], defaultValue: 'oiled' }
        ]
      },
      {
        id: 'access',
        title: 'Access & Safety',
        icon: '🚧',
        fields: [
          { key: 'stairs', type: 'number', label: 'Number of Stair Sets', defaultValue: 0, min: 0, helpText: 'Auto-calculated if height > 200mm, but can override' },
          { key: 'balustrade', type: 'select', label: 'Balustrade Type', options: [
              { id: 'none', label: 'None (Low level)' },
              { id: 'timber', label: 'Timber Horizontal/Vertical' },
              { id: 'glass', label: 'Frameless Glass (Premium)' },
              { id: 'wire', label: 'Stainless Steel Wire' },
              { id: 'metal', label: 'Aluminium/Steel Slat' }
            ], defaultValue: 'none' },
          { key: 'lighting', type: 'boolean', label: 'Include Deck Lighting?', defaultValue: false },
        ]
      }
    ],
    calculationRules: {}
  },

  bathroom: {
    id: 'bathroom',
    label: 'Bathroom / Wet Area',
    icon: '🚿',
    description: 'Full bathroom renovations and wet areas',
    autoTriggers: [
      {
        field: 'showerType',
        condition: (val) => val === 'custom_tile',
        action: 'Include Waterproofing & Hob'
      }
    ],
    sections: [
      {
        id: 'layout',
        title: 'Layout & Demolition',
        icon: '🔨',
        fields: [
          { key: 'size', type: 'select', label: 'Room Size', options: [
              { id: 'small', label: 'Small (< 4m²)' },
              { id: 'medium', label: 'Medium (4-8m²)' },
              { id: 'large', label: 'Large (> 8m²)' }
            ], defaultValue: 'medium' },
          { key: 'demolition', type: 'select', label: 'Demolition Level', options: [
              { id: 'cosmetic', label: 'Cosmetic (Keep plumbing locations)' },
              { id: 'full', label: 'Full Strip to Studs' },
              { id: 'structural', label: 'Structural (Move walls)' }
            ], defaultValue: 'full' },
          { key: 'asbestos', type: 'boolean', label: 'Suspected Asbestos?', defaultValue: false, helpText: 'Triggers specialist removal quote' }
        ]
      },
      {
        id: 'fixtures',
        title: 'Fixtures & Fittings',
        icon: '🚽',
        fields: [
          { key: 'toilet', type: 'select', label: 'Toilet Type', options: [{id:'close_coupled',label:'Close Coupled'},{id:'wall_hung',label:'Wall Hung (In-wall Cistern)'}], defaultValue: 'close_coupled' },
          { key: 'vanity', type: 'select', label: 'Vanity', options: [{id:'single',label:'Single (600mm)'},{id:'double',label:'Double (1200mm)'},{id:'custom',label:'Custom Joinery'}], defaultValue: 'single' },
          { key: 'showerType', type: 'select', label: 'Shower Base', options: [
              { id: 'acrylic', label: 'Acrylic Base (Standard)' },
              { id: 'stone_resin', label: 'Stone Resin' },
              { id: 'custom_tile', label: 'Custom Tiled Hob/Waste' }
            ], defaultValue: 'acrylic' },
          { key: 'bath', type: 'boolean', label: 'Include Bathtub?', defaultValue: false },
          { key: 'heatedRail', type: 'boolean', label: 'Heated Towel Rail?', defaultValue: false }
        ]
      },
      {
        id: 'surfaces',
        title: 'Surfaces & Tiling',
        icon: '🟫',
        fields: [
          { key: 'wallTiles', type: 'select', label: 'Wall Tiles', options: [{id:'standard',label:'Standard Ceramic'}, {id:'feature',label:'Feature Wall'}, {id:'full_height',label:'Full Height to Ceiling'}], defaultValue: 'standard' },
          { key: 'floorTiles', type: 'select', label: 'Floor Tiles', options: [{id:'ceramic',label:'Ceramic'}, {id:'porcelain',label:'Porcelain'}, {id:'natural_stone',label:'Natural Stone'}], defaultValue: 'porcelain' },
          { key: 'tilePattern', type: 'select', label: 'Tile Pattern', options: [
              { id: 'straight', label: 'Straight Lay' },
              { id: 'herringbone', label: 'Herringbone (+20% waste/labor)' },
              { id: 'diamond', label: 'Diamond Lay' }
            ], defaultValue: 'straight' },
          { key: 'grout', type: 'select', label: 'Grout Type', options: [{id:'cement',label:'Cement'}, {id:'epoxy',label:'Epoxy (Mold resistant)'}], defaultValue: 'cement' }
        ]
      }
    ],
    calculationRules: {}
  },

  kitchen: {
    id: 'kitchen',
    label: 'Kitchen',
    icon: '🍳',
    description: 'Kitchen renovations and joinery',
    autoTriggers: [],
    sections: [
      {
        id: 'layout',
        title: 'Layout & Configuration',
        icon: '📐',
        fields: [
          { key: 'shape', type: 'select', label: 'Kitchen Shape', options: [
              { id: 'galley', label: 'Galley' },
              { id: 'l_shape', label: 'L-Shape' },
              { id: 'u_shape', label: 'U-Shape' },
              { id: 'island', label: 'Island Kitchen' }
            ], defaultValue: 'l_shape' },
          { key: 'cabinets', type: 'select', label: 'Cabinet Style', options: [{id:'laminate',label:'Laminate'}, {id:'2pac',label:'2-Pac Painted'}, {id:'timber_veneer',label:'Timber Veneer'}], defaultValue: 'laminate' },
          { key: 'benchtop', type: 'select', label: 'Benchtop Material', options: [{id:'laminate',label:'Laminate'}, {id:'stone_caesar',label:'Engineered Stone'}, {id:'granite',label:'Granite'}, {id:'timber',label:'Timber'}], defaultValue: 'stone_caesar' }
        ]
      },
      {
        id: 'appliances',
        title: 'Appliances',
        icon: '🔌',
        fields: [
          { key: 'cooktop', type: 'select', label: 'Cooktop', options: [{id:'gas',label:'Gas'}, {id:'induction',label:'Induction'}, {id:'electric',label:'Electric'}], defaultValue: 'induction' },
          { key: 'oven', type: 'select', label: 'Oven', options: [{id:'single',label:'Single Underbench'}, {id:'double',label:'Double Wall Oven'}], defaultValue: 'single' },
          { key: 'dishwasher', type: 'boolean', label: 'Dishwasher?', defaultValue: true },
          { key: 'rangehood', type: 'select', label: 'Rangehood', options: [{id:'underbench',label:'Underbench'}, {id:'wall',label:'Wall Mounted'}, {id:'inline',label:'Inline (Roof)'}], defaultValue: 'wall' }
        ]
      }
    ],
    calculationRules: {}
  },

  laundry: { id: 'laundry', label: 'Laundry', icon: '🧺', description: 'Laundry fitouts', autoTriggers: [], sections: [], calculationRules: {} },
  grannyFlat: { id: 'grannyFlat', label: 'Granny Flat / DPU', icon: '🏡', description: 'Secondary dwellings', autoTriggers: [], sections: [], calculationRules: {} },
  extension: { id: 'extension', label: 'Extension', icon: '🏗️', description: 'Room additions', autoTriggers: [], sections: [], calculationRules: {} },
  landscaping: { id: 'landscaping', label: 'Landscaping', icon: '🌿', description: 'Gardens, paving, retaining', autoTriggers: [], sections: [], calculationRules: {} },
  pool: { id: 'pool', label: 'Pool & Spa', icon: '🏊', description: 'Swimming pools', autoTriggers: [], sections: [], calculationRules: {} },
};