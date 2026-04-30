/* ─── Segal Build — Persisted App State ─── */
import { useState, useEffect, useCallback } from 'react';
import type { AppState } from '../types/appState';
import type { Project, Variation } from '../types/domain';
import { COMPANIES } from '../constants/companies';

const APP_VERSION = '2.0';
const STORAGE_KEY = 'segal-build-v2.0';

function createInitialState(): AppState {
  return {
    version: APP_VERSION,
    activeCompanyId: 'segal-build',
    companies: COMPANIES,
    projects: [],
    activeProjectId: null,
    variations: {},
    activeVariationId: null,
    uiState: {
      view: 'welcome',
      showProjectForm: false,
      showWelcomeEmail: false,
    },
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== APP_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return createInitialState();
    }
    return { ...createInitialState(), ...parsed };
  } catch {
    return createInitialState();
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full */
  }
}

export function usePersistedAppState() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState(prev => fn(prev));
  }, []);

  return { state, setState: update };
}

/* ─── Project Workspace Helpers ─── */
export function createProject(
  state: AppState,
  project: Project,
): AppState {
  return {
    ...state,
    projects: [...state.projects, project],
    activeProjectId: project.id,
    variations: { ...state.variations, [project.id]: [] },
    uiState: {
      ...state.uiState,
      view: 'project',
      showProjectForm: false,
      showWelcomeEmail: true,
    },
  };
}

export function selectProject(state: AppState, projectId: string): AppState {
  return {
    ...state,
    activeProjectId: projectId,
    uiState: { ...state.uiState, view: 'project' },
  };
}

export function deleteProject(state: AppState, projectId: string): AppState {
  const newVariations = { ...state.variations };
  delete newVariations[projectId];
  const newProjects = state.projects.filter(p => p.id !== projectId);
  return {
    ...state,
    projects: newProjects,
    variations: newVariations,
    activeProjectId: newProjects[0]?.id || null,
    uiState: {
      ...state.uiState,
      view: newProjects.length ? 'project' : 'welcome',
    },
  };
}

export function createVariation(
  state: AppState,
  projectId: string,
  variation: Variation,
): AppState {
  const existing = state.variations[projectId] || [];
  return {
    ...state,
    variations: {
      ...state.variations,
      [projectId]: [...existing, variation],
    },
    activeVariationId: variation.id,
    uiState: { ...state.uiState, view: 'report' },
  };
}

export function updateVariation(
  state: AppState,
  projectId: string,
  variation: Variation,
): AppState {
  const existing = state.variations[projectId] || [];
  return {
    ...state,
    variations: {
      ...state.variations,
      [projectId]: existing.map(v =>
        v.id === variation.id ? variation : v,
      ),
    },
  };
}

export function selectVariation(
  state: AppState,
  variationId: string,
): AppState {
  return {
    ...state,
    activeVariationId: variationId,
    uiState: { ...state.uiState, view: 'report' },
  };
}

export function setVariationStatus(
  state: AppState,
  projectId: string,
  variationId: string,
  status: Variation['status'],
): AppState {
  const existing = state.variations[projectId] || [];
  return {
    ...state,
    variations: {
      ...state.variations,
      [projectId]: existing.map(v =>
        v.id === variationId ? { ...v, status } : v,
      ),
    },
  };
}

export function hasApprovedQuote(
  state: AppState,
  projectId: string,
): boolean {
  const variations = state.variations[projectId] || [];
  return variations.some(
    v => v.documentType === 'quote' && v.status === 'approved',
  );
}

export function getNextVariationNumber(
  state: AppState,
  projectId: string,
): string {
  const variations = state.variations[projectId] || [];
  const count = variations.filter(
    v => v.documentType === 'variation',
  ).length;
  return `V-${String(count + 1).padStart(3, '0')}`;
}
