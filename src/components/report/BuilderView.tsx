import type { Company, Project, Variation } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  variation: Variation;
  project: Project;
  company: Company;
};

export function BuilderView({ variation, project, company }: Props) {
  const reviewFlags = variation.reviewFlags || [];

  return (
    <div className="space-y-3 p-4">
      <div className="text-sm text-slate-500">
        {company.name} · {project.name}
      </div>
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="flex justify-between text-sm">
          <span>Trade Cost</span>
          <span className="font-medium">{formatCurrency(variation.pricing.tradeCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Overhead ({variation.pricing.overheadPercent}%)</span>
          <span>{formatCurrency(variation.pricing.overheadAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Profit ({variation.pricing.profitPercent}%)</span>
          <span>{formatCurrency(variation.pricing.profitAmount)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-semibold">
          <span>Total incl GST</span>
          <span>{formatCurrency(variation.pricing.total)}</span>
        </div>
      </div>
      {reviewFlags.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-amber-900">Saved Estimator Review Flags</h4>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{reviewFlags.length}</span>
          </div>
          <div className="space-y-1.5">
            {reviewFlags.slice(0, 6).map((flag) => (
              <div key={flag.id} className="text-xs text-amber-900">
                <span className="font-medium">{flag.severity.toUpperCase()}: {flag.title}</span>
                {flag.categoryLabel && <span className="text-amber-700"> · {flag.categoryLabel}</span>}
              </div>
            ))}
          </div>
          {reviewFlags.length > 6 && <p className="mt-2 text-xs text-amber-700">Plus {reviewFlags.length - 6} more flag(s).</p>}
        </div>
      )}
    </div>
  );
}