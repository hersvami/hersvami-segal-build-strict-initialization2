import { BUILD_CATEGORIES } from './groups/builds';
import { ENVELOPE_SPECIALTY_CATEGORIES } from './groups/envelopeSpecialty';
import { STRUCTURAL_EXTRA_CATEGORIES } from './groups/structuralExtras';
import type { WorkCategory } from './types';

export const CORE_CATEGORIES_PART3: WorkCategory[] = [
  ...ENVELOPE_SPECIALTY_CATEGORIES,
  ...STRUCTURAL_EXTRA_CATEGORIES,
];

export const CORE_CATEGORIES_BUILDS: WorkCategory[] = [...BUILD_CATEGORIES];