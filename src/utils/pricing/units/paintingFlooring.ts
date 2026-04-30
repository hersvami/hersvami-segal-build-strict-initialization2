import { unit, type ParametricUnit } from './types';

export const PAINTING_FLOORING_UNITS: ParametricUnit[] = [
  unit('pt-walls-int', 'painting', 'Interior Wall Paint (2 coat)', 'Two coats premium acrylic - walls', 'm2', 18, 'Painting', 40, 'finishes'),
  unit('pt-ceiling', 'painting', 'Ceiling Paint (2 coat)', 'Two coats ceiling white - ceilings', 'm2', 15, 'Painting', 15, 'finishes'),
  unit('pt-trim-door', 'painting', 'Door + Trim Paint', 'Paint doors, architraves, skirting', 'each', 120, 'Painting', 2, 'finishes'),
  unit('pt-walls-ext', 'painting', 'Exterior Wall Paint (2 coat)', 'Two coats exterior acrylic - external walls', 'm2', 28, 'Painting', 20, 'finishes'),
  unit('pt-prep', 'painting', 'Surface Prep & Fill', 'Prep, fill, sand all surfaces before paint', 'm2', 8, 'Painting', 40, 'preparation'),
  unit('fl-carpet', 'flooring', 'Carpet + Underlay', 'Supply & lay carpet with premium underlay', 'm2', 65, 'Flooring', 12, 'finishes'),
  unit('fl-timber-eng', 'flooring', 'Engineered Timber Floor', 'Supply & lay engineered timber flooring', 'm2', 120, 'Flooring', 15, 'finishes'),
  unit('fl-vinyl-plank', 'flooring', 'Vinyl Plank (LVP)', 'Supply & lay luxury vinyl plank flooring', 'm2', 75, 'Flooring', 15, 'finishes'),
  unit('fl-tile', 'flooring', 'Floor Tiles (Flooring)', 'Supply & lay ceramic/porcelain floor tiles', 'm2', 95, 'Flooring', 10, 'finishes'),
  unit('fl-subfloor-prep', 'flooring', 'Subfloor Prep & Levelling', 'Prepare and level subfloor before covering', 'm2', 35, 'Flooring', 15, 'preparation'),
];