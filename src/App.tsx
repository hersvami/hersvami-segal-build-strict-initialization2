import { LoadingSpinner } from './components/LoadingSpinner';
import { usePersistedAppState } from './logic/state';
import { AppLayout } from './app/AppLayout';
import { useAppActions } from './app/useAppActions';

export default function App() {
  const { state, setState } = usePersistedAppState();
  const app = useAppActions(state, setState);

  if (!state) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return <AppLayout state={state} app={app} />;
}