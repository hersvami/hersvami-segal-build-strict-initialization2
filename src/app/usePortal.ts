import { useState, useCallback } from 'react';
import type { AppState } from '../types/appState';
import type { Variation, Project, Signature } from '../types/domain';

export type CustomerPortalSession = {
  email: string;
  customerName: string;
  projectId: string;
  loggedInAt: string;
};

export type PortalView = 'login' | 'dashboard' | 'quote' | 'success';

export type PortalState = {
  view: PortalView;
  session: CustomerPortalSession | null;
  selectedVariation: Variation | null;
  selectedProject: Project | null;
};

export function usePortal(state: AppState) {
  const [portalState, setPortalState] = useState<PortalState>({
    view: 'login',
    session: null,
    selectedVariation: null,
    selectedProject: null,
  });

  const handleLogin = useCallback((email: string, _password: string): boolean => {
    // Search all projects for a matching customer email
    for (const project of state.projects) {
      if (project.customer.email.toLowerCase() === email.toLowerCase()) {
        const variations = state.variations[project.id] || [];
        if (variations.length > 0) {
          // Accept any password for now (in production, validate against stored temp password)
          const session: CustomerPortalSession = {
            email: project.customer.email,
            customerName: project.customer.name,
            projectId: project.id,
            loggedInAt: new Date().toISOString(),
          };
          setPortalState({
            view: 'dashboard',
            session,
            selectedVariation: null,
            selectedProject: project,
          });
          return true;
        }
      }
    }
    return false;
  }, [state.projects, state.variations]);

  const handleViewQuote = useCallback((variation: Variation, project: Project) => {
    setPortalState((prev) => ({
      ...prev,
      view: 'quote',
      selectedVariation: variation,
      selectedProject: project,
    }));
  }, []);

  const handleApprove = useCallback((signature: Signature) => {
    if (!portalState.selectedVariation || !portalState.session) return;
    const now = new Date().toISOString();
    const updated: Variation = {
      ...portalState.selectedVariation,
      status: 'approved',
      signature,
      updatedAt: now,
      changeLog: [
        ...portalState.selectedVariation.changeLog,
        {
          id: `sig-${Date.now()}`,
          action: 'approved-by-customer',
          timestamp: now,
          user: portalState.session.customerName,
          details: `Approved digitally by ${portalState.session.customerName}`,
        },
      ],
    };

    // Update state via localStorage
    try {
      const raw = localStorage.getItem('segal-build-v2.0') || localStorage.getItem('segal-build-latest');
      if (raw) {
        const appState: AppState = JSON.parse(raw);
        const vars = appState.variations[portalState.session.projectId] || [];
        appState.variations[portalState.session.projectId] = vars.map((v) =>
          v.id === updated.id ? updated : v,
        );
        localStorage.setItem('segal-build-v2.0', JSON.stringify(appState));
        localStorage.setItem('segal-build-latest', JSON.stringify(appState));
      }
    } catch {
      /* ignore */
    }

    setPortalState((prev) => ({ ...prev, view: 'success', selectedVariation: updated }));
  }, [portalState.selectedVariation, portalState.session]);

  const handleReject = useCallback((reason: string) => {
    if (!portalState.selectedVariation || !portalState.session) return;
    const now = new Date().toISOString();
    const updated: Variation = {
      ...portalState.selectedVariation,
      status: 'rejected',
      updatedAt: now,
      changeLog: [
        ...portalState.selectedVariation.changeLog,
        {
          id: `rej-${Date.now()}`,
          action: 'rejected-by-customer',
          timestamp: now,
          user: portalState.session.customerName,
          details: `Rejected by ${portalState.session.customerName}: ${reason}`,
        },
      ],
    };

    try {
      const raw = localStorage.getItem('segal-build-v2.0') || localStorage.getItem('segal-build-latest');
      if (raw) {
        const appState: AppState = JSON.parse(raw);
        const vars = appState.variations[portalState.session.projectId] || [];
        appState.variations[portalState.session.projectId] = vars.map((v) =>
          v.id === updated.id ? updated : v,
        );
        localStorage.setItem('segal-build-v2.0', JSON.stringify(appState));
        localStorage.setItem('segal-build-latest', JSON.stringify(appState));
      }
    } catch {
      /* ignore */
    }

    setPortalState((prev) => ({ ...prev, view: 'success', selectedVariation: updated }));
  }, [portalState.selectedVariation, portalState.session]);

  const handleBack = useCallback(() => {
    setPortalState((prev) => ({
      ...prev,
      view: prev.view === 'quote' ? 'dashboard' : 'login',
      selectedVariation: null,
    }));
  }, []);

  return {
    portalState,
    handleLogin,
    handleViewQuote,
    handleApprove,
    handleReject,
    handleBack,
  };
}
