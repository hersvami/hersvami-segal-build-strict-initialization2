import { EXTERNAL_LANDSCAPE_CATEGORIES } from './groups/externalLandscape';
import { EXTERNAL_WORK_CATEGORIES } from './groups/externalWorks';
import { SERVICE_CATEGORIES } from './groups/services';
import type { WorkCategory } from './types';

export const CORE_CATEGORIES_PART2: WorkCategory[] = [
  ...SERVICE_CATEGORIES,
  ...EXTERNAL_WORK_CATEGORIES,
  ...EXTERNAL_LANDSCAPE_CATEGORIES,
];
