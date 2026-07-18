import { buildLedger, type Ledger } from '../data/reconcile';
import { money, fmtDate, daysOverdue } from '../lib/format';
import type { AgentResponse } from './types';
import { TODAY } from '../data/seed';

type Handler = (ledger: Ledger) => AgentResponse;

// Normalize a ref string for fuzzy matching: lowercase, strip non-alphanumeric
function normalizeRef(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ---- Handlers ----

function handleAttention(ledger: Ledger): AgentResponse {
  const topExceptions = ledger.exceptions.slice(0, 5);
  const rows = topExceptions.map(e => [e.type.replace(/_/g, ' '), e.ref, e.description]);
  return {
    blocks: [
      {
        type: 'text',
        text: `You have ${ledger.kpis.exceptionsCount} item(s) needing attention. Open AP: ${money(ledger.kpis.openApTotal)}, Open AR: ${money(ledger.kpis.openArTotal)}.`,
      },
      {
        type: 'table',
        columns: ['Type', 'Ref', 'Description'],
        rows,
      },
    ],
  };
}

function handleOverdue(ledger: Ledger): AgentResponse {
  const overdue = ledger.ar.filter(r => r.balance > 0 && r.invoice.dueDate < TODAY);
  if (overdue.length === 0) {
    return { blocks: [{ type: 'text', text: 'No overdue AR invoices found.' }] };
  }
  const rows = overdue.map(r => [
    r.invoice.invoiceNo,
    r.invoice.customer,
    money(r.invoice.amount),
    money(r.balance),
    `${daysOverdue(r.invoice.dueDate, TODAY)} days`,
    fmtDate(r.invoice.dueDate),
  ]);
  return {
    blocks: [
      {
        type: 'text',
        text: `${overdue.length} overdue AR invoice(s) with total open balance of ${money(overdue.reduce((s, r) => s + r.balance, 0))}.`,
      },
      {
        type: 'table',
        columns: ['Invoice', 'Customer', 'Amount', 'Balance', 'Overdue', 'Due Date'],
        rows,
      },
    ],
  };
}

function handleUnmatched(ledger: Ledger): AgentResponse {
  const unmatched = ledger.exceptions.filter(e => e.type === 'ar_unmatched_deposit');
  const partial = ledger.exceptions.filter(e => e.type === 'ar_partial');
  const rows = [
    ...unmatched.map(e => ['Unmatched deposit', e.ref, e.description]),
    ...partial.map(e => ['Partial payment', e.ref, e.description]),
  ];
  if (rows.length === 0) {
    return { blocks: [{ type: 'text', text: 'No unmatched deposits or partial payments this month.' }] };
  }
  return {
    blocks: [
      {
        type: 'text',
        text: `${unmatched.length} unmatched deposit(s) and ${partial.length} partial payment(s) require review.`,
      },
      { type: 'table', columns: ['Category', 'Ref', 'Detail'], rows },
    ],
  };
}

function handleWhyNotApproved(q: string, ledger: Ledger): AgentResponse {
  const queryNorm = normalizeRef(q);
  // Strip common prefixes the user might add (inv, ap) to get the raw invoice number
  const queryStripped = queryNorm.replace(/^(why|wasnt|was|not|auto|approved|inv|ap)+/, '');

  // Try to find the AP row whose invoiceNo matches the query
  const apRow = ledger.ap.find(r => {
    const invNorm = normalizeRef(r.invoice.invoiceNo);
    return queryNorm.includes(invNorm) || queryStripped.includes(invNorm);
  });

  if (!apRow) {
    return {
      blocks: [
        {
          type: 'text',
          text: `I couldn't find an AP invoice matching your query. Here are all invoices needing review:`,
        },
        {
          type: 'table',
          columns: ['Invoice #', 'Vendor', 'Amount', 'Status', 'Reason'],
          rows: ledger.ap
            .filter(r => r.status === 'needs_review')
            .map(r => [r.invoice.invoiceNo, r.invoice.vendorId, money(r.invoice.amount), r.status, r.reasons[0]]),
        },
      ],
    };
  }

  const inv = apRow.invoice;
  const steps: string[] = [];

  if (apRow.status === 'auto_approved') {
    return {
      blocks: [
        {
          type: 'text',
          text: `Invoice ${inv.invoiceNo} was auto-approved. Amount ${money(inv.amount)} matched PO exactly.`,
        },
      ],
    };
  }

  steps.push(`Invoice ${inv.invoiceNo} received from vendor (amount: ${money(inv.amount)}).`);

  if (inv.poRef == null || inv.poRef === '') {
    steps.push('Looked up purchase order reference — none found on the invoice.');
    steps.push('Rule: invoices with no PO reference require manual review.');
    steps.push(`Result: flagged as needs_review — ${apRow.reasons[0]}.`);
  } else if (apRow.po) {
    const po = apRow.po;
    steps.push(`Looked up PO ${po.id} — total: ${money(po.total)}.`);
    steps.push(`Compared invoice amount ${money(inv.amount)} to PO total ${money(po.total)}.`);
    const delta = Math.abs(inv.amount - po.total);
    steps.push(`Delta of ${money(delta)} detected — exceeds zero tolerance.`);
    steps.push(`Result: flagged as needs_review — ${apRow.reasons[0]}.`);
  } else {
    steps.push(`PO reference ${inv.poRef} could not be found in the system.`);
    steps.push(`Result: flagged as needs_review — ${apRow.reasons[0]}.`);
  }

  return {
    blocks: [
      { type: 'reasoning', steps },
      {
        type: 'action',
        title: `Review invoice ${inv.invoiceNo}`,
        detail: `${apRow.reasons[0]}. Amount: ${money(inv.amount)}.`,
        cta: 'Open invoice',
      },
    ],
  };
}

function handleTotals(ledger: Ledger): AgentResponse {
  return {
    blocks: [
      {
        type: 'table',
        columns: ['Metric', 'Value'],
        rows: [
          ['Open AP Total', money(ledger.kpis.openApTotal)],
          ['Open AR Total', money(ledger.kpis.openArTotal)],
          ['Exceptions', String(ledger.kpis.exceptionsCount)],
          ['Reconciled MTD', money(ledger.kpis.reconciledMtd)],
        ],
      },
    ],
  };
}

function handleFallback(ledger: Ledger): AgentResponse {
  const top2 = ledger.exceptions.slice(0, 2);
  return {
    blocks: [
      {
        type: 'text',
        text: `I can help with: exceptions/attention items, overdue invoices, unmatched payments, why an invoice wasn't auto-approved, and open AP/AR totals. Here are the top issues right now:`,
      },
      ...top2.map(e => ({
        type: 'action' as const,
        title: e.ref,
        detail: e.description,
        cta: 'Review',
      })),
    ],
  };
}

// ---- Router ----

export function matchIntent(q: string): Handler {
  const lower = q.toLowerCase();

  if (/attention|today/.test(lower)) return handleAttention;
  if (/overdue/.test(lower)) return handleOverdue;
  if (/unmatched|deposit/.test(lower)) return handleUnmatched;
  if (/why|approv/.test(lower)) return ledger => handleWhyNotApproved(q, ledger);
  if (/open\s+ap|open\s+ar|total/.test(lower)) return handleTotals;
  return handleFallback;
}

// Convenience: build ledger once and run intent
export function runIntent(q: string): AgentResponse {
  const ledger = buildLedger();
  return matchIntent(q)(ledger);
}
