import { COMPANIES } from '../constants/companies';
import type { AppState } from '../types/appState';

export const APP_VERSION = '2.0';

export function createInitialState(): AppState {
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