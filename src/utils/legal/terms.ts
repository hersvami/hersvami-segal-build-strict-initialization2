import { TERMS_PART_1 } from './termsPart1';
import { TERMS_PART_2 } from './termsPart2';
import { TERMS_PART_3 } from './termsPart3';

export type TermsSection = {
  title: string;
  clauses: string[];
};

export const SEGAL_BUILD_TERMS: TermsSection[] = [
  ...TERMS_PART_1,
  ...TERMS_PART_2,
  ...TERMS_PART_3,
];