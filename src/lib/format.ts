export function money(n: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
}

export function shortMoney(n: number): string {
  if (Math.abs(n) >= 1e6) {
    return '$' + (n / 1e6).toFixed(1) + 'M';
  }
  return '$' + (n / 1e3).toFixed(1) + 'K';
}

export function fmtDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

export function daysOverdue(due: Date, today: Date = new Date()): number {
  return Math.max(0, daysBetween(due, today));
}
