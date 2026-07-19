import { buildLedger, EXCEPTION_TYPE_LABELS, type Ledger } from '../data/reconcile';
import { money, fmtDate, daysOverdue } from '../lib/format';
import type { AgentResponse, AgentContext } from './types';
import { TODAY, vendors, apInvoices, arInvoices, purchaseOrders, bankStatement } from '../data/seed';
import { mutateSeed } from '../data/store';
import { matchInvoiceToPo } from '../data/reconcile';

type Handler = (ledger: Ledger) => AgentResponse;

// Normalize a ref string for fuzzy matching: lowercase, strip non-alphanumeric
function normalizeRef(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Pluralize a noun for a count — keeps "item(s)"-style output out of the UI
function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

// ---- Handlers ----

function handleAttention(ledger: Ledger): AgentResponse {
  const topExceptions = ledger.exceptions.slice(0, 5);
  const rows = topExceptions.map(e => [EXCEPTION_TYPE_LABELS[e.type], e.ref, e.description]);
  return {
    blocks: [
      {
        type: 'text',
        text: `You have ${plural(ledger.kpis.exceptionsCount, 'item')} needing attention. Open AP: ${money(ledger.kpis.openApTotal)}, Open AR: ${money(ledger.kpis.openArTotal)}.`,
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
        text: `${plural(overdue.length, 'overdue AR invoice')} with total open balance of ${money(overdue.reduce((s, r) => s + r.balance, 0))}.`,
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
        text: `${plural(unmatched.length, 'unmatched deposit')} and ${plural(partial.length, 'partial payment')} require review.`,
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
            .map(r => [r.invoice.invoiceNo, vendors.find(v => v.id === r.invoice.vendorId)?.name ?? r.invoice.vendorId, money(r.invoice.amount), r.status, r.reasons[0]]),
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
    steps.push(`Result: flagged for review — ${apRow.reasons[0]}.`);
  } else if (apRow.po) {
    const po = apRow.po;
    steps.push(`Looked up PO ${po.id} — total: ${money(po.total)}.`);
    steps.push(`Compared invoice amount ${money(inv.amount)} to PO total ${money(po.total)}.`);
    const delta = Math.abs(inv.amount - po.total);
    steps.push(`Delta of ${money(delta)} detected — exceeds zero tolerance.`);
    steps.push(`Result: flagged for review — ${apRow.reasons[0]}.`);
  } else {
    steps.push(`PO reference ${inv.poRef} could not be found in the system.`);
    steps.push(`Result: flagged for review — ${apRow.reasons[0]}.`);
  }

  return {
    blocks: [
      { type: 'reasoning', steps },
      {
        type: 'action',
        title: `Review invoice ${inv.invoiceNo}`,
        detail: `${apRow.reasons[0]}.`,
        cta: 'Open invoice',
        to: '/inbox',
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

// ---- Analytics intents ----

function handleRevenue(ledger: Ledger): AgentResponse {
  const receipts = bankStatement.txns.filter(t => t.amount > 0);
  const outgoings = bankStatement.txns.filter(t => t.amount < 0);
  const receiptsTotal = receipts.reduce((s, t) => s + t.amount, 0);
  const outgoingsTotal = outgoings.reduce((s, t) => s + Math.abs(t.amount), 0);
  const netCash = receiptsTotal - outgoingsTotal;
  const invoicedThisMonth = arInvoices
    .filter(inv => inv.issuedDate.getMonth() === TODAY.getMonth() && inv.issuedDate.getFullYear() === TODAY.getFullYear())
    .reduce((s, inv) => s + inv.amount, 0);
  return {
    blocks: [
      {
        type: 'text',
        text: `For ${bankStatement.period}: ${money(receiptsTotal)} came in across ${receipts.length} deposits, ${money(outgoingsTotal)} went out — net cash movement of ${money(netCash)}. Of the cash in, ${money(ledger.kpis.reconciledMtd)} is reconciled against invoices.`,
      },
      {
        type: 'table',
        columns: ['Measure', 'Amount'],
        rows: [
          ['Cash in (deposits)', money(receiptsTotal)],
          ['Cash out (fees + AP payments)', money(outgoingsTotal)],
          ['Net cash movement', money(netCash)],
          ['Reconciled against invoices', money(ledger.kpis.reconciledMtd)],
          ['New AR invoiced this month', money(invoicedThisMonth)],
          ['Still open (AR)', money(ledger.kpis.openArTotal)],
        ],
      },
    ],
  };
}

function handleTopCustomers(ledger: Ledger): AgentResponse {
  const byCustomer = new Map<string, { invoiced: number; open: number }>();
  for (const row of ledger.ar) {
    const cur = byCustomer.get(row.invoice.customer) ?? { invoiced: 0, open: 0 };
    cur.invoiced += row.invoice.amount;
    cur.open += row.balance;
    byCustomer.set(row.invoice.customer, cur);
  }
  const ranked = [...byCustomer.entries()].sort((a, b) => b[1].invoiced - a[1].invoiced);
  const [topName, topFigs] = ranked[0];
  return {
    blocks: [
      {
        type: 'text',
        text: `Your largest customer this period is ${topName} at ${money(topFigs.invoiced)} invoiced${topFigs.open > 0 ? ` (${money(topFigs.open)} still open)` : ' (fully paid)'}.`,
      },
      {
        type: 'table',
        columns: ['Customer', 'Invoiced', 'Open balance', 'Status'],
        rows: ranked.slice(0, 5).map(([name, f]) => [
          name,
          money(f.invoiced),
          f.open > 0 ? money(f.open) : '—',
          f.open === 0 ? 'Paid' : f.open === f.invoiced ? 'Unpaid' : 'Partially paid',
        ]),
      },
    ],
  };
}

function handleTopVendors(ledger: Ledger): AgentResponse {
  const byVendor = new Map<string, number>();
  for (const row of ledger.ap) {
    const name = vendors.find(v => v.id === row.invoice.vendorId)?.name ?? row.invoice.vendorId;
    byVendor.set(name, (byVendor.get(name) ?? 0) + row.invoice.amount);
  }
  const ranked = [...byVendor.entries()].sort((a, b) => b[1] - a[1]);
  const total = ranked.reduce((s, [, amt]) => s + amt, 0);
  return {
    blocks: [
      {
        type: 'text',
        text: `Your largest supplier by invoiced spend is ${ranked[0][0]} at ${money(ranked[0][1])} — ${Math.round((ranked[0][1] / total) * 100)}% of the ${money(total)} invoiced across ${ranked.length} vendors.`,
      },
      {
        type: 'table',
        columns: ['Vendor', 'Invoiced', 'Share'],
        rows: ranked.slice(0, 5).map(([name, amt]) => [name, money(amt), `${Math.round((amt / total) * 100)}%`]),
      },
    ],
  };
}

function handleWhoOwes(ledger: Ledger): AgentResponse {
  const owing = ledger.ar
    .filter(r => r.balance > 0)
    .sort((a, b) => b.balance - a.balance);
  if (owing.length === 0) {
    return { blocks: [{ type: 'text', text: 'No customers have an outstanding balance — everything is collected.' }] };
  }
  const total = owing.reduce((s, r) => s + r.balance, 0);
  return {
    blocks: [
      {
        type: 'text',
        text: `${owing.length} customers owe a combined ${money(total)}. ${owing[0].invoice.customer} owes the most at ${money(owing[0].balance)}.`,
      },
      {
        type: 'table',
        columns: ['Customer', 'Invoice', 'Balance', 'Due date'],
        rows: owing.map(r => [
          r.invoice.customer,
          r.invoice.invoiceNo,
          money(r.balance),
          fmtDate(r.invoice.dueDate),
        ]),
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
        text: `I can help with: exceptions and attention items, overdue invoices, unmatched payments, why an invoice wasn't auto-approved, open AP/AR totals, net revenue and cash, top customers and vendors, and outstanding balances. I can also attach POs, approve invoices, change due dates, and send reminders. The top issues right now:`,
      },
      ...top2.map(e => ({
        type: 'action' as const,
        title: `${EXCEPTION_TYPE_LABELS[e.type]} — ${e.ref}`,
        detail: e.description,
        cta: 'Review',
        to: e.type.startsWith('ap_') ? '/po-matching' : '/ar-matching',
      })),
    ],
  };
}

// ---- Screen-context summaries ----

function handleScreenSummary(ctx: AgentContext, ledger: Ledger): AgentResponse | null {
  const route = ctx.route;

  if (route === '/' || route === '') {
    // Dashboard
    return {
      blocks: [
        {
          type: 'text',
          text: `Dashboard overview: Open AP ${money(ledger.kpis.openApTotal)}, Open AR ${money(ledger.kpis.openArTotal)}, ${plural(ledger.kpis.exceptionsCount, 'exception')} flagged. Reconciled MTD: ${money(ledger.kpis.reconciledMtd)}.`,
        },
        {
          type: 'table',
          columns: ['KPI', 'Value'],
          rows: [
            ['Open AP', money(ledger.kpis.openApTotal)],
            ['Open AR', money(ledger.kpis.openArTotal)],
            ['Exceptions', String(ledger.kpis.exceptionsCount)],
            ['Reconciled MTD', money(ledger.kpis.reconciledMtd)],
          ],
        },
      ],
    };
  }

  if (route === '/inbox') {
    const total = apInvoices.length;
    const autoApproved = ledger.ap.filter(r => r.status === 'auto_approved').length;
    const needsReview = ledger.ap.filter(r => r.status === 'needs_review').length;
    const reviewRows = ledger.ap
      .filter(r => r.status === 'needs_review')
      .map(r => [r.invoice.invoiceNo, vendors.find(v => v.id === r.invoice.vendorId)?.name ?? r.invoice.vendorId, money(r.invoice.amount), r.reasons[0]]);
    return {
      blocks: [
        {
          type: 'text',
          text: `Invoice inbox: ${total} invoices total — ${autoApproved} auto-approved, ${needsReview} need review. A Plus Powder 78875 is ${money(Math.abs(951.96 - 900.00))} over its PO; Anago 13992 has no PO reference.`,
        },
        {
          type: 'table',
          columns: ['Invoice', 'Vendor', 'Amount', 'Reason'],
          rows: reviewRows,
        },
      ],
    };
  }

  if (route === '/ar-matching') {
    let applied = 0, unapplied = 0, excluded = 0;
    for (const row of ledger.ar) {
      applied += row.applied;
      if (row.balance > 0 && (row.kind === 'partial' || row.kind === 'unmatched')) unapplied += row.balance;
    }
    const excludedTxns = bankStatement.txns.filter(t => t.amount <= 0);
    excludedTxns.forEach(t => excluded += Math.abs(t.amount));
    return {
      blocks: [
        {
          type: 'text',
          text: `AR matching: ${money(applied)} applied, ${money(unapplied)} unapplied, ${money(excluded)} excluded (bank fees / outbound payments). ${ledger.ar.filter(r => r.kind === 'partial').length} partial and ${ledger.ar.filter(r => r.kind === 'unmatched' && r.invoice.amount > 0).length} unmatched deposits need review.`,
        },
      ],
    };
  }

  if (route === '/reminders') {
    const overdue = ledger.ar.filter(r => r.invoice.dueDate < TODAY && r.balance > 0);
    if (overdue.length === 0) {
      return { blocks: [{ type: 'text', text: 'Reminders: No overdue invoices — all caught up.' }] };
    }
    const rows = overdue.map(r => [
      r.invoice.invoiceNo,
      r.invoice.customer,
      money(r.balance),
      `${daysOverdue(r.invoice.dueDate, TODAY)} days`,
    ]);
    return {
      blocks: [
        {
          type: 'text',
          text: `Reminders: ${plural(overdue.length, 'overdue AR invoice')}. ${overdue.map(r => `${r.invoice.invoiceNo} (${r.invoice.customer}) — ${daysOverdue(r.invoice.dueDate, TODAY)} days overdue, ${money(r.balance)} outstanding`).join('; ')}.`,
        },
        { type: 'table', columns: ['Invoice', 'Customer', 'Balance', 'Overdue'], rows },
      ],
    };
  }

  if (route === '/connections') {
    const erps = [...new Set(vendors.map(v => v.erp))];
    return {
      blocks: [
        {
          type: 'text',
          text: `ERP connections: ${erps.join(', ')} connected (${vendors.length} vendors across ${erps.length} systems). All syncing normally.`,
        },
      ],
    };
  }

  if (route === '/bank-upload') {
    const txns = bankStatement.txns;
    const deposits = txns.filter(t => t.amount > 0);
    const total = deposits.reduce((s, t) => s + t.amount, 0);
    return {
      blocks: [
        {
          type: 'text',
          text: `Bank upload: Statement for ${bankStatement.account}, period ${bankStatement.period}. ${txns.length} transactions total, ${deposits.length} deposits totaling ${money(total)}.`,
        },
      ],
    };
  }

  if (route === '/po-matching') {
    const pending = ledger.ap.filter(r => r.status === 'needs_review');
    return {
      blocks: [
        {
          type: 'text',
          text: `PO matching: ${ledger.ap.filter(r => r.status === 'auto_approved').length} invoices auto-matched, ${pending.length} pending decisions. ${pending.map(r => r.invoice.invoiceNo).join(', ')} need manual review.`,
        },
      ],
    };
  }

  return null;
}

// ---- Action intent: Attach PO ----

function handleAttachPo(q: string, _ledger: Ledger): AgentResponse {
  // Parse "attach PO po-11166 to invoice 13992" or "set PO po-11166 on 78875"
  // ID must start with a digit so "PO po-11166" can't double-prefix.
  const poMatch = q.match(/po[-\s#]*(\d[\w-]*)/i);
  const invMatch = q.match(/invoice\s+(\w+)|inv(?:oice)?\s*#?\s*(\w+)/i);

  const poId = poMatch ? `po-${poMatch[1].toLowerCase()}` : null;
  const invoiceNo = invMatch ? (invMatch[1] || invMatch[2]) : null;

  if (!poId || !invoiceNo) {
    return {
      blocks: [{ type: 'text', text: 'Please specify both the PO ID (e.g. po-11166) and invoice number (e.g. 13992).' }],
    };
  }

  const inv = apInvoices.find(i => normalizeRef(i.invoiceNo) === normalizeRef(invoiceNo));
  if (!inv) {
    return { blocks: [{ type: 'text', text: `Invoice ${invoiceNo} not found.` }] };
  }

  const po = purchaseOrders.find(p => p.id === poId);
  if (!po) {
    return { blocks: [{ type: 'text', text: `Purchase order ${poId} not found.` }] };
  }

  const message = mutateSeed(() => {
    inv.poRef = poId;
    const result = matchInvoiceToPo(inv, purchaseOrders);
    if (result.status === 'auto_approved') {
      return `Attached ${poId} to invoice ${inv.invoiceNo}. The invoice now matches — auto-approved.`;
    } else {
      const delta = Math.abs(inv.amount - po.total);
      return `Attached ${poId} to invoice ${inv.invoiceNo}. Still ${money(delta)} over the PO total — kept in review.`;
    }
  });

  return {
    blocks: [
      { type: 'reasoning', steps: [`Found invoice ${inv.invoiceNo} (${money(inv.amount)}).`, `Found PO ${poId} (total: ${money(po.total)}).`, `Set poRef = ${poId} on the invoice.`, `Re-ran matching engine.`] },
      { type: 'action', title: `PO attached — ${inv.invoiceNo}`, detail: message, cta: 'View invoice', to: '/inbox' },
    ],
  };
}

// ---- Action intent: Update due date ----

function parseDate(raw: string): Date | null {
  // Try ISO format first
  const iso = raw.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return new Date(iso[1]);

  // Try "Aug 15" or "August 15" style
  const monthDay = raw.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{1,2})/i);
  if (monthDay) {
    const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const m = months.indexOf(monthDay[1].toLowerCase().slice(0, 3));
    if (m >= 0) {
      return new Date(2026, m, parseInt(monthDay[2]));
    }
  }

  // Try "MM/DD" or "MM/DD/YYYY"
  const slash = raw.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
  if (slash) {
    const year = slash[3] ? parseInt(slash[3]) : 2026;
    return new Date(year, parseInt(slash[1]) - 1, parseInt(slash[2]));
  }

  return null;
}

function handleUpdateDueDate(q: string, _ledger: Ledger): AgentResponse {
  const invMatch = q.match(/invoice\s+(\w+)|inv(?:oice)?\s*#?\s*(\w+)/i);
  const invoiceNo = invMatch ? (invMatch[1] || invMatch[2]) : null;

  if (!invoiceNo) {
    return { blocks: [{ type: 'text', text: 'Please specify the invoice number and the new due date.' }] };
  }

  const inv = apInvoices.find(i => normalizeRef(i.invoiceNo) === normalizeRef(invoiceNo));
  if (!inv) {
    return { blocks: [{ type: 'text', text: `Invoice ${invoiceNo} not found.` }] };
  }

  const date = parseDate(q);
  if (!date) {
    return { blocks: [{ type: 'text', text: 'Could not parse the date. Try formats like "Aug 15", "2026-08-15", or "08/15".' }] };
  }

  const message = mutateSeed(() => {
    const old = inv.dueDate;
    inv.dueDate = date;
    return `Due date for invoice ${inv.invoiceNo} changed from ${fmtDate(old)} to ${fmtDate(date)}.`;
  });

  return {
    blocks: [
      { type: 'reasoning', steps: [`Found invoice ${inv.invoiceNo}.`, `Parsed new due date: ${fmtDate(date)}.`, `Updated dueDate on the invoice record.`] },
      { type: 'action', title: `Due date updated — ${inv.invoiceNo}`, detail: message, cta: 'View invoice', to: '/inbox' },
    ],
  };
}

// ---- Action intent: Approve invoice ----

function handleApproveInvoice(q: string, _ledger: Ledger): AgentResponse {
  const invMatch = q.match(/invoice\s+(\w+)|inv(?:oice)?\s*#?\s*(\w+)/i);
  const invoiceNo = invMatch ? (invMatch[1] || invMatch[2]) : null;

  if (!invoiceNo) {
    return { blocks: [{ type: 'text', text: 'Please specify the invoice number to approve.' }] };
  }

  const inv = apInvoices.find(i => normalizeRef(i.invoiceNo) === normalizeRef(invoiceNo));
  if (!inv) {
    return { blocks: [{ type: 'text', text: `Invoice ${invoiceNo} not found.` }] };
  }

  if (inv.manualApproved) {
    return { blocks: [{ type: 'text', text: `Invoice ${inv.invoiceNo} is already manually approved.` }] };
  }

  const message = mutateSeed(() => {
    inv.manualApproved = true;
    inv.erpStatus = 'ready';
    return `Invoice ${inv.invoiceNo} (${money(inv.amount)}) approved by Amara Okafor and marked ready to post.`;
  });

  return {
    blocks: [
      { type: 'reasoning', steps: [`Found invoice ${inv.invoiceNo} (${money(inv.amount)}).`, 'Set manualApproved = true.', 'Set erpStatus = ready.', 'Matching engine will now return auto_approved with reason "Manually approved by Amara Okafor".'] },
      { type: 'action', title: `Invoice approved — ${inv.invoiceNo}`, detail: message, cta: 'View invoice', to: '/inbox' },
    ],
  };
}

// ---- Action intent: Send reminder ----

function handleSendReminder(q: string, _ledger: Ledger): AgentResponse {
  // Match AR invoice refs like AR-2026-0041 or just partial like 0041
  const refMatch = q.match(/AR-\d{4}-\d{4}/i) || q.match(/(\d{4})/);
  const refStr = refMatch ? refMatch[0] : null;

  let arInv = refStr ? arInvoices.find(i => {
    const norm = normalizeRef(i.invoiceNo);
    return norm.includes(normalizeRef(refStr)) || i.invoiceNo.toLowerCase().includes(refStr.toLowerCase());
  }) : null;

  if (!arInv) {
    // Try matching by ref field
    arInv = refStr ? arInvoices.find(i => i.ref.toLowerCase().includes(refStr.toLowerCase())) : null;
  }

  if (!arInv) {
    return { blocks: [{ type: 'text', text: 'Could not find that AR invoice. Try using the full invoice number like AR-2026-0041.' }] };
  }

  const message = mutateSeed(() => {
    arInv!.reminderSent = true;
    return `Reminder sent to accounts@${arInv!.customer.toLowerCase().replace(/[^a-z0-9]/g, '')}.com for ${arInv!.invoiceNo} (${money(arInv!.amount)}).`;
  });

  return {
    blocks: [
      { type: 'reasoning', steps: [`Found AR invoice ${arInv.invoiceNo} for ${arInv.customer}.`, `Flagged reminderSent = true.`, `Reminder email dispatched.`] },
      { type: 'action', title: `Reminder sent — ${arInv.invoiceNo}`, detail: message, cta: 'View reminders', to: '/reminders' },
    ],
  };
}

// ---- Router ----

export type IntentKind = 'normal' | 'action';

export function matchIntent(q: string, ctx?: AgentContext): { handler: Handler; kind: IntentKind } {
  const lower = q.toLowerCase();

  // Screen summary intent
  if (ctx && /describe|what am i|summarize|what'?s on this|overview/.test(lower)) {
    return {
      handler: (ledger) => handleScreenSummary(ctx, ledger) ?? handleFallback(ledger),
      kind: 'normal',
    };
  }

  // Action intents
  if (/attach\s+po|set\s+po|add\s+po/.test(lower)) {
    return { handler: (ledger) => handleAttachPo(q, ledger), kind: 'action' };
  }
  if (/change.*due|extend.*due|update.*due|set.*due/.test(lower)) {
    return { handler: (ledger) => handleUpdateDueDate(q, ledger), kind: 'action' };
  }
  if (/^approve\s+invoice|^approve\s+inv/.test(lower)) {
    return { handler: (ledger) => handleApproveInvoice(q, ledger), kind: 'action' };
  }
  if (/send.*reminder|remind/.test(lower)) {
    return { handler: (ledger) => handleSendReminder(q, ledger), kind: 'action' };
  }

  // Analytics intents
  if (/revenue|net\s+cash|cash\s+flow|cash\s+in|collected/.test(lower)) {
    return { handler: handleRevenue, kind: 'normal' };
  }
  if (/(top|highest|biggest|largest|best)\s+.*(customer|buyer|client)|(customer|buyer|client).*\b(most|top|highest)\b/.test(lower)) {
    return { handler: handleTopCustomers, kind: 'normal' };
  }
  if (/(top|highest|biggest|largest)\s+.*(vendor|supplier)|spend(ing)?\s+(the\s+)?most|biggest\s+spend|where.*money.*go/.test(lower)) {
    return { handler: handleTopVendors, kind: 'normal' };
  }
  if (/who\s+owes|owes?\s+(me|us|the\s+most)|outstanding\s+balance|receivable\s+balance/.test(lower)) {
    return { handler: handleWhoOwes, kind: 'normal' };
  }

  // Normal intents
  if (/attention|today/.test(lower)) return { handler: handleAttention, kind: 'normal' };
  if (/overdue/.test(lower)) return { handler: handleOverdue, kind: 'normal' };
  if (/unmatched|deposit/.test(lower)) return { handler: handleUnmatched, kind: 'normal' };
  if (/why|approv/.test(lower)) return { handler: (ledger) => handleWhyNotApproved(q, ledger), kind: 'normal' };
  if (/open\s+ap|open\s+ar|total/.test(lower)) return { handler: handleTotals, kind: 'normal' };
  return { handler: handleFallback, kind: 'normal' };
}

// Convenience: build ledger once and run intent
export function runIntent(q: string, ctx?: AgentContext): AgentResponse {
  const ledger = buildLedger();
  return matchIntent(q, ctx).handler(ledger);
}
