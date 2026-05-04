import { unit, type ParametricUnit } from './types';

export const OPENINGS_HVAC_UNITS: ParametricUnit[] = [
  unit('wd-door-int', 'windowsDoors', 'Internal Door (Flush Panel)', 'Supply & install internal flush panel door', 'each', 650, 'Carpentry', 2, 'structure'),
  unit('wd-door-ext', 'windowsDoors', 'External Door (Solid Core)', 'Supply & install solid core external door', 'each', 1200, 'Carpentry', 1, 'structure'),
  unit('wd-window-alum', 'windowsDoors', 'Aluminium Window (Single)', 'Supply & install aluminium framed window', 'each', 850, 'Carpentry', 2, 'structure'),
  unit('wd-window-dg', 'windowsDoors', 'Window (Double Glazed)', 'Supply & install double glazed window unit', 'each', 1400, 'Carpentry', 1, 'structure'),
  unit('wd-sliding-door', 'windowsDoors', 'Sliding Door (Alum Frame)', 'Supply & install aluminium sliding door', 'each', 2200, 'Carpentry', 1, 'structure'),
  unit('wd-door-hardware', 'windowsDoors', 'Door Hardware Set', 'Supply & install lever handle set per door', 'each', 120, 'Carpentry', 2, 'structure'),
  unit('wd-door-closer', 'windowsDoors', 'Door Closer (Fire Door)', 'Supply & install hydraulic door closer', 'each', 180, 'Carpentry', 1, 'structure'),
  unit('hv-split-2.5', 'hvac', '2.5kW Split System', 'Supply & install 2.5kW split system AC', 'each', 1800, 'HVAC', 1, 'services'),
  unit('hv-split-7kw', 'hvac', '7.0kW Split System', 'Supply & install 7.0kW split system AC', 'each', 2800, 'HVAC', 1, 'services'),
  unit('hv-ducted', 'hvac', 'Ducted System (full)', 'Supply & install ducted HVAC system', 'allow', 12500, 'HVAC', 1, 'services'),
  unit('hv-vent', 'hvac', 'Return Air / Vent Grill', 'Supply & install return air box and grill', 'each', 450, 'HVAC', 1, 'services'),
  unit('hv-duct-zone', 'hvac', 'Ducted Zone (add-on)', 'Add a zone to existing ducted system', 'each', 850, 'HVAC', 1, 'services'),
];
