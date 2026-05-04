import { unit, type ParametricUnit } from './types';

export const SAFETY_SMART_INSULATION_UNITS: ParametricUnit[] = [
  unit('fs-smoke', 'fireSafety', 'Smoke Alarm (240V)', '240V photoelectric smoke alarm, interconnected', 'each', 150, 'Compliance', 2, 'services'),
  unit('fs-co-detector', 'fireSafety', 'CO Detector', 'Supply & install carbon monoxide detector', 'each', 180, 'Compliance', 1, 'services'),
  unit('fs-fire-blanket', 'fireSafety', 'Fire Blanket', 'Supply & install fire blanket (kitchen)', 'each', 65, 'Compliance', 1, 'services'),
  unit('fs-extinguisher', 'fireSafety', 'Fire Extinguisher', 'Supply & install 1kg dry powder extinguisher', 'each', 95, 'Compliance', 1, 'services'),
  unit('sm-cat6', 'smartHome', 'Cat6 Data Point', 'Data point wired to patch panel', 'each', 195, 'Data', 2, 'services'),
  unit('sm-cctv', 'smartHome', 'CCTV Camera', 'Supply & install IP CCTV camera', 'each', 450, 'Data', 2, 'services'),
  unit('sm-intercom', 'smartHome', 'Intercom Station', 'Supply & install video intercom station', 'each', 850, 'Data', 1, 'services'),
  unit('sm-sensor', 'smartHome', 'Smart Motion Sensor', 'Supply & install smart motion sensor', 'each', 180, 'Data', 2, 'services'),
  unit('sm-doorbell', 'smartHome', 'Video Doorbell', 'Supply & install video doorbell unit', 'each', 280, 'Data', 1, 'services'),
  unit('in-ceiling-batts', 'insulation', 'Ceiling Batts (R3.5)', 'Supply & install R3.5 ceiling insulation batts', 'm2', 18, 'Insulation', 20, 'structure'),
  unit('in-wall-batts', 'insulation', 'Wall Batts (R2.0)', 'Supply & install R2.0 wall insulation batts', 'm2', 25, 'Insulation', 30, 'structure'),
  unit('in-underfloor', 'insulation', 'Underfloor Insulation', 'Supply & install reflective underfloor foil', 'm2', 22, 'Insulation', 20, 'structure'),
];
