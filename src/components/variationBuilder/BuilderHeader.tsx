import { X } from 'lucide-react';
import { cn, formatCurrency } from '../../utils/helpers';
import type { ProjectBaseline } from '../../types/domain';
import type { BaselineAdjustment } from '../../utils/pricing/baselineMultipliers';
import { describeBaseline } from '../../utils/pricing/baselineMultipliers';
import { STEPS, STEP_LABELS, type Step } from './builderShared';

type Props = {
  documentType: 'quote' | 'variation';
  step: Step;
  baseline: ProjectBaseline;
  baselineAdj: BaselineAdjustment;
  onCancel: () => void;
};

export function BuilderHeader({ documentType, step, baseline, baselineAdj, onCancel }: Props) {
  return (
    <header className="shrink-0 border-b border-slate-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          {documentType === 'quote' ? 'New Quote' : 'New Variation'}
        </h2>
        <button onClick={onCancel} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close builder">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-2">
        {STEPS.map((name, i) => (
          <div
            key={name}
            className={cn(
              'flex-1 rounded-lg py-2 text-center text-sm font-medium',
              name === step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500',
            )}
          >
            {i + 1}. {STEP_LABELS[name]}
          </div>
        ))}
      </div>

      {baseline.totalAreaM2 > 0 && step !== 'baseline' && (
        <p className="mt-2 text-xs text-slate-500">
          Baseline: <span className="font-medium text-slate-700">{describeBaseline(baseline)}</span>
          {baselineAdj.totalAdjustment > 0 && (
            <span>
              {' '}· auto-adjustment{' '}
              <span className="font-medium text-amber-700">
                {formatCurrency(baselineAdj.totalAdjustment)}
              </span>
            </span>
          )}
        </p>
      )}
    </header>
  );
}