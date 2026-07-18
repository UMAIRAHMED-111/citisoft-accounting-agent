import { describe, it, expect } from 'vitest';
import { money, shortMoney, fmtDate, daysOverdue } from './format';
describe('format', () => {
  it('formats money with grouping and 2dp', () => expect(money(48200)).toBe('$48,200.00'));
  it('shortens millions', () => expect(shortMoney(3120000)).toBe('$3.1M'));
  it('shortens thousands', () => expect(shortMoney(48200)).toBe('$48.2K'));
  it('formats dates human', () => expect(fmtDate(new Date('2026-07-18'))).toBe('Jul 18, 2026'));
  it('computes overdue days', () => expect(daysOverdue(new Date('2026-07-06'), new Date('2026-07-18'))).toBe(12));
});
