import type { AppState } from '../types/appState';
import type { Variation } from '../types/domain';

export function createVariation(state: AppState, projectId: string, variation: Variation): AppState {
  const existing = state.variations[projectId] || [];
  return {
    ...state,
    variations: { ...state.variations, [projectId]: [...existing, variation] },
    activeVariationId: variation.id,
    uiState: { ...state.uiState, view: 'report' },
  };
}

export function updateVariation(state: AppState, projectId: string, variation: Variation): AppState {
  const existing = state.variations[projectId] || [];
  return {
    ...state,
    variations: { ...state.variations, [projectId]: existing.map((item) => item.id === variation.id ? variation : item) },
  };
}

export function selectVariation(state: AppState, variationId: string): AppState {
  return { ...state, activeVariationId: variationId, uiState: { ...state.uiState, view: 'report' } };
}

export function setVariationStatus(state: AppState, projectId: string, variationId: string, status: Variation['status']): AppState {
  const existing = state.variations[projectId] || [];
  return {
    ...state,
    variations: { ...state.variations, [projectId]: existing.map((item) => item.id === variationId ? { ...item, status } : item) },
  };
}

export function hasApprovedQuote(state: AppState, projectId: string): boolean {
  return (state.variations[projectId] || []).some((item) => item.documentType === 'quote' && item.status === 'approved');
}

export function getNextVariationNumber(state: AppState, projectId: string): string {
  const count = (state.variations[projectId] || []).filter((item) => item.documentType === 'variation').length;
  return `V-${String(count + 1).padStart(3, '0')}`;
}