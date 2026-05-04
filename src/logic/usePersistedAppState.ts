import { useCallback, useEffect, useState } from 'react';
import type { AppState } from '../types/appState';
import { loadState, normalizeState, saveState } from './persistence';

export function usePersistedAppState() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const flush = () => saveState(state);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => {
      const next = normalizeState(fn(prev));
      saveState(next);
      return next;
    });
  }, []);

  return { state, setState: update };
}