import { unit, type ParametricUnit } from './types';

export const WATERPROOFING_UNITS: ParametricUnit[] = [
  unit('wp-liquid-mem', 'waterproofing', 'Liquid Membrane (Class III)', 'Liquid membrane per AS3740 - floor + junctions', 'm2', 55, 'Waterproofing', 8, 'finishes'),
  unit('wp-sheet-mem', 'waterproofing', 'Sheet Membrane', 'Sheet membrane for wet area floor', 'm2', 65, 'Waterproofing', 5, 'finishes'),
  unit('wp-bond-breaker', 'waterproofing', 'Bond Breaker Tape', 'Bond breaker tape at wall/floor junctions', 'lm', 18, 'Waterproofing', 10, 'finishes'),
  unit('wp-flood-test', 'waterproofing', 'Flood Test', 'Flood test all waterproofed areas', 'allow', 180, 'Waterproofing', 1, 'finishes'),
];
