export const APP_BUILD_VERSION = '2026-05-04-cache-reset-1';

export async function clearBrowserRuntimeCaches() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem('segal-build-app-version', APP_BUILD_VERSION);
  } catch {
    // Ignore locked-down storage.
  }

  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    } catch {
      // No service worker or browser blocked access.
    }
  }

  if ('caches' in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch {
      // Cache API may be unavailable in some browser modes.
    }
  }
}