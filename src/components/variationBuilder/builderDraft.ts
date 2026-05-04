const STORAGE_PREFIX = 'segal:builderDraft';
import type { ProjectBaseline } from '../../types/domain';

type Draft = { scopeInput: string; selectedCategoryId: string; baseline: ProjectBaseline };

function getStorageKey(projectId: string, docType: string): string {
  return `${STORAGE_PREFIX}:${projectId}:${docType}`;
}

export function saveBuilderDraft(projectId: string, docType: string, draft: Draft): void {
  try { window.localStorage.setItem(getStorageKey(projectId, docType), JSON.stringify(draft)); } catch {}
}

export function loadBuilderDraft(projectId: string, docType: string): Draft | null {
  try { const raw = window.localStorage.getItem(getStorageKey(projectId, docType)); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function clearBuilderDraft(projectId: string, docType: string): void {
  try { window.localStorage.removeItem(getStorageKey(projectId, docType)); } catch {}
}
