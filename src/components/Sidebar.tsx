import { Building2, Plus, Trash2, Download, ChevronRight, FileText } from 'lucide-react';
import { cn } from '../utils/helpers';
import type { AppState } from '../types/appState';
import type { AppActions } from '../app/useAppActions';

type Props = { state: AppState; app: AppActions };

export function Sidebar({ state, app }: Props) {
  const projects = state.projects;
  const activeProject = projects.find(p => p.id === state.activeProjectId);
  const activeCompany = state.companies.find(c => c.id === state.activeCompanyId) || state.companies[0];
  const variations = state.activeProjectId ? (state.variations[state.activeProjectId] || []) : [];
  const hasApproved = variations.some(v => v.documentType === 'quote' && v.status === 'approved');

  return (
    <div className="w-72 bg-slate-900 text-white flex flex-col h-screen shrink-0">
      <div className="p-4 border-b border-slate-700">
        <button onClick={app.handleBackToWelcome} className="flex items-center gap-2 text-lg font-bold hover:text-blue-400 transition-colors">
          {activeCompany?.logoUrl ? (
            <img src={activeCompany.logoUrl} alt={activeCompany.name} className="h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (<Building2 className="w-6 h-6" />)}
          <span>{activeCompany?.name || 'Segal Build'}</span>
        </button>
        <div className="mt-2 flex gap-1">
          {state.companies.map(c => (
            <button key={c.id} onClick={() => app.handleSwitchCompany(c.id)}
              className={cn('px-2 py-1 text-xs rounded transition-colors', state.activeCompanyId === c.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600')}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-b border-slate-700">
        <button onClick={app.handleNewProject} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Projects ({projects.length})</h3>
        {projects.length === 0 && <p className="text-slate-500 text-sm">No projects yet</p>}
        {projects.map(p => (
          <div key={p.id} onClick={() => app.handleSelectProject(p.id)}
            className={cn('flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 transition-colors text-sm',
              state.activeProjectId === p.id ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-slate-800 text-slate-300')}>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="truncate flex-1">{p.name}</span>
            <button onClick={e => { e.stopPropagation(); app.handleExportProject(p.id); }} className="p-1 hover:text-white" title="Export"><Download className="w-3 h-3" /></button>
            <button onClick={e => { e.stopPropagation(); app.handleDeleteProject(p.id); }} className="p-1 hover:text-red-400" title="Delete"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
      {activeProject && (
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button onClick={app.handleNewQuote} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            <FileText className="w-4 h-4" /> New Quote
          </button>
          <button onClick={app.handleNewVariation} className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            <FileText className="w-4 h-4" /> {hasApproved ? 'New Variation' : 'New Variation (Link Quote)'}
          </button>
          {variations.length > 0 && (
            <div className="mt-2">
              <h3 className="text-xs uppercase text-slate-500 font-semibold mb-1">Documents</h3>
              {variations.map(v => (
                <button key={v.id} onClick={() => app.handleSelectProject(activeProject.id)}
                  className={cn('w-full text-left px-2 py-1 rounded text-xs mb-1',
                    v.status === 'approved' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-400')}>
                  <span className="font-mono mr-1">{v.documentType === 'quote' ? 'QTE' : 'VAR'}</span>{v.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
