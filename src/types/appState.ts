/* ─── Segal Build — App State Type ─── */
import type { Project, Variation, Company } from './domain';

export type AppState = {
  version: string;
  activeCompanyId: string;
  companies: Company[];
  projects: Project[];
  activeProjectId: string | null;
  variations: Record<string, Variation[]>; // projectId -> variations
  activeVariationId: string | null;
  uiState: {
    view: 'welcome' | 'project' | 'builder' | 'report';
    showProjectForm: boolean;
    showWelcomeEmail: boolean;
  };
};
