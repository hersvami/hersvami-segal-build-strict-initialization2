import { BASIC_TRADE_CATEGORIES } from './groups/basicTrades';
import { BATHROOM_CATEGORIES } from './groups/bathroom';
import { KITCHEN_LAUNDRY_CATEGORIES } from './groups/kitchenLaundry';
import { STRUCTURAL_DECK_CATEGORIES } from './groups/structuralDeck';
import { CORE_CATEGORIES_BUILDS, CORE_CATEGORIES_PART3 } from './corePart3';
import { CORE_CATEGORIES_PART2 } from './corePart2';
import { INDIVIDUAL_TRADE_CATEGORIES } from './groups/individualTrades';
import type { WorkCategory } from './types';

export const CORE_CATEGORIES: WorkCategory[] = [
  ...BATHROOM_CATEGORIES,
  ...KITCHEN_LAUNDRY_CATEGORIES,
  ...BASIC_TRADE_CATEGORIES,
  ...INDIVIDUAL_TRADE_CATEGORIES,
  ...STRUCTURAL_DECK_CATEGORIES,
  ...CORE_CATEGORIES_PART2,
  ...CORE_CATEGORIES_PART3,
  ...CORE_CATEGORIES_BUILDS,
];