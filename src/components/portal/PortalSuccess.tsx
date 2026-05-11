import { Check, FileText } from 'lucide-react';
import type { Variation, Company } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  company: Company;
  variation: Variation;
};

export function PortalSuccess({ company, variation }: Props) {
  const isApproved = variation.status === 'approved';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
        {isApproved ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Quotation Approved!</h2>
            <p className="text-slate-500 mt-2">Thank you for approving this quotation. Your builder will be notified and work can begin.</p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Response Recorded</h2>
            <p className="text-slate-500 mt-2">Your feedback has been submitted. Your builder will be in touch to discuss next steps.</p>
          </>
        )}

        <div className="mt-6 bg-slate-50 rounded-lg p-4 text-sm">
          <p className="font-medium text-slate-900">{variation.title}</p>
          <p className="text-slate-500 mt-1">Total: {formatCurrency(variation.pricing.total)}</p>
          <p className={`mt-2 font-medium ${isApproved ? 'text-emerald-700' : 'text-red-700'}`}>
            {isApproved ? 'Status: Approved' : 'Status: Rejected'}
          </p>
        </div>

        <p className="text-xs text-slate-400 mt-6">{company.name} • {company.phone}</p>
      </div>
    </div>
  );
}
