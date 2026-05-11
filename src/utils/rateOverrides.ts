const OVERRIDE_KEY = 'segal_build_rate_overrides';

function loadOverrides(): Record<string, number> {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getTradeRateOverride(trade: string): number | undefined {
  const overrides = loadOverrides();
  return overrides[`trade_${trade}`];
}

export function getActiveOverrideCount(): number {
  return Object.keys(loadOverrides()).length;
}

export function applyRateOverrides(rate: number, trade: string): number {
  const override = getTradeRateOverride(trade);
  return override ?? rate;
}
