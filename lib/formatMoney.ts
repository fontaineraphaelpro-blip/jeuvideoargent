export function formatMoney(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "0 €";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs < 1000) {
    return `${sign}${abs.toFixed(abs < 10 ? 1 : 0)} €`;
  }
  if (abs < 1_000_000) {
    return `${sign}${(abs / 1000).toFixed(1)}K €`;
  }
  if (abs < 1_000_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1)}M €`;
  }
  if (abs < 1_000_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(1)}B €`;
  }
  return `${sign}${(abs / 1_000_000_000_000).toFixed(1)}T €`;
}

export function formatNumber(value: number): string {
  if (abs(value) < 1000) return value.toFixed(0);
  if (abs(value) < 1_000_000) return `${(value / 1000).toFixed(1)}K`;
  if (abs(value) < 1_000_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs(value) < 1_000_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  return `${(value / 1_000_000_000_000).toFixed(1)}T`;
}

function abs(n: number) {
  return Math.abs(n);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.ceil(seconds % 60);
  return `${m}m ${s}s`;
}
