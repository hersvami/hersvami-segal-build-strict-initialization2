import type { TradeRateItem } from './tradeRateTypes';

export const TRADE_RATES_A_TO_F: TradeRateItem[] = [
  { trade: 'Arborist', categoryId: 'tradeArborist', keywords: ['arborist', 'tree removal', 'pruning'], rate: 1450, unit: 'allow', duration: 1, description: 'Tree works by qualified arborist' },
  { trade: 'Asbestos Removalist', categoryId: 'tradeAsbestosRemoval', keywords: ['asbestos', 'hazmat', 'hazardous material'], rate: 2500, unit: 'allow', duration: 1, description: 'Licensed asbestos removal allowance' },
  { trade: 'Bricklayer', categoryId: 'brickwork', keywords: ['bricklayer', 'brickwork', 'bricklaying'], rate: 220, unit: 'area', duration: 2, description: 'Bricklaying and masonry wall works' },
  { trade: 'Cabinet Maker / Joiner', categoryId: 'cabinetry', keywords: ['cabinet maker', 'joiner', 'joinery'], rate: 350, unit: 'linear', duration: 3, description: 'Cabinetry and joinery works' },
  { trade: 'Carpenter', categoryId: 'carpentry', keywords: ['carpenter', 'carpentry', 'fixing carpenter'], rate: 950, unit: 'allow', duration: 1, description: 'General carpentry labour allowance' },
  { trade: 'Ceiling Fixer', categoryId: 'ceilings', keywords: ['ceiling fixer', 'ceiling', 'cornice'], rate: 85, unit: 'area', duration: 2, description: 'Ceiling framing, sheeting and cornice works' },
  { trade: 'Cladder', categoryId: 'cladding', keywords: ['cladder', 'cladding', 'weatherboard'], rate: 120, unit: 'area', duration: 3, description: 'External cladding installation' },
  { trade: 'Concreter', categoryId: 'concreting', keywords: ['concreter', 'concrete', 'slab'], rate: 110, unit: 'area', duration: 2, description: 'Concrete preparation, form and pour works' },
  { trade: 'Data / Smart Home Technician', categoryId: 'smartHome', keywords: ['data technician', 'smart home', 'network'], rate: 850, unit: 'allow', duration: 1, description: 'Data, CCTV, intercom and smart device works' },
  { trade: 'Demolition Contractor', categoryId: 'demolition', keywords: ['demolition contractor', 'demolisher', 'strip out'], rate: 150, unit: 'area', duration: 2, description: 'Demolition and strip-out works' },
  { trade: 'Electrician', categoryId: 'electrical', keywords: ['electrician', 'electrical', 'sparky'], rate: 950, unit: 'allow', duration: 1, description: 'Electrical rough-in, fit-off and testing' },
  { trade: 'Excavator / Earthmoving', categoryId: 'tradeExcavation', keywords: ['excavator', 'earthmoving', 'site cut'], rate: 1800, unit: 'allow', duration: 1, description: 'Excavation, earthmoving and spoil handling' },
  { trade: 'Fencer', categoryId: 'fencing', keywords: ['fencer', 'fencing', 'gate'], rate: 120, unit: 'linear', duration: 2, description: 'Fence and gate construction' },
  { trade: 'Fire Safety Technician', categoryId: 'fireSafety', keywords: ['fire safety technician', 'smoke alarm', 'fire door'], rate: 240, unit: 'item', duration: 1, description: 'Smoke alarm and fire safety compliance works' },
  { trade: 'Floor Layer', categoryId: 'flooring', keywords: ['floor layer', 'flooring installer', 'carpet layer'], rate: 85, unit: 'area', duration: 2, description: 'Floor covering installation' },
];