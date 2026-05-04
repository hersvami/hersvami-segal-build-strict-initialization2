/* ─── Segal Build — Utility Helpers ─── */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function downloadProjectExport(projectData: Record<string, unknown>) {
  const blob = new Blob(
    [JSON.stringify(projectData, null, 2)],
    { type: 'application/json' },
  );
  downloadBlob(blob, `segal-build-export-${projectData.projectName || 'project'}-${new Date().toISOString().split('T')[0]}.json`);
}

export function downloadBlob(blob: Blob, filename: string): string {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);

  // Some browsers ignore HTMLElement.click() unless a real mouse event is dispatched.
  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  return url;
}

export function generateVariationNumber(count: number): string {
  return `V-${String(count + 1).padStart(3, '0')}`;
}
