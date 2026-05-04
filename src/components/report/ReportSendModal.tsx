import { useState } from 'react';
import { X, Mail, Copy, MessageSquare, Send, Check } from 'lucide-react';
import type { Company, Project, Variation } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { calcScopeTotal } from '../../utils/pricing/engine';
import { buildEmailSignature } from '../../utils/company/signature';

type Props = { project: Project; variation: Variation; company: Company; onClose: () => void; onMarkSent: () => void };

export function ReportSendModal({ project, variation, company, onClose, onMarkSent }: Props) {
  const [copied, setCopied] = useState(false);
  const docLabel = variation.documentType === 'quote' ? 'Quote' : 'Variation';
  const subject = `${docLabel} — ${project.name} — ${company.name}`;
  const scopeLines = variation.scopes.flatMap((scope, scopeIndex) => {
    const lines = [
      `${scopeIndex + 1}. ${scope.categoryLabel} — ${formatCurrency(calcScopeTotal(scope))}`,
    ];

    if (scope.description) lines.push(`   Scope: ${scope.description.replace(/\s+/g, ' ').trim()}`);

    if (scope.stages.length > 0) {
      lines.push('   Stages:');
      lines.push(...scope.stages.map((stage) => `   - ${stage.name} (${stage.trade}): ${stage.description || 'Works as described'} — ${formatCurrency(stage.cost)}`));
    }

    if ((scope.parametricItems || []).length > 0) {
      lines.push('   BoQ items:');
      lines.push(...(scope.parametricItems || []).map((item) => `   - ${item.label}: ${item.quantity} ${item.unit} x ${formatCurrency(item.rate)} — ${formatCurrency(item.quantity * item.rate)}`));
    }

    if (scope.inclusions.length > 0) {
      lines.push('   Included:');
      lines.push(...scope.inclusions.slice(0, 8).map((item) => `   - ${item.text}`));
    }

    if (scope.exclusions.length > 0) {
      lines.push('   Excluded:');
      lines.push(...scope.exclusions.slice(0, 8).map((item) => `   - ${item.text}`));
    }

    lines.push('');
    return lines;
  });

  const bodyLines = [
    `Dear ${project.customer.name},`, '',
    `Please find your ${docLabel.toLowerCase()} for ${project.name}.`, '',
    `Project address: ${project.address}`, '',
    'QUOTE SUMMARY',
    `Direct construction cost: ${formatCurrency(variation.pricing.tradeCost)}`,
    `Builder overhead (${variation.pricing.overheadPercent}%): ${formatCurrency(variation.pricing.overheadAmount)}`,
    `Builder margin (${variation.pricing.profitPercent}%): ${formatCurrency(variation.pricing.profitAmount)}`,
    `Contingency (${variation.pricing.contingencyPercent}%): ${formatCurrency(variation.pricing.contingencyAmount)}`,
    `GST: ${formatCurrency(variation.pricing.gstAmount)}`,
    `Total payable (incl. GST): ${formatCurrency(variation.pricing.total)}`, '',
    'SCOPE OF WORKS',
    ...scopeLines,
    'Please review the above scope, inclusions, exclusions and total carefully. Let us know if you would like any changes before approval.', '',
    ...buildEmailSignature(company),
  ];
  const bodyText = bodyLines.join('\n');
  const handleCopy = async () => { await navigator.clipboard.writeText(bodyText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleGmail = () => { window.open(`https://mail.google.com/mail/?view=cm&to=${project.customer.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`, '_blank'); };
  const handleMailApp = () => { window.location.href = `mailto:${project.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`; };
  const handleWhatsApp = () => { const phone = (project.customer.phone || '').replace(/\D/g, ''); window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`${subject}\n\n${bodyText}`)}`, '_blank'); };
  const handleSMS = () => { const phone = (project.customer.phone || '').replace(/\D/g, ''); window.open(`sms:${phone}?body=${encodeURIComponent(`${docLabel} for ${project.name}: ${formatCurrency(variation.pricing.total)} incl GST. Please review. — ${company.name}`)}`, '_blank'); };
  const handleSendAndMark = (sendFn: () => void) => { sendFn(); onMarkSent(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div><h2 className="text-xl font-bold text-slate-900">Send {docLabel}</h2><p className="text-sm text-slate-500 mt-1">To: {project.customer.name} ({project.customer.email})</p></div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Message Preview</p>
            <div className="max-h-52 overflow-y-auto rounded-lg bg-slate-50 p-4"><pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-6 text-slate-700">{bodyText}</pre></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleSendAndMark(handleGmail)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50"><Mail className="h-4 w-4" /> Gmail</button>
            <button onClick={() => handleSendAndMark(handleMailApp)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50"><Mail className="h-4 w-4" /> Mail App</button>
            <button onClick={handleCopy} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50">{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied!' : 'Copy Text'}</button>
            <button onClick={() => handleSendAndMark(handleWhatsApp)} disabled={!project.customer.phone} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"><MessageSquare className="h-4 w-4" /> WhatsApp</button>
          </div>
          <button onClick={() => handleSendAndMark(handleSMS)} disabled={!project.customer.phone} className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"><Send className="h-4 w-4" /> SMS</button>
        </div>
        <div className="border-t border-slate-200 p-6 pt-4"><button onClick={onClose} className="w-full rounded-lg bg-slate-100 hover:bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700">Close</button></div>
      </div>
    </div>
  );
}
