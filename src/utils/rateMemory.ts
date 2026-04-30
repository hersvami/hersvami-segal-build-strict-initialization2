/* ─── Segal Build — Rate Memory Utility ─── */

/**
 * Rate memory stores builder-confirmed rate overrides in localStorage.
 * These overrides are applied automatically to future quotes/variations.
 * 
 * This is builder-controlled learning - rates are only saved when explicitly confirmed.
 */

export type RateMemoryEntry = {
  id: string;
  // Target identifier - can be trade+category or specific BoQ unit ID
  targetId: string;
  targetType: 'trade_category' | 'parametric_unit';
  // The overridden rate value
  rate: number;
  unit: 'each' | 'lm' | 'm2' | 'allow' | 'area' | 'linear' | 'item';
  // Metadata
  note?: string;
  source: 'user_override';
  lastUpdated: string;
  previousValue?: number;
  // Context for where this was used
  categoryId?: string;
  tradeName?: string;
};

export type RateMemoryStore = Record<string, RateMemoryEntry>;

const STORAGE_KEY = 'segal_build_rate_memory';

function getStore(): RateMemoryStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as RateMemoryStore;
    }
  } catch (error) {
    console.error('Failed to load rate memory from localStorage:', error);
  }
  return {};
}

function saveStore(store: RateMemoryStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to save rate memory to localStorage:', error);
  }
}

/**
 * Generate a unique target ID for trade+category combinations
 */
export function makeTradeCategoryTargetId(trade: string, categoryId: string): string {
  return `trade_cat:${trade.toLowerCase().replace(/\s+/g, '_')}:${categoryId}`;
}

/**
 * Generate a unique target ID for parametric units
 */
export function makeParametricUnitTargetId(unitId: string): string {
  return `parametric_unit:${unitId}`;
}

/**
 * Save a rate override to memory
 */
export function saveRateOverride(entry: Omit<RateMemoryEntry, 'id' | 'source' | 'lastUpdated'>): RateMemoryEntry {
  const store = getStore();
  const existingEntry = store[entry.targetId];
  
  const newEntry: RateMemoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    source: 'user_override',
    lastUpdated: new Date().toISOString(),
    previousValue: existingEntry?.rate,
  };
  
  store[entry.targetId] = newEntry;
  saveStore(store);
  
  return newEntry;
}

/**
 * Get a remembered rate override for a target
 */
export function getRememberedRate(targetId: string): RateMemoryEntry | undefined {
  const store = getStore();
  return store[targetId];
}

/**
 * Check if there's a remembered rate for a target
 */
export function hasRememberedRate(targetId: string): boolean {
  const store = getStore();
  return !!store[targetId];
}

/**
 * Get all remembered rate overrides
 */
export function getAllRateOverrides(): RateMemoryEntry[] {
  const store = getStore();
  return Object.values(store);
}

/**
 * Delete a rate override from memory
 */
export function deleteRateOverride(targetId: string): boolean {
  const store = getStore();
  if (store[targetId]) {
    delete store[targetId];
    saveStore(store);
    return true;
  }
  return false;
}

/**
 * Clear all rate overrides from memory
 */
export function clearAllRateOverrides(): void {
  saveStore({});
}

/**
 * Get remembered rates for a specific category
 */
export function getRateOverridesForCategory(categoryId: string): RateMemoryEntry[] {
  const store = getStore();
  return Object.values(store).filter(entry => entry.categoryId === categoryId);
}

/**
 * Apply remembered rate to a rate calculation
 * Returns the remembered rate if available, otherwise the default rate
 */
export function applyRememberedRate(
  targetId: string,
  defaultRate: number,
): { rate: number; isFromMemory: boolean; entry?: RateMemoryEntry } {
  const entry = getRememberedRate(targetId);
  if (entry) {
    return { rate: entry.rate, isFromMemory: true, entry };
  }
  return { rate: defaultRate, isFromMemory: false };
}

/**
 * Export rate memory as JSON for backup
 */
export function exportRateMemory(): string {
  const store = getStore();
  return JSON.stringify(store, null, 2);
}

/**
 * Import rate memory from JSON backup
 */
export function importRateMemory(json: string): { success: boolean; count: number; error?: string } {
  try {
    const imported = JSON.parse(json) as RateMemoryStore;
    // Basic validation
    if (typeof imported !== 'object' || imported === null) {
      return { success: false, count: 0, error: 'Invalid format: expected object' };
    }
    
    const currentStore = getStore();
    let count = 0;
    
    for (const [key, value] of Object.entries(imported)) {
      if (value && typeof value === 'object' && 'targetId' in value && 'rate' in value) {
        currentStore[key] = value as RateMemoryEntry;
        count++;
      }
    }
    
    saveStore(currentStore);
    return { success: true, count };
  } catch (error) {
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
