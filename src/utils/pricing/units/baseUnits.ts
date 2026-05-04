import { ELECTRICAL_UNITS } from './electrical';
import { PLUMBING_UNITS } from './plumbing';
import { TILING_UNITS } from './tiling';
import type { ParametricUnit } from './types';

export const BASE_PARAMETRIC_UNITS: ParametricUnit[] = [
  ...ELECTRICAL_UNITS,
  ...PLUMBING_UNITS,
  ...TILING_UNITS,
];
