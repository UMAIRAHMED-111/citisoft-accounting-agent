import { describe, it, expect } from 'vitest';
import { matchInvoiceToPo, matchPaymentToInvoices, buildLedger } from './reconcile';
import { apInvoices, purchaseOrders, arInvoices, bankStatement } from './seed';

describe('AP matching', () => {
  it('auto-approves a clean PO+amount match', () => {
    const clean = apInvoices.find(i => i.poRef && purchaseOrders.find(p => p.id===i.poRef && p.total===i.amount))!;
    const r = matchInvoiceToPo(clean, purchaseOrders);
    expect(r.status).toBe('auto_approved'); expect(r.confidence).toBeGreaterThanOrEqual(0.95);
  });
  it('flags a missing-PO invoice with a specific reason', () => {
    const messy = apInvoices.find(i => i.poRef == null)!;
    const r = matchInvoiceToPo(messy, purchaseOrders);
    expect(r.status).toBe('needs_review');
    expect(r.reasons.join(' ')).toMatch(/purchase-order reference/i);
  });
  it('flags an amount-mismatch invoice with a specific reason citing the delta', () => {
    const mismatch = apInvoices.find(i => i.id === 'ap-5')!;
    const r = matchInvoiceToPo(mismatch, purchaseOrders);
    expect(r.status).toBe('needs_review');
    expect(r.reasons.join(' ')).toMatch(/51\.96/);
  });
});

describe('AR matching', () => {
  it('never force-matches unmatched cash', () => {
    const results = bankStatement.txns.map(t => matchPaymentToInvoices(t, arInvoices));
    expect(results.some(r => r.kind === 'unmatched')).toBe(true);
    expect(results.some(r => r.kind === 'partial')).toBe(true);
    expect(results.some(r => r.kind === 'lump')).toBe(true);
  });
  it('matches exact ref+amount to the correct invoice', () => {
    const txn = bankStatement.txns.find(t => t.id === 'txn-1')!;
    const r = matchPaymentToInvoices(txn, arInvoices);
    expect(r.kind).toBe('exact');
    expect(r.matches).toHaveLength(1);
    expect(r.matches[0].invoice.id).toBe('ar-1');
    expect(r.matches[0].applied).toBe(12450.00);
  });
  it('identifies a partial payment with remaining balance in the reason', () => {
    const txn = bankStatement.txns.find(t => t.id === 'txn-4')!;
    const r = matchPaymentToInvoices(txn, arInvoices);
    expect(r.kind).toBe('partial');
    expect(r.matches[0].applied).toBe(3000.00);
    expect(r.reasons.join(' ')).toMatch(/2,875\.50/);
  });
  it('identifies a lump payment covering two invoices', () => {
    const txn = bankStatement.txns.find(t => t.id === 'txn-5')!;
    const r = matchPaymentToInvoices(txn, arInvoices);
    expect(r.kind).toBe('lump');
    expect(r.matches).toHaveLength(2);
    expect(r.reasons.join(' ')).toMatch(/AR-2026-0067/);
    expect(r.reasons.join(' ')).toMatch(/AR-2026-0072/);
  });
  it('treats negative txns as out-of-scope (not customer receipts)', () => {
    const negTxns = bankStatement.txns.filter(t => t.amount <= 0);
    for (const txn of negTxns) {
      const r = matchPaymentToInvoices(txn, arInvoices);
      expect(r.kind).toBe('unmatched');
      expect(r.matches).toHaveLength(0);
      expect(r.reasons.join(' ')).toMatch(/Not a customer receipt/i);
    }
  });
});

describe('ledger', () => {
  it('kpis reconcile to summed open items', () => {
    const l = buildLedger();
    expect(l.kpis.exceptionsCount).toBe(l.exceptions.length);
    expect(l.kpis.openApTotal).toBeGreaterThan(0);
  });
  it('has ap rows, ar rows, exceptions, kpis, and activity', () => {
    const l = buildLedger();
    expect(l.ap.length).toBeGreaterThan(0);
    expect(l.ar.length).toBeGreaterThan(0);
    expect(l.kpis).toBeDefined();
    expect(Array.isArray(l.activity)).toBe(true);
  });
});
