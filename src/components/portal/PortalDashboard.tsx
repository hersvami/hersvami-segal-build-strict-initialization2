import type { ReactNode } from 'react';
import { FileText, Eye, Check, X } from 'lucide-react';
import type { Variation, Project, Company } from '../../types/domain';
import type { CustomerPortalSession } from '../../types/appState';
import { formatCurrency, formatDate } from '../../utils/helpers';

type Props = {
  company: Company;
  session: CustomerPortalSession;
  project: Project;
  variations: Variation[];
  onViewQuote: (variation: Variation, project: Project) => void;
};

const STATUS_STYLES: Record<Variation['status'], { bg: string; text: string; label: string; icon: ReactNode }> = {
  draft: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Draft', icon: <FileText className="h-3 w-3" /> },
  sent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent — Awaiting Response', icon: <Eye className="h-3 w-3" /> },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved', icon: <Check className="h-3 w-3" /> },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: <X className="h-3 w-3" /> },
};

export function PortalDashboard({ company, session, project, variations, onViewQuote }: Props) {
  const sentVariations = variations.filter((v) => v.documentType === 'quote' && v.status === 'sent');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {session.customerName}</h1>
            <p className="text-slate-500 mt-1">Project: {project.name} — {project.address}</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>{company.name}</p>
            <p>{company.phone}</p>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Your Documents</h2>
          </div>

          {variations.length === 0 && (
            <p className="p-6 text-sm text-slate-500">No documents available yet. Your builder will notify you when a quote is ready.</p>
          )}

          {variations.map((v) => {
            const status = STATUS_STYLES[v.status];
            const canRespond = v.status === 'sent';
            return (
              <div key={v.id} className="px-6 py-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.icon} {status.label}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {v.documentType === 'quote' ? 'Quotation' : 'Variation'} {v.variationNumber || v.id.slice(0, 5).toUpperCase()}
                    </p>
                    <p className="text-sm text-slate-500">{v.title} • {formatDate(v.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-900">{formatCurrency(v.pricing.total)}</span>
                  <button
                    onClick={() => onViewQuote(v, project)}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  {canRespond && (
                    <span className="text-xs text-blue-600 font-medium">Action required</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info */}
        {sentVariations.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-medium">You have {sentVariations.length} pending quote(s) awaiting your response.</p>
            <p className="text-blue-700 mt-1">Click "View" to review the full scope, pricing, and terms, then approve or reject.</p>
          </div>
        )}
      </div>
    </div>
  );
}
