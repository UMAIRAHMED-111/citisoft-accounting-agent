import { describe, it, expect } from 'vitest';
import { apInvoices, arInvoices, purchaseOrders, bankStatement } from './seed';
describe('seed integrity', () => {
  it('has 18 AP invoices incl. 2 messy', () => {
    expect(apInvoices).toHaveLength(18);
    expect(apInvoices.filter(i => i.poRef == null)).not.toHaveLength(0);
  });
  it('every AP invoice points at a real PDF under /invoices/', () => {
    for (const i of apInvoices) expect(i.pdfUrl).toMatch(/^\/invoices\/.+\.pdf$/);
  });
  it('every AP poRef (when present) resolves to a real PO', () => {
    for (const i of apInvoices) if (i.poRef) expect(purchaseOrders.find(p => p.id === i.poRef)).toBeTruthy();
  });
  it('has 24 AR invoices', () => {
    expect(arInvoices).toHaveLength(24);
  });
  it('bank statement has txns with at least one unmatched-cash memo', () => {
    expect(bankStatement.txns.length).toBeGreaterThanOrEqual(9);
    expect(bankStatement.txns.some(t => t.payerRef == null && t.amount > 0)).toBe(true);
  });
});
