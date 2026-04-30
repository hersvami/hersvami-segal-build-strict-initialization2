import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { runEstimatorValidation } from '../utils/validation';
import { getRateAuditSummary } from '../utils/validation/rateAudit';

export function SystemValidationPanel() {
  const results = runEstimatorValidation();
  const rateAudit = getRateAuditSummary();
  const failed = results.filter((result) => !result.passed);

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Estimator System Validation</h2>
          <p className="mt-1 text-sm text-slate-600">
            Internal checks for quote maths, dimensions, trade chains, review flags and rate metadata.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${failed.length ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {failed.length ? `${failed.length} check(s) need review` : 'All checks passing'}
        </span>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {results.map((result) => (
          <div key={result.name} className="flex gap-2 rounded-lg bg-slate-50 p-3 text-sm">
            {result.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />}
            <div>
              <p className="font-medium text-slate-800">{result.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{result.details}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Rates: {rateAudit.totalTradeRates} trade rates and {rateAudit.totalUnitRates} BoQ rates. {rateAudit.unverifiedTradeRates + rateAudit.unverifiedUnitRates} are currently benchmark-unverified and must be checked before production quoting.
      </div>
    </div>
  );
}