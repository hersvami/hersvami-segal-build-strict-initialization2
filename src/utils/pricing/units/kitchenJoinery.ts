import { unit, type ParametricUnit } from './types';

export const KITCHEN_JOINERY_UNITS: ParametricUnit[] = [
  unit('kt-cabinetry', 'kitchen', 'Base + Wall Cabinetry', 'Supply & install modular kitchen cabinetry', 'lm', 1100, 'Cabinetry', 4, 'structure'),
  unit('kt-bench-lam', 'kitchen', 'Laminate Benchtop', 'Supply & install laminate benchtop', 'lm', 280, 'Cabinetry', 4, 'structure'),
  unit('kt-bench-stone', 'kitchen', 'Stone Benchtop (Caesarstone)', 'Supply & install 20mm Caesarstone benchtop', 'lm', 850, 'Cabinetry', 4, 'structure'),
  unit('kt-sink', 'kitchen', 'Kitchen Sink (Undermount)', 'Supply & install undermount kitchen sink', 'each', 450, 'Plumbing', 1, 'services'),
  unit('kt-tap', 'kitchen', 'Kitchen Mixer Tap', 'Supply & install kitchen mixer tapware', 'each', 280, 'Plumbing', 1, 'services'),
  unit('kt-appliance-con', 'kitchen', 'Appliance Connection', 'Connect oven, cooktop or dishwasher', 'each', 220, 'Electrical', 2, 'services'),
  unit('kt-splashback', 'kitchen', 'Tile Splashback', 'Supply & lay tile splashback behind bench', 'm2', 160, 'Tiling', 2, 'finishes'),
  unit('cb-bir', 'cabinetry', 'Built-in Robe (BIR)', 'Supply & install built-in wardrobe', 'lm', 750, 'Cabinetry', 2, 'structure'),
  unit('cb-vanity', 'cabinetry', 'Bathroom Vanity Unit', 'Supply & install vanity unit with basin', 'each', 1200, 'Cabinetry', 1, 'structure'),
  unit('cb-mirror', 'cabinetry', 'Bathroom Mirror / Cabinet', 'Supply & install bathroom mirror or cabinet', 'each', 350, 'Cabinetry', 1, 'structure'),
  unit('cb-shelving', 'cabinetry', 'Adjustable Shelving', 'Supply & install adjustable shelf system', 'lm', 180, 'Cabinetry', 3, 'structure'),
];
