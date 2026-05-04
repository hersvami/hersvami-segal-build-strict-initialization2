import type { ProjectBaseline } from '../../types/domain';
import { getAllCategories } from '../../utils/pricing/scopeRecogniser';

export type Step = 'baseline' | 'scope' | 'details' | 'pricing' | 'review';

export const GEMINI_KEY_STORAGE = 'segal:geminiApiKey';
export const STEPS: Step[] = ['baseline', 'scope', 'details', 'pricing', 'review'];
export const STEP_LABELS: Record<Step, string> = {
  baseline: 'Project', scope: 'Scope', details: 'Details', pricing: 'Pricing', review: 'Review',
};

export function getDefaultBaseline(): ProjectBaseline {
  return { totalAreaM2: 0, storeys: 'single', siteAccess: 'easy', ceilingHeightM: 2.4, notes: '' };
}

export function groupCategories() {
  const groups: Record<string, Array<{ id: string; label: string }>> = {};
  for (const category of getAllCategories()) {
    if (!groups[category.group]) groups[category.group] = [];
    groups[category.group].push({ id: category.id, label: category.label });
  }
  return groups;
}

export function moveStep(step: Step, setStep: (value: Step) => void, delta: number) {
  const index = STEPS.indexOf(step);
  const next = index + delta;
  if (next >= 0 && next < STEPS.length) setStep(STEPS[next]);
}

export function readGeminiKey(projectKey?: string) {
  if (typeof window === 'undefined') return projectKey || '';
  try { return window.localStorage.getItem(GEMINI_KEY_STORAGE) || projectKey || ''; } catch { return projectKey || ''; }
}
