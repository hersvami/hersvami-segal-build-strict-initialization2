import { unit, type ParametricUnit } from './types';

export const ELECTRICAL_UNITS: ParametricUnit[] = [
  unit('el-gpo-double', 'electrical', 'Double GPO (power point)', 'Supply & install double GPO', 'each', 110, 'Electrical', 4, 'services'),
  unit('el-gpo-usb', 'electrical', 'USB GPO (double + USB)', 'Supply & install double GPO with USB charging', 'each', 145, 'Electrical', 1, 'services'),
  unit('el-downlight', 'electrical', 'LED Downlight', 'Supply & install dimmable LED downlight', 'each', 85, 'Electrical', 6, 'services'),
  unit('el-switch', 'electrical', 'Light Switch (single)', 'Supply & install single gang light switch', 'each', 65, 'Electrical', 2, 'services'),
  unit('el-switch-2g', 'electrical', 'Light Switch (double gang)', 'Supply & install double gang light switch', 'each', 75, 'Electrical', 1, 'services'),
  unit('el-exhaust-fan', 'electrical', 'Exhaust Fan (ducted)', 'Supply & install exhaust fan ducted to outside', 'each', 350, 'Electrical', 1, 'services'),
  unit('el-heat-lamp', 'electrical', 'Bathroom Heat Lamp / Fan Unit', 'Supply & install 3-in-1 heat lamp, fan, light', 'each', 450, 'Electrical', 1, 'services'),
  unit('el-smoke-alarm', 'electrical', 'Smoke Alarm (240V)', '240V photoelectric interconnected smoke alarm', 'each', 150, 'Electrical', 2, 'services'),
  unit('el-data-cat6', 'electrical', 'Data Point (Cat6)', 'Cat6 data point - wired to patch panel', 'each', 195, 'Electrical', 1, 'services'),
  unit('el-tv-point', 'electrical', 'TV Antenna Point', 'Supply & install TV antenna outlet', 'each', 120, 'Electrical', 1, 'services'),
  unit('el-outside-light', 'electrical', 'External Light Point', 'Supply & install external light fitting', 'each', 195, 'Electrical', 1, 'services'),
  unit('el-sensor-light', 'electrical', 'Sensor Light (security)', 'Supply & install motion sensor security light', 'each', 220, 'Electrical', 1, 'services'),
  unit('el-switchboard', 'electrical', 'Switchboard Upgrade', 'Upgrade switchboard with safety switches', 'allow', 2200, 'Electrical', 1, 'services'),
  unit('el-circuit', 'electrical', 'New Power Circuit', 'Run new dedicated power circuit from board', 'each', 380, 'Electrical', 1, 'services'),
];
