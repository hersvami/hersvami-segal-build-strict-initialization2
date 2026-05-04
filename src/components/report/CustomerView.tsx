import type { Company, Project, Variation } from '../../types/domain';
import { CustomerQuoteHeader } from './CustomerQuoteHeader';
import { AcceptanceSection, InvestmentSummary, PaymentTerms } from './CustomerQuoteSummary';
import { ProgressPhotoGrid, ScopeSections } from './CustomerViewParts';
import { QuoteLineSchedule } from './QuoteLineSchedule';

type Props = { variation: Variation; project: Project; company: Company };

export function CustomerView({ variation, project, company }: Props) {
  const photoUrls = (variation.progressPhotos || []).map((p) => p.url);
  const documentLabel = variation.documentType === 'quote' ? 'Quotation' : 'Variation';

  return (
    <div className="bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-slate-200">
        <CustomerQuoteHeader company={company} project={project} variation={variation} documentLabel={documentLabel} />

        {variation.description && (
          <section className="border-b border-slate-200 px-8 py-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Scope Overview</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{variation.description}</p>
          </section>
        )}

        <section className="border-b border-slate-200 px-8 py-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Detailed Scope of Works</h3>
              <p className="mt-1 text-sm text-slate-500">The works below form the basis of this {documentLabel.toLowerCase()}.</p>
            </div>
          </div>
          <ScopeSections scopes={variation.scopes} />
        </section>

        <section className="border-b border-slate-200 px-8 py-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Line Schedule</h3>
          <p className="mt-1 text-sm text-slate-500">Construction stages and priced items forming this quote.</p>
          <div className="mt-4">
            <QuoteLineSchedule scopes={variation.scopes} />
          </div>
        </section>

        <InvestmentSummary variation={variation} />

        <ProgressPhotoGrid urls={photoUrls} />
        <PaymentTerms />
        <AcceptanceSection company={company} />
      </div>
    </div>
  );
}
