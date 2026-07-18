/**
 * reconcile.ts — pure reconciliation engine
 *
 * Three exported functions:
 *   matchInvoiceToPo        AP/PO matching
 *   matchPaymentToInvoices  AR bank-txn matching
 *   buildLedger             full derived model consumed by screens + AI agent
 */

import type { Invoice, PurchaseOrder, ArInvoice, BankTxn, ApStatus, MatchKind } from './types';
import {
  vendors,
  purchaseOrders,
  apInvoices,
  arInvoices,
  bankStatement,
} from './seed';

// ---------------------------------------------------------------------------
// Helper: round to 2 decimal places to avoid floating-point drift
// ---------------------------------------------------------------------------
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ---------------------------------------------------------------------------
// Helper: format a dollar amount like "$1,234.56"
// ---------------------------------------------------------------------------
function fmt(n: number): string {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------------------------------------------------------------------------
// Ledger types
// ---------------------------------------------------------------------------
export interface ApRow {
  invoice: Invoice;
  po?: PurchaseOrder;
  status: ApStatus;
  confidence: number;
  reasons: string[];
}

export interface ArRow {
  invoice: ArInvoice;
  kind: MatchKind;
  applied: number;
  balance: number;
  confidence: number;
  reasons: string[];
}

export interface Exception {
  type: 'ap_mismatch' | 'ap_no_po' | 'ap_duplicate' | 'ar_partial' | 'ar_unmatched_deposit';
  ref: string;
  description: string;
}

export interface ActivityItem {
  date: Date;
  type: 'ap_received' | 'ar_payment';
  ref: string;
  amount: number;
  description: string;
}

export interface Kpis {
  openApTotal: number;
  openArTotal: number;
  exceptionsCount: number;
  reconciledMtd: number;
}

export interface Ledger {
  ap: ApRow[];
  ar: ArRow[];
  exceptions: Exception[];
  kpis: Kpis;
  activity: ActivityItem[];
}

// ---------------------------------------------------------------------------
// matchInvoiceToPo
// ---------------------------------------------------------------------------
export function matchInvoiceToPo(
  inv: Invoice,
  pos: PurchaseOrder[],
): { po?: PurchaseOrder; status: ApStatus; confidence: number; reasons: string[] } {
  // 1. No poRef on the invoice
  if (inv.poRef == null || inv.poRef === '') {
    return {
      po: undefined,
      status: 'needs_review',
      confidence: 0.0,
      reasons: ['No purchase-order reference on the invoice'],
    };
  }

  // 2. Find the PO by reference
  const po = pos.find(p => p.id === inv.poRef);
  if (!po) {
    return {
      po: undefined,
      status: 'needs_review',
      confidence: 0.1,
      reasons: [`Purchase order ${inv.poRef} could not be found in the system`],
    };
  }

  // 3. Check for exact amount match
  const delta = round2(inv.amount - po.total);
  if (delta === 0) {
    return {
      po,
      status: 'auto_approved',
      confidence: 0.99,
      reasons: [`Invoice amount ${fmt(inv.amount)} matches PO ${po.id} exactly`],
    };
  }

  // 4. Amount mismatch
  const absDelta = Math.abs(delta);
  const direction = delta > 0 ? 'over' : 'under';
  return {
    po,
    status: 'needs_review',
    confidence: 0.5,
    reasons: [
      `Amount ${fmt(inv.amount)} is ${fmt(absDelta)} ${direction} PO ${po.id}`,
    ],
  };
}

// ---------------------------------------------------------------------------
// matchPaymentToInvoices
// ---------------------------------------------------------------------------
export function matchPaymentToInvoices(
  txn: BankTxn,
  invoices: ArInvoice[],
): { matches: { invoice: ArInvoice; applied: number }[]; kind: MatchKind; confidence: number; reasons: string[] } {
  // Non-positive amounts are bank fees or outbound payments — not customer receipts
  if (txn.amount <= 0) {
    return {
      matches: [],
      kind: 'unmatched',
      confidence: 1.0,
      reasons: ['Not a customer receipt (bank fee / outbound payment)'],
    };
  }

  // 1. Exact match: payerRef resolves to a single invoice AND amount matches
  if (txn.payerRef) {
    const inv = invoices.find(i => i.ref === txn.payerRef || i.invoiceNo === txn.payerRef);
    if (inv) {
      const delta = round2(txn.amount - inv.amount);
      if (delta === 0) {
        return {
          matches: [{ invoice: inv, applied: txn.amount }],
          kind: 'exact',
          confidence: 0.99,
          reasons: [`${fmt(txn.amount)} exactly matches ${inv.ref}`],
        };
      }
      // Partial: payment is less than the invoice amount
      if (txn.amount < inv.amount) {
        const balance = round2(inv.amount - txn.amount);
        return {
          matches: [{ invoice: inv, applied: txn.amount }],
          kind: 'partial',
          confidence: 0.85,
          reasons: [`${fmt(txn.amount)} of ${fmt(inv.amount)} applied — ${fmt(balance)} still open`],
        };
      }
    }
  }

  // 2. Lump sum: memo contains multiple AR refs and txn amount = sum of matching invoices
  // Scan memo for all AR-year-#### style references
  const refPattern = /AR-\d{4}-\d{4}/g;
  const memoRefs = [...(txn.memo.matchAll(refPattern))].map(m => m[0]);
  if (memoRefs.length >= 2) {
    const matched = memoRefs
      .map(ref => invoices.find(i => i.ref === ref || i.invoiceNo === ref))
      .filter((i): i is ArInvoice => i !== undefined);
    if (matched.length >= 2) {
      const sum = round2(matched.reduce((acc, i) => acc + i.amount, 0));
      if (round2(txn.amount) === sum) {
        return {
          matches: matched.map(i => ({ invoice: i, applied: i.amount })),
          kind: 'lump',
          confidence: 0.95,
          reasons: [`${fmt(txn.amount)} covers ${matched.map(i => i.ref).join(' + ')}`],
        };
      }
    }
  }

  // 3. Amount-only lump: no refs in memo but txn amount equals sum of some subset of open invoices
  // Try to find a pair (or more) of invoices whose total matches (brute-force — small data set)
  if (memoRefs.length === 0 && !txn.payerRef) {
    // Try pairs first
    for (let a = 0; a < invoices.length; a++) {
      for (let b = a + 1; b < invoices.length; b++) {
        if (round2(invoices[a].amount + invoices[b].amount) === round2(txn.amount)) {
          const pair = [invoices[a], invoices[b]];
          return {
            matches: pair.map(i => ({ invoice: i, applied: i.amount })),
            kind: 'lump',
            confidence: 0.7,
            reasons: [`${fmt(txn.amount)} covers ${pair.map(i => i.ref).join(' + ')}`],
          };
        }
      }
    }
  }

  // 4. Unmatched customer deposit — genuine cash/wire we can't tie to an invoice
  return {
    matches: [],
    kind: 'unmatched',
    confidence: 0.0,
    reasons: ['No invoice matches this deposit'],
  };
}

// ---------------------------------------------------------------------------
// buildLedger
// ---------------------------------------------------------------------------
export function buildLedger(): Ledger {
  // --- AP rows ---
  const ap: ApRow[] = apInvoices.map(inv => {
    const result = matchInvoiceToPo(inv, purchaseOrders);
    return {
      invoice: inv,
      po: result.po,
      status: result.status,
      confidence: result.confidence,
      reasons: result.reasons,
    };
  });

  // --- AR rows ---
  // For each AR invoice, find the best bank txn match
  const arRows: ArRow[] = arInvoices.map(inv => {
    // Find all txn match results that include this invoice
    const txnMatches = bankStatement.txns
      .map(txn => ({ txn, result: matchPaymentToInvoices(txn, arInvoices) }))
      .filter(({ result }) => result.matches.some(m => m.invoice.id === inv.id));

    if (txnMatches.length === 0) {
      return {
        invoice: inv,
        kind: 'unmatched' as MatchKind,
        applied: 0,
        balance: inv.amount,
        confidence: 0.0,
        reasons: ['No payment received yet'],
      };
    }

    // Take the best match (highest confidence)
    const best = txnMatches.reduce((a, b) =>
      a.result.confidence >= b.result.confidence ? a : b
    );
    const matchEntry = best.result.matches.find(m => m.invoice.id === inv.id)!;
    const applied = matchEntry.applied;
    const balance = round2(inv.amount - applied);

    return {
      invoice: inv,
      kind: best.result.kind,
      applied,
      balance,
      confidence: best.result.confidence,
      reasons: best.result.reasons,
    };
  });

  // --- Exceptions ---
  const exceptions: Exception[] = [];

  // AP exceptions
  for (const row of ap) {
    if (row.status === 'needs_review') {
      const inv = row.invoice;
      if (inv.poRef == null || inv.poRef === '') {
        exceptions.push({
          type: 'ap_no_po',
          ref: inv.invoiceNo,
          description: `AP invoice ${inv.invoiceNo} has no purchase-order reference`,
        });
      } else {
        exceptions.push({
          type: 'ap_mismatch',
          ref: inv.invoiceNo,
          description: `AP invoice ${inv.invoiceNo}: ${row.reasons[0]}`,
        });
      }
    } else if (row.status === 'duplicate') {
      exceptions.push({
        type: 'ap_duplicate',
        ref: row.invoice.invoiceNo,
        description: `AP invoice ${row.invoice.invoiceNo} is a duplicate`,
      });
    }
  }

  // AR exceptions — partial payments and unmatched deposits
  for (const row of arRows) {
    if (row.kind === 'partial') {
      exceptions.push({
        type: 'ar_partial',
        ref: row.invoice.ref,
        description: `${row.invoice.ref}: ${row.reasons[0]}`,
      });
    }
  }

  // Unmatched deposits (positive customer deposits with no invoice match)
  for (const txn of bankStatement.txns) {
    if (txn.amount > 0) {
      const result = matchPaymentToInvoices(txn, arInvoices);
      if (result.kind === 'unmatched') {
        exceptions.push({
          type: 'ar_unmatched_deposit',
          ref: txn.id,
          description: `Bank txn ${txn.id} (${fmt(txn.amount)}): ${result.reasons[0]}`,
        });
      }
    }
  }

  // --- KPIs ---
  // Open AP: invoices not yet posted (needs_review or ready but not posted)
  const openApTotal = round2(
    ap
      .filter(r => r.invoice.erpStatus !== 'posted')
      .reduce((sum, r) => sum + r.invoice.amount, 0)
  );

  // Open AR: balance still outstanding
  const openArTotal = round2(
    arRows
      .filter(r => r.balance > 0)
      .reduce((sum, r) => sum + r.balance, 0)
  );

  // Reconciled MTD: sum of AR applied amounts
  const reconciledMtd = round2(
    arRows
      .filter(r => r.applied > 0)
      .reduce((sum, r) => sum + r.applied, 0)
  );

  const kpis: Kpis = {
    openApTotal,
    openArTotal,
    exceptionsCount: exceptions.length,
    reconciledMtd,
  };

  // --- Activity feed (most recent first) ---
  const activity: ActivityItem[] = [
    ...apInvoices.map(inv => ({
      date: inv.receivedAt,
      type: 'ap_received' as const,
      ref: inv.invoiceNo,
      amount: inv.amount,
      description: `AP invoice ${inv.invoiceNo} received from ${vendors.find(v => v.id === inv.vendorId)?.name ?? inv.vendorId}`,
    })),
    ...bankStatement.txns
      .filter(t => t.amount > 0)
      .map(txn => ({
        date: txn.date,
        type: 'ar_payment' as const,
        ref: txn.id,
        amount: txn.amount,
        description: txn.memo,
      })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return { ap, ar: arRows, exceptions, kpis, activity };
}
