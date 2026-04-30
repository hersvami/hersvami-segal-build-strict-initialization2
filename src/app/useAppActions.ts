import { useCallback, useState } from 'react';
import { getCompanyById } from '../constants/companies';
import { createProject, createVariation, deleteProject, hasApprovedQuote, selectProject, updateVariation } from '../logic/state';
import type { AppState } from '../types/appState';
import type { ExternalQuoteReference, Project, Variation } from '../types/domain';
import { downloadProjectExport, generateId } from '../utils/helpers';
import { calculateQuote } from '../utils/pricing/quoteCalculator';

export type AppActions = ReturnType<typeof useAppActions>;

export function useAppActions(state: AppState, setState: (fn: (state: AppState) => AppState) => void) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [showExternalBaselineModal, setShowExternalBaselineModal] = useState(false);
  const [builderDocType, setBuilderDocType] = useState<'quote' | 'variation'>('quote');

  const activeProject = state.projects.find((project) => project.id === state.activeProjectId);
  const activeCompany = getCompanyById(state.activeCompanyId);
  const variations = state.activeProjectId ? (state.variations[state.activeProjectId] || []) : [];

  const handleNewProject = useCallback(() => {
    setState((prev) => ({ ...prev, uiState: { ...prev.uiState, showProjectForm: true } }));
  }, [setState]);

  const handleCreateProject = useCallback((data: { name: string; address: string; customerName: string; customerEmail: string; customerPhone: string; heroPhoto?: string }) => {
    const project: Project = {
      id: generateId(),
      name: data.name,
      address: data.address,
      customer: { name: data.customerName, email: data.customerEmail, phone: data.customerPhone },
      companyId: state.activeCompanyId,
      createdAt: new Date().toISOString(),
      heroPhoto: data.heroPhoto,
    };
    setState((prev) => createProject(prev, project));
  }, [setState, state.activeCompanyId]);

  const handleSelectProject = useCallback((id: string) => setState((prev) => selectProject(prev, id)), [setState]);

  const handleDeleteProject = useCallback((id: string) => {
    if (!confirm('Delete this project and all its data? This cannot be undone.')) return;
    setState((prev) => deleteProject(prev, id));
  }, [setState]);

  const handleExportProject = useCallback((id: string) => {
    const project = state.projects.find((item) => item.id === id);
    if (!project) return;
    downloadProjectExport({
      projectName: project.name,
      address: project.address,
      customer: project.customer,
      variations: state.variations[id] || [],
      exportedAt: new Date().toISOString(),
    });
  }, [state.projects, state.variations]);

  const handleSaveVariation = useCallback((variation: Variation) => {
    if (!state.activeProjectId) return;
    setState((prev) => createVariation(prev, state.activeProjectId!, variation));
    setShowBuilder(false);
  }, [setState, state.activeProjectId]);

  const handleUpdateVariation = useCallback((variation: Variation) => {
    if (!state.activeProjectId) return;
    setState((prev) => updateVariation(prev, state.activeProjectId!, variation));
  }, [setState, state.activeProjectId]);

  const handleNewQuote = useCallback(() => {
    setBuilderDocType('quote');
    setShowBuilder(true);
  }, []);

  const handleNewVariation = useCallback(() => {
    if (!activeProject) return;
    if (!hasApprovedQuote(state, activeProject.id)) {
      setShowExternalBaselineModal(true);
      return;
    }
    setBuilderDocType('variation');
    setShowBuilder(true);
  }, [activeProject, state]);

  const closeProjectForm = () => setState((prev) => ({ ...prev, uiState: { ...prev.uiState, showProjectForm: false } }));
  const closeWelcomeEmail = () => setState((prev) => ({ ...prev, uiState: { ...prev.uiState, showWelcomeEmail: false } }));

  return {
    activeProject,
    activeCompany,
    variations,
    showBuilder,
    setShowBuilder,
    showExternalBaselineModal,
    setShowExternalBaselineModal,
    builderDocType,
    handleNewProject,
    handleCreateProject,
    handleSelectProject,
    handleDeleteProject,
    handleExportProject,
    handleSaveVariation,
    handleUpdateVariation,
    handleNewQuote,
    handleNewVariation,
    closeProjectForm,
    closeWelcomeEmail,
    handleSaveExternalBaseline: createExternalBaselineHandler({ state, activeProject, activeCompany, setState, setShowExternalBaselineModal, setBuilderDocType, setShowBuilder }),
    handleBackToWelcome: () => setState((prev) => ({ ...prev, uiState: { ...prev.uiState, view: 'welcome', showProjectForm: false, showWelcomeEmail: false }, activeProjectId: null })),
    handleSwitchCompany: (id: string) => setState((prev) => ({ ...prev, activeCompanyId: id })),
  };
}

function createExternalBaselineHandler(args: {
  state: AppState;
  activeProject: Project | undefined;
  activeCompany: ReturnType<typeof getCompanyById>;
  setState: (fn: (state: AppState) => AppState) => void;
  setShowExternalBaselineModal: (value: boolean) => void;
  setBuilderDocType: (value: 'quote' | 'variation') => void;
  setShowBuilder: (value: boolean) => void;
}) {
  return (payload: ExternalQuoteReference) => {
    if (!args.state.activeProjectId || !args.activeProject) return;
    const now = new Date().toISOString();
    const baseline: Variation = {
      id: generateId(),
      title: `External Quote Baseline - ${payload.referenceNumber}`,
      description: payload.summaryScope,
      status: 'approved',
      documentType: 'quote',
      source: 'external',
      externalQuoteRef: payload,
      scopes: [],
      pricing: calculateQuote(payload.originalApprovedAmount, args.activeCompany.defaultOverheadPercent, args.activeCompany.defaultProfitPercent, 0),
      changeLog: [{ id: generateId(), action: 'external-baseline-linked', timestamp: now, user: 'Builder', details: `Linked external quote ${payload.referenceNumber}` }],
      createdAt: now,
      updatedAt: now,
      internalNotes: payload.notes ? [payload.notes] : [],
    };
    args.setState((prev) => createVariation(prev, args.state.activeProjectId!, baseline));
    args.setShowExternalBaselineModal(false);
    args.setBuilderDocType('variation');
    args.setShowBuilder(true);
  };
}