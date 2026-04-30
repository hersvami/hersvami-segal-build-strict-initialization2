import { Building2, FileText, Shield, TrendingUp, Zap, Camera } from 'lucide-react';
import type { Company } from '../types/domain';
import { SystemValidationPanel } from './SystemValidationPanel';

type Props = {
  company: Company;
  onNewProject: () => void;
};

export function WelcomeScreen({ company, onNewProject }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-20 mx-auto mb-4 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const fallback = (e.target as HTMLImageElement).nextElementSibling;
                if (fallback) (fallback as HTMLElement).style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 ${company.logoUrl ? 'hidden' : ''}`}
          >
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{company.name}</h1>
          <p className="text-lg text-slate-500">Professional Construction Quoting & Variation Management</p>
          <div className="mt-2 text-sm text-slate-400">
            ABN: {company.abn} | {company.phone}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <button
            onClick={onNewProject}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            Create New Project
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: FileText, title: 'AI-Assisted Quotes', desc: 'Multi-scope quotes with 43 trade categories and Rawlinsons pricing' },
            { icon: Zap, title: 'Scope Recognition', desc: 'AI-powered category detection from natural builder descriptions' },
            { icon: TrendingUp, title: 'Smart Pricing', desc: 'OH + Profit + Contingency + GST pipeline with full transparency' },
            { icon: Shield, title: 'Variation Management', desc: 'Track changes with full audit trail and customer approval workflow' },
            { icon: Building2, title: 'Multi-Company', desc: 'Switch between companies with separate pricing defaults' },
            { icon: Camera, title: 'Progress Hub', desc: 'Photo tracking, stage progress, and customer communication tools' },
          ].map((f, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <f.icon className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-slate-400">
          <p>43 Trade Categories • Australian Construction Pricing • AI-Powered</p>
        </div>

        <SystemValidationPanel />
      </div>
    </div>
  );
}
