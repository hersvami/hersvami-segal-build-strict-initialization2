import { ExternalQuoteModal } from '../components/ExternalQuoteModal';
import { ProjectForm } from '../components/ProjectForm';
import { SendWelcomeEmailModal } from '../components/SendWelcomeEmailModal';
import { Sidebar } from '../components/Sidebar';
import { VariationBuilder } from '../components/VariationBuilder';
import type { AppState } from '../types/appState';
import type { AppActions } from './useAppActions';
import { MainContent } from './MainContent';

type Props = { state: AppState; app: AppActions };

export function AppLayout({ state, app }: Props) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        state={state} 
        onSelectProject={app.handleSelectProject}
        onNewProject={app.handleNewProject}
        onDeleteProject={app.handleDeleteProject}
        onExportProject={app.handleExportProject}
        onSwitchCompany={app.handleSwitchCompany}
        onNewQuote={app.handleNewQuote}
        onNewVariation={app.handleNewVariation}
        onBackToWelcome={app.handleBackToWelcome}
      />
      <MainContent state={state} app={app} />

      {state.uiState.showProjectForm ? (
        <ProjectForm
          onSubmit={app.handleCreateProject}
          onClose={app.closeProjectForm}
        />
      ) : null}

      {state.uiState.showWelcomeEmail && app.activeProject && (
        <SendWelcomeEmailModal
          projectName={app.activeProject.name}
          customerName={app.activeProject.customer.name}
          customerEmail={app.activeProject.customer.email}
          customerPhone={app.activeProject.customer.phone}
          company={app.activeCompany}
          onClose={app.closeWelcomeEmail}
        />
      )}

      {app.showBuilder && app.activeProject && (
        <VariationBuilder
          project={app.activeProject}
          company={app.activeCompany}
          documentType={app.builderDocType}
          initialVariation={app.editingVariation || undefined}
          onSave={app.handleSaveVariation}
          onClose={() => app.setShowBuilder(false)}
        />
      )}

      {app.showExternalBaselineModal && (
        <ExternalQuoteModal
          onCancel={() => app.setShowExternalBaselineModal(false)}
          onSubmit={app.handleSaveExternalBaseline}
        />
      )}
    </div>
  );
}
