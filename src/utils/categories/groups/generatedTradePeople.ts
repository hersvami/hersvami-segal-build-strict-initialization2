import { TRADE_RATE_DIRECTORY } from '../../trades/tradeRateDirectory';
import { getTradeCategoryId } from '../../trades/tradeIds';
import { catX, type WorkCategory } from '../types';

export const GENERATED_TRADE_PEOPLE_CATEGORIES: WorkCategory[] = TRADE_RATE_DIRECTORY
  .map((item) => catX(
    getTradeCategoryId(item.trade),
    item.trade,
    'trade',
    'trades',
    'trade',
    [
      { id: 'scopeType', label: 'Scope type', type: 'select', options: ['Labour only', 'Supply and install', 'Repair', 'New work'] },
      { id: 'complexity', label: 'Complexity', type: 'select', options: ['Standard', 'Moderate', 'Complex / premium'] },
      { id: 'access', label: 'Access', type: 'select', options: ['Easy', 'Moderate', 'Difficult'] },
    ],
    [{ name: item.trade, trade: item.trade, rate: item.rate, unit: item.unit, duration: item.duration, description: item.description }],
    [],
    ['Labour and standard materials required for the nominated trade scope'],
    ['Permits, engineering, specialist reports and latent conditions unless specifically listed'],
    [],
    { dimensionMode: item.unit === 'area' ? 'area' : item.unit === 'linear' ? 'linear' : 'none', usesParametric: false, supportsPcItems: false },
  ));
