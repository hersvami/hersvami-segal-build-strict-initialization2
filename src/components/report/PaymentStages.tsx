import type { Variation } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

const PAYMENT_STAGES = [
  { name: 'Deposit', pct: 0.05 },
  { name: 'Base stage', pct: 0.10 },
  { name: 'Frame stage', pct: 0.15 },
  { name: 'Lock-up stage', pct: 0.35 },
  { name: 'Fixing stage', pct: 0.20 },
  { name: 'Practical Completion', pct: 0.15 },
] as const;

export function PaymentStages({ variation }: { variation: Variation }) {
  const total = variation.pricing.total || 0;
  let cumulative = 0;

  return (
    <section className="border-b border-slate-200 px-8 py-6">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Progressive Payment Schedule</h3>
      <p className="mt-1 text-xs text-slate-500">Domestic Building Contracts Act 1995 (VIC) — Section 40 compliant</p>
      <div className="mt-4 overflow-hidden rounded-sm border border-slate-200">
        <div className="grid grid-cols-[1fr_120px_120px_120px] bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white">
          <span>Stage</span>
          <span className="text-right">Percentage</span>
          <span className="text-right">Stage Amount</span>
          <span className="text-right">Cumulative</span>
        </div>
        {PAYMENT_STAGES.map((stage) => {
          const amount = Math.round(total * stage.pct);
          cumulative += amount;
          return (
            <div key={stage.name} className="grid grid-cols-[1fr_120px_120px_120px] border-t border-slate-200 px-4 py-2.5 text-sm text-slate-700">
              <span className="font-medium text-slate-900">{stage.name}</span>
              <span className="text-right">{(stage.pct * 100).toFixed(0)}%</span>
              <span className="text-right">{formatCurrency(amount)}</span>
              <span className="text-right font-medium">{formatCurrency(cumulative)}</span>
            </div>
          );
        })}
        <div className="grid grid-cols-[1fr_120px_120px_120px] bg-slate-50 px-4 py-2.5 text-sm font-bold border-t-2 border-slate-300 text-slate-950">
          <span>Total</span>
          <span className="text-right">100%</span>
          <span className="text-right">{formatCurrency(total)}</span>
          <span className="text-right">{formatCurrency(cumulative)}</span>
        </div>
      </div>
    </section>
  );
}
