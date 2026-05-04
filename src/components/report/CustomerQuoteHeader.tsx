import type { Company, Project, Variation } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  company: Company;
  project: Project;
  variation: Variation;
  documentLabel: string;
};

export function CustomerQuoteHeader({ company, project, variation, documentLabel }: Props) {
  const quoteDate = new Date(variation.createdAt);
  const expiryDate = new Date(quoteDate);
  expiryDate.setDate(expiryDate.getDate() + 30);
  const documentNumber = variation.variationNumber || `S${variation.id.slice(0, 5).toUpperCase()}`;

  return (
    <>
      <div className="border-b-4 border-blue-700 px-8 py-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">{documentLabel}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{project.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{project.address}</p>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-xl font-bold text-slate-950">{company.name}</h3>
            <p className="mt-1 text-xs text-slate-500">ABN {company.abn}</p>
            {company.licence && <p className="text-xs text-slate-500">Licence {company.licence}</p>}
            <p className="mt-2 text-sm text-slate-700">{company.phone}</p>
            <p className="text-sm text-slate-700">{company.email}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200 md:grid-cols-4">
        <InfoBlock title="Prepared for" lines={[project.customer.name, project.customer.email, project.customer.phone].filter(Boolean)} />
        <InfoBlock title="Document details" lines={[`Quotation # ${documentNumber}`, `Quotation Date: ${quoteDate.toLocaleDateString('en-AU')}`, `Expiration: ${expiryDate.toLocaleDateString('en-AU')}`]} />
        <InfoBlock title="Salesperson" lines={['James Segal', company.phone, company.email]} />
        <div className="bg-blue-50 px-8 py-5 md:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Total incl. GST</p>
          <p className="mt-1 text-3xl font-bold text-blue-900">{formatCurrency(variation.pricing.total)}</p>
        </div>
      </div>
    </>
  );
}

function InfoBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="bg-white px-8 py-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-2 space-y-1 text-sm text-slate-800">
        {lines.map((line) => <p key={line}>{line}</p>)}
      </div>
    </div>
  );
}