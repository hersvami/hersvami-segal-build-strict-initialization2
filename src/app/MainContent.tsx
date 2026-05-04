import { ProjectChat } from '../components/ProjectChat';
import { VariationReport } from '../components/report/VariationReport';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { hasApprovedQuote } from '../logic/state';
import type { AppState } from '../types/appState';
import type { AppActions } from './useAppActions';

type Props = { state: AppState; app: AppActions };

export function MainContent({ state, app }: Props) {
  const { activeProject, activeCompany, variations } = app;

  return (
    <div className="flex-1 overflow-y-auto">
      {!activeProject && state.uiState.view === 'welcome' && <WelcomeScreen company={activeCompany} onNewProject={app.handleNewProject} />}
      {activeProject && (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <ProjectHeader state={state} app={app} />
          {variations.length > 0 ? <Documents app={app} /> : <EmptyDocuments onNewQuote={app.handleNewQuote} />}
          <ProjectChat project={activeProject} />
        </div>
      )}
    </div>
  );
}

function ProjectHeader({ state, app }: Props) {
  const project = app.activeProject!;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {project.heroPhoto && <Hero project={project} count={app.variations.length} />}
      <div className={`p-6 ${project.heroPhoto ? 'pt-4' : ''}`}>
        <div className="flex items-start justify-between">
          <div>
            {!project.heroPhoto && <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>}
            {!project.heroPhoto && <p className="text-sm text-slate-500 mt-1">{project.address}</p>}
            <p className="text-sm text-slate-500">Customer: {project.customer.name} ({project.customer.email}){project.customer.phone && ` | ${project.customer.phone}`}</p>
          </div>
          <div className="text-right">
            {!project.heroPhoto && <div className="text-sm text-slate-500">{app.variations.length} document(s)</div>}
            {hasApprovedQuote(state, project.id) && <span className="inline-block mt-1 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">Quote Approved</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ project, count }: { project: AppActions['activeProject']; count: number }) {
  if (!project?.heroPhoto) return null;
  return (
    <div className="relative h-48 w-full">
      <img src={project.heroPhoto} alt={project.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-6 right-6">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">{project.name}</h1>
        <p className="text-sm text-white/80 mt-1">{project.address}</p>
      </div>
      <div className="absolute top-4 right-6"><div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700">{count} document(s)</div></div>
    </div>
  );
}

function Documents({ app }: { app: AppActions }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Documents</h2>
      {app.variations.map((variation) => (
        <VariationReport key={variation.id} variation={variation} project={app.activeProject!} company={app.activeCompany} onUpdate={app.handleUpdateVariation} />
      ))}
    </div>
  );
}

function EmptyDocuments({ onNewQuote }: { onNewQuote: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
      <div className="text-6xl mb-4">📋</div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">No documents yet</h2>
      <p className="text-slate-500 mb-4">Create your first quote to get started, then issue variations as needed.</p>
      <button onClick={onNewQuote} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Create First Quote</button>
    </div>
  );
}
