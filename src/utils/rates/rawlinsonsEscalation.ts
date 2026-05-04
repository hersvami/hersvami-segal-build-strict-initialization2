import { RAWLINSONS_2021_METADATA } from './rawlinsonsMetadata';
import { findRawlinsonsRate, withEscalation } from './rawlinsonsMatcher';

export const DEFAULT_ANNUAL_ESCALATION_RATE = 0.045;
export const DEFAULT_ESCALATION_TARGET_YEAR = 2025;
export const DEFAULT_PRELIMINARIES_RATE = 0.10;

export function calculateRawlinsonsEscalationFactor(
  targetYear = DEFAULT_ESCALATION_TARGET_YEAR,
  annualRate = DEFAULT_ANNUAL_ESCALATION_RATE,
): number {
  const baseYear = new Date(RAWLINSONS_2021_METADATA.base_date).getFullYear();
  const years = Math.max(targetYear - baseYear, 0);
  return Math.round(Math.pow(1 + annualRate, years) * 10000) / 10000;
}

export const DEFAULT_RAWLINSONS_ESCALATION = calculateRawlinsonsEscalationFactor();

export function getEscalatedRawlinsonsRate(
  categoryId: string,
  label: string,
  unit?: string,
  escalation = DEFAULT_RAWLINSONS_ESCALATION,
) {
  const match = findRawlinsonsRate(categoryId, label, unit);
  if (!match) return undefined;
  return {
    ...withEscalation(match, escalation),
    sourceLabel: `${RAWLINSONS_2021_METADATA.source}, escalated ${Math.round((escalation - 1) * 100)}% using ${Math.round(DEFAULT_ANNUAL_ESCALATION_RATE * 1000) / 10}% p.a. to ${DEFAULT_ESCALATION_TARGET_YEAR}`,
  };
}

export function applyGstToRawlinsonsRate(rate: number): number {
  return RAWLINSONS_2021_METADATA.gst_included ? rate : Math.round(rate * 1.1 * 100) / 100;
}

export function calculatePreliminariesAllowance(projectValueExGst: number, rate = DEFAULT_PRELIMINARIES_RATE): number {
  return Math.round(projectValueExGst * rate);
}