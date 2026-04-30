import { unit, type ParametricUnit } from './types';

export const TILING_UNITS: ParametricUnit[] = [
  unit('tl-floor-std', 'tiling', 'Floor Tile (Standard Ceramic)', 'Supply & lay standard ceramic floor tiles', 'm2', 95, 'Tiling', 5, 'finishes'),
  unit('tl-floor-prem', 'tiling', 'Floor Tile (Rectified Porcelain)', 'Supply & lay rectified porcelain floor tiles', 'm2', 145, 'Tiling', 5, 'finishes'),
  unit('tl-wall-std', 'tiling', 'Wall Tile (Standard Ceramic)', 'Supply & lay standard ceramic wall tiles', 'm2', 105, 'Tiling', 10, 'finishes'),
  unit('tl-wall-prem', 'tiling', 'Wall Tile (Large Format Premium)', 'Supply & lay large format premium wall tiles', 'm2', 165, 'Tiling', 10, 'finishes'),
  unit('tl-waterproof', 'tiling', 'Waterproofing Membrane', 'Class III liquid membrane per AS3740', 'm2', 55, 'Tiling', 5, 'finishes'),
  unit('tl-tile-trim', 'tiling', 'Tile Trim / Edge Strip', 'Supply & install aluminium tile trim', 'lm', 25, 'Tiling', 6, 'finishes'),
  unit('tl-grout-seal', 'tiling', 'Grout Sealer', 'Apply grout sealer to all tiled surfaces', 'm2', 12, 'Tiling', 10, 'finishes'),
  unit('tl-shower-screen', 'tiling', 'Frameless Shower Screen', 'Supply & install frameless shower screen', 'each', 1800, 'Tiling', 1, 'finishes'),
];