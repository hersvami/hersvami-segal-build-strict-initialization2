import { BoQItem } from '../types';

const STORAGE_KEY = 'segal_build_rate_memory';

export interface RateMemoryMap {
  [categoryId: string]: number;
}

/**
 * Load remembered rates from localStorage
 */
export const loadRateMemory = (): RateMemoryMap => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load rate memory:', error);
    return {};
  }
};

/**
 * Save a specific rate override to localStorage
 */
export const saveRateOverride = (categoryId: string, rate: number): void => {
  try {
    const current = loadRateMemory();
    current[categoryId] = rate;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.error('Failed to save rate override:', error);
  }
};

/**
 * Get a remembered rate for a specific category
 */
export const getRememberedRate = (categoryId: string): number | undefined => {
  const memory = loadRateMemory();
  return memory[categoryId];
};

/**
 * Clear all rate memory
 */
export const clearRateMemory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Apply remembered rates to a list of BoQ items
 * Returns a new array with updated rates where matches are found
 */
export const applyRememberedRates = (items: BoQItem[]): BoQItem[] => {
  const memory = loadRateMemory();
  
  return items.map(item => {
    // Only apply to parametric items that have a category ID and no existing override
    if (item.type === 'parametric' && item.categoryId && item.rate !== undefined) {
      const rememberedRate = memory[item.categoryId];
      
      // If we have a remembered rate and it's different from current, apply it
      if (rememberedRate !== undefined && rememberedRate !== item.rate) {
        return {
          ...item,
          rate: rememberedRate,
          isRateOverridden: true // Mark as overridden so UI shows green
        };
      }
    }
    return item;
  });
};
