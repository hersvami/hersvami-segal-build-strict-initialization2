import type { QuoteScope } from '../../types/domain';

export function ScopeSections({ scopes }: { scopes: QuoteScope[] }) {
  return (
    <div className="space-y-3">
      {scopes.map((scope) => (
        <div key={scope.id} className="rounded-lg border border-slate-200 p-3">
          <h4 className="font-medium text-slate-900">{scope.categoryLabel}</h4>
          <p className="mt-1 text-sm text-slate-600 whitespace-pre-line">{scope.description || 'Scope details to follow.'}</p>
        </div>
      ))}
    </div>
  );
}

export function ProgressPhotoGrid({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-2">
      {urls.map((url, i) => (
        <img key={i} src={url} alt={`Progress ${i + 1}`} className="h-28 w-full rounded-lg object-cover" />
      ))}
    </div>
  );
}