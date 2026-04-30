/* Category-specific type selectors for detail forms. */

export const CATEGORY_TYPE_OPTIONS: Record<string, string[]> = {
  bathroom: ['Full renovation', 'New ensuite', 'New bathroom'],
  kitchen: ['Full renovation', 'New kitchen', 'Cabinet replacement'],
  laundry: ['Full renovation', 'New laundry', 'Upgrade'],
  toilet: ['New WC', 'Renovation', 'Relocation'],
  flooring: ['Timber', 'Tiles', 'Carpet', 'Vinyl', 'Polished Concrete'],
  painting: ['Interior', 'Exterior', 'Whole house', 'Feature walls'],
  electrical: ['Power points', 'Lighting', 'Switchboard', 'Rewire'],
  plumbing: ['Rough-in', 'Fit-off', 'Hot water', 'Drainage', 'Gas'],
  waterproofing: ['Bathroom', 'Laundry', 'Balcony', 'Roof'],
  windowsDoors: ['Window replacement', 'Door replacement', 'Sliding', 'French'],
  roofing: ['Re-roof', 'Repairs', 'Guttering', 'Skylights'],
  decking: ['Timber', 'Composite', 'Merbau', 'Blackbutt'],
  fencing: ['Timber paling', 'Colorbond', 'Picket', 'Pool fence'],
  concreting: ['Slab', 'Path', 'Driveway', 'Footings'],
  hvac: ['Split system', 'Ducted', 'Multi-split'],
};

export function getCategoryTypeOptions(categoryId: string): string[] {
  return CATEGORY_TYPE_OPTIONS[categoryId] || [];
}
