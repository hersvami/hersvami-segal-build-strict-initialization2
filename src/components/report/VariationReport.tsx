import type { Project, Variation, Company } from '../../types/domain';
import { formatCurrency, generateId } from '../../utils/helpers';
import { useState } from 'react';
import { Send, Download, Pencil } from 'lucide-react';
import { generateQuotePDF } from '../../utils/pdfGenerator';
import { VariationBuilder } from '../VariationBuilder';
import { BuilderView } from './BuilderView';
import { CustomerView } from './CustomerView';
import { ProgressHub } from './ProgressHub';
import { ReportSendModal } from './ReportSendModal';

type Props = { variation: Variation; project: Project; company: Company; onUpdate: (variation: Variation) => void };

export function VariationReport({ variation, project, company, onUpdate }: Props) {
  const [tab, setTab] = useState<'builder' | 'customer' | 'progress'>('builder');
  const [showSendModal, setShowSendModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleDownloadPDF = () => {
    setPdfError('');
    setPdfUrl('');

    try {
      const doc = generateQuotePDF(variation, project, company);
      const filename = `${variation.documentType === 'quote' ? 'Quote' : 'Variation'}-${project.name.replace(/\s+/g, '-')}.pdf`;
      void doc.save(filename, { returnPromise: true });
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('PDF generation failed', error);
      setPdfError('PDF could not be generated. Please check scope pricing and try again.');
    }
  };
  const handleMarkSent = () => {
    if (variation.status === 'draft') {
      const now = new Date().toISOString();
      onUpdate({ ...variation, status: 'sent', updatedAt: now, changeLog: [...variation.changeLog, { id: generateId(), action: 'sent', timestamp: now, user: 'Builder', details: `${variation.documentType === 'quote' ? 'Quote' : 'Variation'} sent to ${project.customer.name}` }] });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2"><span className="font-mono text-xs text-slate-500">{variation.documentType === 'quote' ? 'QTE' : 'VAR'}</span><h3 className="font-semibold text-slate-900">{variation.title}</h3></div>
          <p className="text-xs text-slate-400 mt-1">Created: {new Date(variation.createdAt).toLocaleDateString('en-AU')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"><Pencil className="h-3.5 w-3.5" /> Edit</button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"><Download className="h-3.5 w-3.5" /> PDF</button>
          <button onClick={() => setShowSendModal(true)} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"><Send className="h-3.5 w-3.5" /> Send</button>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${variation.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : variation.status === 'rejected' ? 'bg-red-100 text-red-700' : variation.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{variation.status}</span>
          <span className="text-sm font-bold text-slate-900">{formatCurrency(variation.pricing.total)}</span>
        </div>
      </div>
      {variation.description && (<div className="px-4 py-3 text-sm text-slate-600 bg-slate-50"><p className="whitespace-pre-line">{variation.description}</p></div>)}
      {pdfError && <div className="px-4 py-2 text-sm text-red-700 bg-red-50 border-b border-red-100">{pdfError}</div>}
      {pdfUrl && <div className="px-4 py-2 text-sm text-emerald-700 bg-emerald-50 border-b border-emerald-100">PDF prepared. If it did not download, <a href={pdfUrl} target="_blank" rel="noreferrer" className="font-semibold underline">open it here</a>.</div>}
      <div className="border-b border-slate-100 px-4 py-2">
        <div className="flex gap-2 text-sm">
          <button onClick={() => setTab('builder')} className={tab === 'builder' ? 'font-semibold text-blue-700' : 'text-slate-500'}>Builder</button>
          <button onClick={() => setTab('customer')} className={tab === 'customer' ? 'font-semibold text-blue-700' : 'text-slate-500'}>Customer</button>
          <button onClick={() => setTab('progress')} className={tab === 'progress' ? 'font-semibold text-blue-700' : 'text-slate-500'}>Progress</button>
        </div>
      </div>
      {tab === 'builder' && <BuilderView variation={variation} project={project} company={company} onUpdate={onUpdate} />}
      {tab === 'customer' && <CustomerView variation={variation} project={project} company={company} />}
      {tab === 'progress' && <ProgressHub variation={variation} onUpdate={onUpdate} />}
      {editing && (
        <VariationBuilder
          project={project}
          company={company}
          documentType={variation.documentType}
          approvedQuotes={variation.documentType === 'quote' && variation.status === 'approved' ? [variation] : []}
          initialVariation={variation}
          onSave={(next) => { onUpdate(next); setEditing(false); }}
          onClose={() => setEditing(false)}
        />
      )}
      {showSendModal && <ReportSendModal project={project} variation={variation} company={company} onClose={() => setShowSendModal(false)} onMarkSent={handleMarkSent} />}
    </div>
  );
}
