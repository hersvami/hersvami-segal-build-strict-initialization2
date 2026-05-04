import type { AppState } from '../types/appState';
import { APP_VERSION, createInitialState } from './initialState';

const STORAGE_KEY = 'segal-build-v2.0';
const STORAGE_BACKUP_KEY = 'segal-build-latest';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_BACKUP_KEY);
    if (!raw) return createInitialState();
    return normalizeState(JSON.parse(raw) as AppState);
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState) {
  try {
    const payload = JSON.stringify(normalizeState(state));
    localStorage.setItem(STORAGE_KEY, payload);
    localStorage.setItem(STORAGE_BACKUP_KEY, payload);
  } catch {
    /* storage full */
  }
}

export function normalizeState(state: AppState): AppState {
  const initial = createInitialState();
  const projects = Array.isArray(state.projects) ? state.projects : [];
  const variations = state.variations && typeof state.variations === 'object' ? state.variations : {};
  const activeProjectId = state.activeProjectId && projects.some((project) => project.id === state.activeProjectId)
    ? state.activeProjectId
    : projects[0]?.id || null;

  return {
    ...initial,
    ...state,
    version: APP_VERSION,
    companies: initial.companies,
    projects,
    variations,
    activeProjectId,
    uiState: {
      ...initial.uiState,
      ...(state.uiState || {}),
      view: activeProjectId ? 'project' : (state.uiState?.view || 'welcome'),
      showProjectForm: false,
    },
  };
}