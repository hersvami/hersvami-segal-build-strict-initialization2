import type { Company, Variation } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

export function InvestmentSummary({ variation }: { variation: Variation }) {
  return (
    <section className="border-b border-slate-200 px-8 py-6">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Investment Summary</h3>
      <div className="mt-4 overflow-hidden rounded-sm border border-slate-200">
        <PriceRow label="Direct construction cost" value={variation.pricing.tradeCost} />
        {Boolean(variation.pricing.preliminariesAmountExGst) && <PriceRow label={`Preliminaries (${variation.pricing.preliminariesPercent || 0}%)`} value={variation.pricing.preliminariesAmountExGst || 0} />}
        <PriceRow label={`Builder overhead (${variation.pricing.overheadPercent}%)`} value={variation.pricing.overheadAmount} />
        <PriceRow label={`Builder margin (${variation.pricing.profitPercent}%)`} value={variation.pricing.profitAmount} />
        <PriceRow label={`Risk and contingency (${variation.pricing.contingencyPercent}%)`} value={variation.pricing.contingencyAmount} />
        <PriceRow label="Subtotal excl. GST" value={variation.pricing.subtotalExclGst} strong />
        <PriceRow label="GST" value={variation.pricing.gstAmount} />
        <div className="flex items-center justify-between bg-blue-700 px-4 py-4 text-white">
          <span className="text-sm font-bold uppercase tracking-wide">Total payable incl. GST</span>
          <span className="text-2xl font-bold">{formatCurrency(variation.pricing.total)}</span>
        </div>
      </div>
    </section>
  );
}

export function PaymentTerms() {
  return (
    <section className="border-b border-slate-200 px-8 py-6">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Payment Terms</h3>
      <div className="mt-3 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
        <div>
          <p className="font-semibold text-slate-900">Payment Due on Invoice</p>
          <p className="mt-1">Account Name: Segal Build Pty. Ltd.</p>
          <p>BSB: 083004</p>
          <p>Account No.: 971236454</p>
        </div>
        <div className="rounded-sm bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          This invoice is issued pursuant to the Building and Construction Industry Security of Payment Act 2002 (VIC). Variations, latent conditions, design changes and client-selected PC item upgrades are quoted separately unless included above.
        </div>
      </div>
    </section>
  );
}

export function AcceptanceSection({ company }: { company: Company }) {
  return (
    <section className="bg-slate-950 px-8 py-6 text-white">
      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <div>
          <h3 className="text-lg font-semibold">Approval</h3>
          <p className="mt-1 text-sm text-slate-300">Please review the scope, exclusions and total carefully before approval.</p>
          <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
            <div className="border-t border-slate-600 pt-2 text-slate-300">Client Signature</div>
            <div className="border-t border-slate-600 pt-2 text-slate-300">Date</div>
          </div>
        </div>
        <div className="text-sm text-slate-300 md:text-right">
          <p>{company.name}</p>
          <p>{company.phone} · {company.email}</p>
        </div>
      </div>
    </section>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm ${strong ? 'bg-slate-50 font-semibold text-slate-950' : 'text-slate-700'}`}>
      <span>{label}</span>
      <span className="font-semibold text-slate-950">{formatCurrency(value)}</span>
    </div>
  );
}