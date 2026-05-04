import type { AppState } from '../types/appState';
import type { Project } from '../types/domain';

export function createProject(state: AppState, project: Project): AppState {
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
  const projects = state.projects.filter((project) => project.id !== projectId);
  return {
    ...state,
    projects,
    variations: newVariations,
    activeProjectId: projects[0]?.id || null,
    uiState: { ...state.uiState, view: projects.length ? 'project' : 'welcome' },
  };
}