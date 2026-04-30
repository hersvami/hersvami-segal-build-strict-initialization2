import type { TradeRateItem } from './tradeRateTypes';

export const TRADE_RATES_N_TO_Z: TradeRateItem[] = [
  { trade: 'Painter', categoryId: 'painting', keywords: ['painter', 'painting', 'paint'], rate: 65, unit: 'area', duration: 2, description: 'Paint preparation and coating works' },
  { trade: 'Paver', categoryId: 'paving', keywords: ['paver', 'paving', 'driveway'], rate: 95, unit: 'area', duration: 2, description: 'Paving, driveway and hardscape works' },
  { trade: 'Pest Controller', categoryId: 'tradePestControl', keywords: ['pest control', 'termite', 'borer'], rate: 650, unit: 'allow', duration: 1, description: 'Pest inspection and treatment allowance' },
  { trade: 'Plasterer', categoryId: 'plastering', keywords: ['plasterer', 'plastering', 'plasterboard'], rate: 85, unit: 'area', duration: 2, description: 'Plasterboard sheeting, setting and repair' },
  { trade: 'Plumber', categoryId: 'plumbing', keywords: ['plumber', 'plumbing', 'drainage'], rate: 950, unit: 'allow', duration: 1, description: 'Plumbing rough-in, fit-off and compliance' },
  { trade: 'Pool Contractor', categoryId: 'pools', keywords: ['pool contractor', 'pool builder', 'spa'], rate: 30000, unit: 'allow', duration: 5, description: 'Pool shell, equipment and finish works' },
  { trade: 'Renderer', categoryId: 'rendering', keywords: ['renderer', 'rendering', 'texture coat'], rate: 85, unit: 'area', duration: 2, description: 'Render preparation and application' },
  { trade: 'Roofer', categoryId: 'roofing', keywords: ['roofer', 'roofing', 'colorbond'], rate: 120, unit: 'area', duration: 3, description: 'Roofing installation and flashings' },
  { trade: 'Scaffolder', categoryId: 'tradeScaffolding', keywords: ['scaffolder', 'scaffold', 'edge protection'], rate: 2800, unit: 'allow', duration: 1, description: 'Scaffold and roof edge protection allowance' },
  { trade: 'Security Technician', categoryId: 'smartHome', keywords: ['security technician', 'alarm', 'cctv'], rate: 850, unit: 'allow', duration: 1, description: 'Security, CCTV and alarm works' },
  { trade: 'Solar Installer', categoryId: 'tradeSolar', keywords: ['solar installer', 'solar panels', 'inverter'], rate: 6500, unit: 'allow', duration: 2, description: 'Solar PV installation allowance' },
  { trade: 'Stonemason', categoryId: 'tradeStonemasonry', keywords: ['stonemason', 'stone masonry', 'stonework'], rate: 280, unit: 'area', duration: 3, description: 'Stonework and masonry installation' },
  { trade: 'Steel Fabricator / Framer', categoryId: 'steelFraming', keywords: ['steel fabricator', 'steel frame', 'steel beam'], rate: 3500, unit: 'item', duration: 2, description: 'Steel fabrication and installation' },
  { trade: 'Structural Contractor', categoryId: 'structural', keywords: ['structural contractor', 'structural works', 'beam install'], rate: 4500, unit: 'item', duration: 2, description: 'Structural modification and installation works' },
  { trade: 'Tiler', categoryId: 'tiling', keywords: ['tiler', 'tiling', 'tile'], rate: 145, unit: 'area', duration: 2, description: 'Tile installation and grouting works' },
  { trade: 'Underpinner / Restumper', categoryId: 'underpinning', keywords: ['underpinner', 'restumper', 'underpinning'], rate: 450, unit: 'linear', duration: 5, description: 'Underpinning, restumping and re-levelling works' },
  { trade: 'Waterproofer', categoryId: 'waterproofing', keywords: ['waterproofer', 'waterproofing', 'membrane'], rate: 55, unit: 'area', duration: 1, description: 'AS3740 waterproofing membrane works' },
];