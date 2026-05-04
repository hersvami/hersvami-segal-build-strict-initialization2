import { useState } from 'react';
import { X } from 'lucide-react';
import type { ExternalQuoteReference } from '../types/domain';

type Props = {
  onClose: () => void;
  onSubmit: (payload: ExternalQuoteReference) => void;
};

export function ExternalQuoteModal({ onClose, onSubmit }: Props) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [provider, setProvider] = useState('');
  const [originalAmount, setOriginalAmount] = useState(0);
  const [summaryScope, setSummaryScope] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!referenceNumber.trim() || !provider.trim() || originalAmount <= 0) return;
    onSubmit({
      referenceNumber: referenceNumber.trim(),
      provider: provider.trim(),
      originalApprovedAmount: originalAmount,
      summaryScope: summaryScope.trim() || 'External quote — see reference',
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Link External Quote</h2>
            <p className="text-sm text-slate-500 mt-1">Use this if the original quote was from another builder.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Reference Number</label>
            <input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="e.g. QB-2024-001" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Provider / Builder</label>
            <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g. ABC Constructions" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Original Approved Amount (excl. GST)</label>
            <input type="number" value={originalAmount || ''} onChange={(e) => setOriginalAmount(Number(e.target.value))} placeholder="0" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Summary Scope</label>
            <textarea value={summaryScope} onChange={(e) => setSummaryScope(e.target.value)} rows={3} placeholder="Brief description of works covered by the original quote…" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any additional context…" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={handleSubmit} disabled={!referenceNumber.trim() || !provider.trim() || originalAmount <= 0} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Link Baseline</button>
        </div>
      </div>
    </div>
  );
}
