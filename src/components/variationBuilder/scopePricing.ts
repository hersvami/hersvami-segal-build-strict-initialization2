import { VariationScope, BaselineParams } from '../../types';
import { calculateArea, calculateVolume } from './mathHelpers';

/**
 * Derives scope dimensions based on baseline parameters.
 * FIX: Now properly syncs height when baseline changes, unless explicitly customized.
 */
export function deriveScopeDimensions(
  baseline: BaselineParams,
  existingScope?: VariationScope
): { length: number; width: number; height: number; area: number; volume: number } {
  
  // 1. Determine Length & Width
  // If scope exists, keep user-defined length/width. Otherwise, use baseline.
  const length = existingScope?.dimensions.length ?? baseline.length;
  const width = existingScope?.dimensions.width ?? baseline.width;

  // 2. Determine Height (The Core Fix)
  let height: number;

  if (existingScope && existingScope.dimensions.height) {
    // Check if the existing height matches the OLD baseline exactly.
    // If it matches, it wasn't a "custom" user edit, so we should update it to the NEW baseline.
    // If it differs, the user manually changed it, so we keep it.
    const wasDefaultHeight = existingScope.dimensions.height === (existingScope.baselineHeight || baseline.ceilingHeight);
    
    if (wasDefaultHeight) {
      // Sync with new baseline
      height = baseline.ceilingHeight;
    } else {
      // Preserve user customization
      height = existingScope.dimensions.height;
    }
  } else {
    // No existing scope? Use fresh baseline.
    height = baseline.ceilingHeight;
  }

  // 3. Calculate Derived Values
  const area = calculateArea(length, width);
  const volume = calculateVolume(length, width, height);

  return { length, width, height, area, volume };
}

/**
 * Updates a scope's dimensions when the parent baseline changes.
 */
export function updateScopeForBaselineChange(
  scope: VariationScope,
  newBaseline: BaselineParams
): VariationScope {
  const newDims = deriveScopeDimensions(newBaseline, scope);

  return {
    ...scope,
    dimensions: newDims,
    baselineHeight: newBaseline.ceilingHeight, // Track what the baseline was at last sync
  };
}