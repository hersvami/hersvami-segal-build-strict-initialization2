import { BASE_PARAMETRIC_UNITS } from './units/baseUnits';
import { PART2_PARAMETRIC_UNITS } from './units/part2Units';
import type { ParametricUnit } from './units/types';

export type { PhaseKey, ParametricUnit } from './units/types';

export const PARAMETRIC_UNITS: ParametricUnit[] = BASE_PARAMETRIC_UNITS;
export const PARAMETRIC_UNITS_PART2: ParametricUnit[] = PART2_PARAMETRIC_UNITS;

const COMPLIANCE_BY_CATEGORY: Record<string, string> = {
  electrical: 'AS/NZS 3000',
  plumbing: 'VBA Plumbing Compliance',
  tiling: 'AS 3958',
  waterproofing: 'AS 3740',
  painting: 'Manufacturer System + Site Safety',
  flooring: 'Manufacturer Install Standards',
  kitchen: 'NCC + Trade Coordination',
  cabinetry: 'AS/NZS 4386 / Manufacturer Standards',
  windowsDoors: 'NCC Glazing / Egress',
  hvac: 'NCC + Manufacturer Commissioning',
  fireSafety: 'AS 3786 / VBA',
  smartHome: 'AS/NZS 3000 + Data Standards',
  insulation: 'NCC Section J',
};

function getDefaultComplianceRef(unit: ParametricUnit): string {
  if (unit.id === 'tl-waterproof' || unit.id.startsWith('wp-')) return 'AS 3740';
  if (unit.id === 'el-smoke-alarm' || unit.id === 'fs-smoke') return 'AS 3786';
  return COMPLIANCE_BY_CATEGORY[unit.categoryId] || 'Relevant VBA / NCC Standard';
}

function withComplianceRef(unit: ParametricUnit): ParametricUnit {
  return unit.complianceRef ? unit : { ...unit, complianceRef: getDefaultComplianceRef(unit) };
}

const ALL_UNITS: ParametricUnit[] = [
  ...PARAMETRIC_UNITS,
  ...PARAMETRIC_UNITS_PART2,
].map(withComplianceRef);

export function getUnitsForCategory(categoryId: string): ParametricUnit[] {
  return ALL_UNITS.filter((unit) => unit.categoryId === categoryId);
}

export function getUnitById(unitId: string): ParametricUnit | undefined {
  return ALL_UNITS.find((unit) => unit.id === unitId);
}

export function getComplianceRefByUnitId(unitId: string): string | undefined {
  return getUnitById(unitId)?.complianceRef;
}

export function hasParametricUnits(categoryId: string): boolean {
  return ALL_UNITS.some((unit) => unit.categoryId === categoryId);
}

export function calcParametricTotal(items: { rate: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.rate * item.quantity, 0);
}

export function getAllParametricUnits(): ParametricUnit[] {
  return ALL_UNITS;
}