import { useState } from 'react';
import { X, Copy, Mail, MessageSquare, Send } from 'lucide-react';
import type { Company } from '../types/domain';
import { buildWelcomeMessage, type MessageType } from './welcomeMessages';

type Props = {
  projectName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company: Company;
  onClose: () => void;
};

export function SendWelcomeEmailModal({ projectName, customerName, customerEmail, customerPhone, company, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [tempPassword] = useState(() => generateTempPassword());
  const portalUrl = `${window.location.origin}/portal`;

  const handleSkip = () => {
    setSkipped(true);
    setTimeout(() => onClose(), 300);
  };

  const getMessage = (type: MessageType) => buildWelcomeMessage({
    customerName,
    customerEmail,
    projectName,
    companyName: company.name,
    companyAbn: company.abn,
    companyLicence: company.licence,
    companyEmail: company.email,
    companyPhone: company.phone,
    portalUrl,
    tempPassword,
    type,
  });

  const emailPreview = getMessage('copy');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getMessage('copy'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGmail = () => {
    const text = getMessage('gmail');
    const subject = encodeURIComponent(`Welcome to ${company.name} — Your Project Portal`);
    window.open(`https://mail.google.com/mail/?view=cm&to=${customerEmail}&su=${subject}&body=${encodeURIComponent(text)}`, '_blank');
  };

  const handleMailApp = () => {
    const text = getMessage('mail');
    const subject = encodeURIComponent(`Welcome to ${company.name} — Your Project Portal`);
    window.location.href = `mailto:${customerEmail}?subject=${subject}&body=${encodeURIComponent(text)}`;
  };

  const handleWhatsApp = () => {
    const text = getMessage('whatsapp');
    const phone = (customerPhone || '').replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSMS = () => {
    const text = getMessage('sms');
    const phone = (customerPhone || '').replace(/\D/g, '');
    window.open(`sms:${phone}?body=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">Send Welcome Message</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold">Customer Portal Access Included</p>
            <p className="mt-1 text-blue-800">
              Your customer will receive their login details and can view & download their quotation,
              approve documents, and track project progress online.
            </p>
            <p className="mt-2 font-medium text-blue-700">Temp password: {tempPassword}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Email Preview</p>
            <div className="max-h-80 overflow-y-auto rounded-lg bg-slate-50 p-4">
              <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-6 text-slate-700">
                {emailPreview}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleGmail} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <Mail className="h-4 w-4" /> Gmail
            </button>
            <button onClick={handleMailApp} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <Mail className="h-4 w-4" /> Mail App
            </button>
            <button onClick={handleCopy} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50">
              <Copy className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button onClick={handleWhatsApp} disabled={!customerPhone} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
              <MessageSquare className="h-4 w-4" /> WhatsApp
            </button>
          </div>

          <button onClick={handleSMS} disabled={!customerPhone} className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
            <Send className="h-4 w-4" /> SMS
          </button>

          {skipped && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-700">
              ✓ Skipped — you can send this later from the project dashboard
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-6 pt-4">
          <button onClick={handleSkip} className="w-full rounded-lg bg-slate-100 hover:bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors">
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 7; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return `SB-${result}`;
}
