import type { Company, Project, Variation } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { ProgressPhotoGrid, ScopeSections } from './CustomerViewParts';

type Props = {
  variation: Variation;
  project: Project;
  company: Company;
};

export function CustomerView({ variation, project, company }: Props) {
  const photoUrls = (variation.progressPhotos || []).map((p) => p.url);

  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{company.name}</h3>
        <p className="text-sm text-slate-500">Quotation for {project.customer.name}</p>
      </div>
      <ScopeSections scopes={variation.scopes} />
      <ProgressPhotoGrid urls={photoUrls} />
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex justify-between font-semibold">
          <span>Total (incl GST)</span>
          <span>{formatCurrency(variation.pricing.total)}</span>
        </div>
      </div>
    </div>
  );
}