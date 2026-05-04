import type { QuoteScope } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { calcScopeTotal } from '../../utils/pricing/engine';

export function ScopeSections({ scopes }: { scopes: QuoteScope[] }) {
  return (
    <div className="space-y-5">
      {scopes.map((scope, index) => {
        const total = calcScopeTotal(scope);
        return (
          <article key={scope.id} className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">{index + 1}</span>
                <div>
                  <h4 className="font-semibold text-slate-950">{scope.categoryLabel}</h4>
                  <p className="text-xs text-slate-500">Trade scope</p>
                </div>
              </div>
              {total > 0 && <span className="shrink-0 text-sm font-semibold text-slate-900">{formatCurrency(total)}</span>}
            </div>
            <div className="space-y-4 px-4 py-4">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{scope.description || 'Scope details to follow.'}</p>
              <ScopeList title="Included" items={scope.inclusions.map((item) => item.text)} tone="included" />
              <ScopeList title="Excluded" items={scope.exclusions.map((item) => item.text)} tone="excluded" />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ScopeList({ title, items, tone }: { title: string; items: string[]; tone: 'included' | 'excluded' }) {
  if (items.length === 0) return null;
  const marker = tone === 'included' ? '✓' : '–';
  const color = tone === 'included' ? 'text-emerald-700' : 'text-slate-500';
  return (
    <div>
      <h5 className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h5>
      <ul className="mt-2 grid gap-1.5 text-sm text-slate-700 md:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={`font-semibold ${color}`}>{marker}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProgressPhotoGrid({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <section className="border-b border-slate-200 px-8 py-6">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">Progress Photos</h3>
      <div className="grid grid-cols-2 gap-3">
      {urls.map((url, i) => (
        <img key={i} src={url} alt={`Progress ${i + 1}`} className="h-36 w-full rounded-sm object-cover" />
      ))}
      </div>
    </section>
  );
}
