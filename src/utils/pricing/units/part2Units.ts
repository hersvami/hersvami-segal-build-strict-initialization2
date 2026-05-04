import { KITCHEN_JOINERY_UNITS } from './kitchenJoinery';
import { OPENINGS_HVAC_UNITS } from './openingsHvac';
import { PAINTING_FLOORING_UNITS } from './paintingFlooring';
import { SAFETY_SMART_INSULATION_UNITS } from './safetySmartInsulation';
import type { ParametricUnit } from './types';
import { WATERPROOFING_UNITS } from './waterproofing';

export const PART2_PARAMETRIC_UNITS: ParametricUnit[] = [
  ...WATERPROOFING_UNITS,
  ...PAINTING_FLOORING_UNITS,
  ...KITCHEN_JOINERY_UNITS,
  ...OPENINGS_HVAC_UNITS,
  ...SAFETY_SMART_INSULATION_UNITS,
];
