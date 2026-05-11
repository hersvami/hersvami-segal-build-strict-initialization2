import { useState } from 'react';
import { ExternalQuoteModal } from '../components/ExternalQuoteModal';
import { ProjectForm } from '../components/ProjectForm';
import { SendWelcomeEmailModal } from '../components/SendWelcomeEmailModal';
import { Sidebar } from '../components/Sidebar';
import { VariationBuilder } from '../components/VariationBuilder';
import { BunningsSettingsModal } from '../components/BunningsSettingsModal';
import type { AppState } from '../types/appState';
import type { AppActions } from './useAppActions';
import { MainContent } from './MainContent';

type Props = { state: AppState; app: AppActions };

export function AppLayout({ state, app }: Props) {
  const [showBunningsSettings, setShowBunningsSettings] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar state={state} app={app} onOpenSettings={() => setShowBunningsSettings(true)} />
      <MainContent state={state} app={app} />

      {state.uiState.showProjectForm && (
        <ProjectForm
          onClose={app.closeProjectForm}
          onSubmit={app.handleCreateProject}
        />
      )}

      {state.uiState.showWelcomeEmail && app.activeProject && (
        <SendWelcomeEmailModal
          project={app.activeProject}
          company={app.activeCompany}
          onClose={app.closeWelcomeEmail}
        />
      )}

      {app.showBuilder && app.activeProject && (
        <VariationBuilder
          project={app.activeProject}
          company={app.activeCompany}
          documentType={app.builderDocType}
          approvedQuotes={app.variations.filter(v => v.documentType === 'quote' && v.status === 'approved')}
          onSave={app.handleSaveVariation}
          onClose={() => app.setShowBuilder(false)}
        />
      )}

      {app.showExternalBaselineModal && (
        <ExternalQuoteModal
          onClose={() => app.setShowExternalBaselineModal(false)}
          onSubmit={app.handleSaveExternalBaseline}
        />
      )}

      <BunningsSettingsModal 
        isOpen={showBunningsSettings} 
        onClose={() => setShowBunningsSettings(false)} 
      />
    </div>
  );
}