import { useState } from 'react';
import { X, Mail, Copy, MessageSquare, Send, Check } from 'lucide-react';
import type { Company, Project, Variation } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { buildEmailSignature } from '../../utils/company/signature';

type Props = {
  project: Project;
  variation: Variation;
  company: Company;
  onClose: () => void;
  onMarkSent: () => void;
};

export function ReportSendModal({ project, variation, company, onClose, onMarkSent }: Props) {
  const [copied, setCopied] = useState(false);

  const docLabel = variation.documentType === 'quote' ? 'Quote' : 'Variation';
  const subject = `${docLabel} — ${project.name} — ${company.name}`;

  const bodyLines = [
    `Dear ${project.customer.name},`,
    '',
    `Please find your ${docLabel.toLowerCase()} for ${project.name}.`,
    '',
    `Total (incl. GST): ${formatCurrency(variation.pricing.total)}`,
    '',
    `Scopes included:`,
    ...variation.scopes.map((s) => `  • ${s.categoryLabel}`),
    '',
    'Please review and let us know if you have any questions.',
    '',
    ...buildEmailSignature(company),
  ];
  const bodyText = bodyLines.join('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGmail = () => {
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(bodyText);
    window.open(`https://mail.google.com/mail/?view=cm&to=${project.customer.email}&su=${s}&body=${b}`, '_blank');
  };

  const handleMailApp = () => {
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(bodyText);
    window.location.href = `mailto:${project.customer.email}?subject=${s}&body=${b}`;
  };

  const handleWhatsApp = () => {
    const phone = (project.customer.phone || '').replace(/\D/g, '');
    const text = encodeURIComponent(`${subject}\n\n${bodyText}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleSMS = () => {
    const phone = (project.customer.phone || '').replace(/\D/g, '');
    const text = encodeURIComponent(`${docLabel} for ${project.name}: ${formatCurrency(variation.pricing.total)} incl GST. Please review. — ${company.name}`);
    window.open(`sms:${phone}?body=${text}`, '_blank');
  };

  const handleSendAndMark = (sendFn: () => void) => {
    sendFn();
    onMarkSent();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send {docLabel}</h2>
            <p className="text-sm text-slate-500 mt-1">To: {project.customer.name} ({project.customer.email})</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Message Preview</p>
            <div className="max-h-52 overflow-y-auto rounded-lg bg-slate-50 p-4">
              <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-6 text-slate-700">{bodyText}</pre>
            </div>
          </div>

          {/* 5-channel send */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleSendAndMark(handleGmail)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <Mail className="h-4 w-4" /> Gmail
            </button>
            <button onClick={() => handleSendAndMark(handleMailApp)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <Mail className="h-4 w-4" /> Mail App
            </button>
            <button onClick={handleCopy} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50">
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button onClick={() => handleSendAndMark(handleWhatsApp)} disabled={!project.customer.phone} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
              <MessageSquare className="h-4 w-4" /> WhatsApp
            </button>
          </div>

          <button onClick={() => handleSendAndMark(handleSMS)} disabled={!project.customer.phone} className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
            <Send className="h-4 w-4" /> SMS
          </button>
        </div>

        <div className="border-t border-slate-200 p-6 pt-4">
          <button onClick={onClose} className="w-full rounded-lg bg-slate-100 hover:bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}