import type { QuoteScope } from '../../types/domain';

export type AnswerPricingAdjustment = {
  multiplier: number;
  note?: string;
};

const PREMIUM_TERMS = ['premium', 'large-format', 'large format', 'stone', 'porcelain', 'frameless', 'wall-hung', 'in-wall', 'hydronic', 'ducted'];
const MID_TERMS = ['mid-range', 'rectified', 'composite', 'colorbond', 'double', 'custom', 'relocation', 'full renovation'];
const COMPLEX_TERMS = ['large', 'whole house', 'multiple rooms', 'difficult', 'structural', 'new opening'];
const SIMPLE_TERMS = ['small', 'minimal prep', 'standard', 'reuse existing'];

export function getAnswerPricingAdjustment(scope: QuoteScope): AnswerPricingAdjustment {
  const answers = scope.questionAnswers || [];
  if (answers.length === 0) return { multiplier: 1 };

  let uplift = 0;
  for (const answer of answers) {
    const text = answer.answer.toLowerCase();
    if (PREMIUM_TERMS.some((term) => text.includes(term))) uplift += 0.2;
    else if (MID_TERMS.some((term) => text.includes(term))) uplift += 0.1;
    else if (COMPLEX_TERMS.some((term) => text.includes(term))) uplift += 0.08;
    else if (SIMPLE_TERMS.some((term) => text.includes(term))) uplift -= 0.03;
  }

  const multiplier = Math.max(0.85, Math.min(1.75, 1 + uplift));
  if (Math.abs(multiplier - 1) < 0.01) return { multiplier: 1 };

  return {
    multiplier,
    note: `Adjusted ${Math.round((multiplier - 1) * 100)}% from category answers`,
  };
}