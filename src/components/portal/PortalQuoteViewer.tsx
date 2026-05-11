import { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { Company, Project, Variation, Signature } from '../../types/domain';
import { CustomerView } from '../report/CustomerView';
import { formatCurrency } from '../../utils/helpers';
import { SignaturePad } from './SignaturePad';

type Props = {
  company: Company;
  project: Project;
  variation: Variation;
  onBack: () => void;
  onApprove: (signature: Signature) => void;
  onReject: (reason: string) => void;
};

type ActionState = 'none' | 'sign' | 'reject';

export function PortalQuoteViewer({ company, project, variation, onBack, onApprove, onReject }: Props) {
  const [action, setAction] = useState<ActionState>('none');
  const [rejectReason, setRejectReason] = useState('');

  const isApproved = variation.status === 'approved';
  const isRejected = variation.status === 'rejected';
  const canRespond = variation.status === 'sent';

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">
            {variation.documentType === 'quote' ? 'Quotation' : 'Variation'} {variation.variationNumber || variation.id.slice(0, 5).toUpperCase()}
          </p>
          <p className="text-xs text-slate-500">Total: {formatCurrency(variation.pricing.total)}</p>
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Quote Content */}
      <div className="p-4 md:p-6">
        <CustomerView variation={variation} project={project} company={company} />
      </div>

      {/* Action Bar */}
      {canRespond && action === 'none' && (
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-center gap-4 shadow-lg">
          <button
            onClick={() => setAction('reject')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 font-medium text-sm"
          >
            <X className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={() => setAction('sign')}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm shadow-lg shadow-emerald-600/20"
          >
            <Check className="h-4 w-4" /> Approve & Sign
          </button>
        </div>
      )}

      {/* Status Messages */}
      {isApproved && (
        <div className="sticky bottom-0 bg-emerald-50 border-t border-emerald-200 px-6 py-4 text-center">
          <p className="text-sm font-medium text-emerald-800">✓ This quotation has been approved.</p>
        </div>
      )}
      {isRejected && (
        <div className="sticky bottom-0 bg-red-50 border-t border-red-200 px-6 py-4 text-center">
          <p className="text-sm font-medium text-red-800">✗ This quotation has been rejected.</p>
        </div>
      )}

      {/* Signature Modal */}
      {action === 'sign' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Sign to Approve</h3>
              <p className="text-sm text-slate-500 mt-1">Draw your signature below. This constitutes your digital approval of the quotation.</p>
            </div>
            <div className="p-6">
              <SignaturePad onSignature={(dataUrl) => {
                onApprove({ name: 'Client Signature', date: new Date().toISOString(), dataUrl });
              }} />
            </div>
            <div className="border-t border-slate-200 p-4 flex justify-end">
              <button onClick={() => setAction('none')} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {action === 'reject' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Reject Quotation</h3>
              <p className="text-sm text-slate-500 mt-1">Please provide a reason for rejection.</p>
            </div>
            <div className="p-6">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Budget exceeds expectations, scope changes needed, etc."
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="border-t border-slate-200 p-4 flex justify-end gap-3">
              <button onClick={() => { setAction('none'); setRejectReason(''); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button
                onClick={() => onReject(rejectReason || 'No reason provided')}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
