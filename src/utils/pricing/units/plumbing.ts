import { unit, type ParametricUnit } from './types';

export const PLUMBING_UNITS: ParametricUnit[] = [
  unit('pl-water-pt', 'plumbing', 'Water Point (Rough-In)', 'Rough-in hot or cold water service point', 'each', 180, 'Plumbing', 3, 'services'),
  unit('pl-drain-pt', 'plumbing', 'Drainage Point (Rough-In)', 'Rough-in waste drainage point', 'each', 220, 'Plumbing', 3, 'services'),
  unit('pl-toilet-suite', 'plumbing', 'Toilet Suite (Back-to-Wall)', 'Supply & install back-to-wall toilet suite', 'each', 650, 'Plumbing', 1, 'services'),
  unit('pl-shower-mixer', 'plumbing', 'Shower Mixer + Rose', 'Supply & install shower mixer tap + shower rose', 'each', 380, 'Plumbing', 1, 'services'),
  unit('pl-basin-mixer', 'plumbing', 'Basin Mixer Tap', 'Supply & install basin mixer tapware', 'each', 280, 'Plumbing', 1, 'services'),
  unit('pl-floor-waste', 'plumbing', 'Floor Waste', 'Supply & install chrome floor waste grate', 'each', 120, 'Plumbing', 1, 'services'),
  unit('pl-hw-sys', 'plumbing', 'Hot Water System (26L Gas)', 'Supply & install continuous flow gas HW system', 'allow', 2500, 'Plumbing', 1, 'services'),
  unit('pl-hw-elec', 'plumbing', 'Hot Water System (Electric)', 'Supply & install electric storage HW system', 'allow', 1800, 'Plumbing', 1, 'services'),
  unit('pl-pressure-test', 'plumbing', 'Pressure Test', 'Pressure test all new plumbing lines', 'allow', 250, 'Plumbing', 1, 'services'),
  unit('pl-garden-tap', 'plumbing', 'Garden Tap (External)', 'Supply & install external garden tap hose cock', 'each', 180, 'Plumbing', 1, 'services'),
  unit('pl-washing-taps', 'plumbing', 'Washing Machine Taps', 'Supply & install cold + hot washing machine taps', 'each', 220, 'Plumbing', 1, 'services'),
  unit('pl-isolation-valve', 'plumbing', 'Isolation Valve', 'Supply & install inline isolation valve', 'each', 85, 'Plumbing', 2, 'services'),
  unit('pl-gas-bayonet', 'plumbing', 'Gas Bayonet Point', 'Supply & install gas bayonet outlet', 'each', 280, 'Plumbing', 1, 'services'),
];
