import type { TradeRateItem } from './tradeRateTypes';

export const TRADE_RATES_G_TO_M: TradeRateItem[] = [
  { trade: 'Garage Door Installer', categoryId: 'tradeGarageDoor', keywords: ['garage door', 'roller door', 'sectional door'], rate: 2200, unit: 'item', duration: 1, description: 'Supply and install garage door system' },
  { trade: 'Gas Fitter', categoryId: 'plumbing', keywords: ['gas fitter', 'gas fitting', 'gas bayonet'], rate: 950, unit: 'allow', duration: 1, description: 'Gas fitting and appliance connection works' },
  { trade: 'Glazier / Window Installer', categoryId: 'windowsDoors', keywords: ['glazier', 'glass', 'window installer'], rate: 850, unit: 'item', duration: 1, description: 'Glazing, windows and door installation' },
  { trade: 'Gutter / Fascia Installer', categoryId: 'tradeGuttersFascia', keywords: ['gutter', 'fascia', 'downpipe'], rate: 95, unit: 'linear', duration: 2, description: 'Gutter, fascia and downpipe installation' },
  { trade: 'HVAC Technician', categoryId: 'hvac', keywords: ['hvac technician', 'air conditioning', 'split system'], rate: 2800, unit: 'item', duration: 1, description: 'Heating, cooling and ventilation installation' },
  { trade: 'Insulation Installer', categoryId: 'insulation', keywords: ['insulation installer', 'batts', 'thermal insulation'], rate: 35, unit: 'area', duration: 1, description: 'Bulk, acoustic or thermal insulation installation' },
  { trade: 'Landscaper', categoryId: 'landscaping', keywords: ['landscaper', 'landscape', 'garden'], rate: 85, unit: 'area', duration: 3, description: 'Landscape preparation and installation' },
  { trade: 'Locksmith', categoryId: 'tradeLocksmith', keywords: ['locksmith', 'locks', 'deadlock'], rate: 420, unit: 'allow', duration: 1, description: 'Door lock, latch and security hardware works' },
];
