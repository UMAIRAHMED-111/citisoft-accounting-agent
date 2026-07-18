import React from 'react';
import { ChevronDown, ChevronRight, Link2Off, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { Tabs } from '../ds/Tabs';
import { Badge } from '../ds/Badge';
import { Button } from '../ds/Button';
import { bankStatement, arInvoices } from '../data/seed';
import { matchPaymentToInvoices } from '../data/reconcile';
import { money, fmtDate } from '../lib/format';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type MatchKind = 'exact' | 'partial' | 'lump' | 'unmatched';

interface MatchRow {
  txn: (typeof bankStatement.txns)[number];
  matches: { invoice: (typeof arInvoices)[number]; applied: number }[];
  kind: MatchKind;
  confidence: number;
  reasons: string[];
}

// ---------------------------------------------------------------------------
// Compute rows once (outside component to avoid re-computation)
// ---------------------------------------------------------------------------
const rows: MatchRow[] = bankStatement.txns.map(t => ({
  txn: t,
  ...matchPaymentToInvoices(t, arInvoices),
}));

// Negative-amount rows — "not a customer receipt" signal in their reasons
function isNotAReceipt(row: MatchRow): boolean {
  return row.txn.amount <= 0 || row.reasons.some(r => r.toLowerCase().includes('not a customer receipt'));
}

// ---------------------------------------------------------------------------
// Tab filter logic
// ---------------------------------------------------------------------------
type TabKey = 'all' | 'matched' | 'partial' | 'unmatched';

function filterRows(tab: TabKey): MatchRow[] {
  if (tab === 'all') return rows;
  if (tab === 'matched') return rows.filter(r => (r.kind === 'exact' || r.kind === 'lump') && !isNotAReceipt(r));
  if (tab === 'partial') return rows.filter(r => r.kind === 'partial');
  if (tab === 'unmatched') return rows.filter(r => r.kind === 'unmatched' && !isNotAReceipt(r));
  return rows;
}

const matchedCount = rows.filter(r => (r.kind === 'exact' || r.kind === 'lump') && !isNotAReceipt(r)).length;
const partialCount = rows.filter(r => r.kind === 'partial').length;
const unmatchedCount = rows.filter(r => r.kind === 'unmatched' && !isNotAReceipt(r)).length;

// ---------------------------------------------------------------------------
// Summary totals
// ---------------------------------------------------------------------------
function computeTotals() {
  let applied = 0;
  let unapplied = 0;
  let excluded = 0;

  for (const row of rows) {
    if (isNotAReceipt(row)) {
      excluded += Math.abs(row.txn.amount);
    } else if (row.kind === 'exact' || row.kind === 'lump') {
      applied += row.txn.amount;
    } else if (row.kind === 'partial') {
      // Only the applied portion
      applied += row.matches.reduce((s, m) => s + m.applied, 0);
      // Remaining balance
      const totalInvoice = row.matches.reduce((s, m) => s + m.invoice.amount, 0);
      const totalApplied = row.matches.reduce((s, m) => s + m.applied, 0);
      unapplied += Math.round((totalInvoice - totalApplied) * 100) / 100;
    } else if (row.kind === 'unmatched') {
      unapplied += row.txn.amount;
    }
  }

  return { applied, unapplied, excluded };
}

const totals = computeTotals();

// ---------------------------------------------------------------------------
// Match kind badge
// ---------------------------------------------------------------------------
function KindBadge({ row }: { row: MatchRow }) {
  if (isNotAReceipt(row)) {
    return (
      <Badge tone="neutral" style={{ opacity: 0.65 }}>
        excluded
      </Badge>
    );
  }
  switch (row.kind) {
    case 'exact':
      return <Badge tone="success" dot>exact</Badge>;
    case 'partial':
      return <Badge tone="warning" dot>partial</Badge>;
    case 'lump':
      return <Badge tone="brand" dot>lump</Badge>;
    case 'unmatched':
      return <Badge tone="neutral" dot>unmatched</Badge>;
  }
}

// ---------------------------------------------------------------------------
// Expanded row detail
// ---------------------------------------------------------------------------
function ExpandedDetail({ row }: { row: MatchRow }) {
  const notReceipt = isNotAReceipt(row);

  const containerStyle: React.CSSProperties = {
    padding: 'var(--space-5) var(--space-8)',
    borderTop: '1px solid var(--border-subtle)',
    background: notReceipt ? 'var(--surface-sunken)' : 'var(--surface-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
    opacity: notReceipt ? 0.75 : 1,
  };

  // Not a receipt: bank fee / outbound
  if (notReceipt) {
    return (
      <div style={containerStyle}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', margin: 0 }}>
          Not a customer receipt (bank fee / outbound payment) — excluded from AR matching.
        </p>
      </div>
    );
  }

  // Unmatched customer deposit
  if (row.kind === 'unmatched') {
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <AlertCircle size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', margin: 0, marginBottom: 'var(--space-2)' }}>
              No invoice matches this deposit — left as unapplied cash.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', margin: 0 }}>
              This deposit will not be force-matched to any invoice. Review manually before applying.
            </p>
          </div>
        </div>
        <div>
          <Button variant="secondary" size="sm" leadingIcon={<Link2Off size={13} />}>
            Match manually
          </Button>
        </div>
        <ConfidenceMeterRow confidence={row.confidence} />
      </div>
    );
  }

  // Exact / lump / partial — show matched invoices
  return (
    <div style={containerStyle}>
      {/* Reasons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {row.reasons.map((r, i) => (
          <p key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', margin: 0 }}>
            {r}
          </p>
        ))}
      </div>

      {/* Invoice list */}
      {row.matches.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-overline)', margin: 0 }}>
            Applied to
          </p>
          {row.matches.map(({ invoice, applied }) => {
            const balance = Math.round((invoice.amount - applied) * 100) / 100;
            return (
              <div key={invoice.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)', color: 'var(--accent)', fontWeight: 600, minWidth: 120 }}>
                  {invoice.invoiceNo}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', flex: 1 }}>
                  {invoice.customer}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-strong)', textAlign: 'right' }}>
                  {money(applied)}
                </span>
                {balance > 0 && (
                  <Badge tone="warning" style={{ fontSize: 11 }}>
                    {money(balance)} open
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confidence */}
      <ConfidenceMeterRow confidence={row.confidence} />
    </div>
  );
}

function ConfidenceMeterRow({ confidence }: { confidence: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', minWidth: 70 }}>
        Confidence
      </span>
      <ConfidenceMeter value={confidence} style={{ flex: 1, maxWidth: 200 }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary strip
// ---------------------------------------------------------------------------
function SummaryStrip() {
  const items = [
    { label: 'Applied', value: totals.applied, tone: 'var(--success-500)' },
    { label: 'Unapplied cash', value: totals.unapplied, tone: 'var(--warning-600)' },
    { label: 'Excluded', value: totals.excluded, tone: 'var(--text-muted)' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-5)',
        padding: 'var(--space-5) var(--space-6)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-6)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && (
            <div style={{ width: 1, background: 'var(--border-subtle)', alignSelf: 'stretch' }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-caption)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-overline)',
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-h4)',
                fontWeight: 700,
                color: item.tone,
                letterSpacing: '-0.01em',
              }}
            >
              {money(item.value)}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table row
// ---------------------------------------------------------------------------
function TxnRow({ row }: { row: MatchRow }) {
  const [expanded, setExpanded] = React.useState(false);
  const notReceipt = isNotAReceipt(row);

  const memoText = row.txn.memo;
  const payerRef = row.txn.payerRef;

  // Matched invoice refs for the "Matched to" column
  const matchedRefs = row.matches.map(m => m.invoice.invoiceNo);

  const cellBase: React.CSSProperties = {
    padding: 'var(--space-4) var(--space-5)',
    borderBottom: '1px solid var(--border-subtle)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-body-sm)',
    color: notReceipt ? 'var(--text-muted)' : 'var(--text-body)',
    background: expanded ? 'var(--surface-brand-tint)' : 'transparent',
    transition: 'background var(--dur-fast) var(--ease-out)',
    verticalAlign: 'middle',
  };

  return (
    <>
      <tr
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {/* Chevron */}
        <td style={{ ...cellBase, width: 36, paddingRight: 0, color: 'var(--text-muted)' }}>
          {expanded
            ? <ChevronDown size={15} />
            : <ChevronRight size={15} />
          }
        </td>
        {/* Date */}
        <td style={{ ...cellBase, whiteSpace: 'nowrap', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)' }}>
          {fmtDate(row.txn.date)}
        </td>
        {/* Memo / payer */}
        <td style={{ ...cellBase, maxWidth: 320 }}>
          <span style={{ display: 'block', fontWeight: 500, color: notReceipt ? 'var(--text-muted)' : 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {memoText}
          </span>
          {payerRef && (
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>
              {payerRef}
            </span>
          )}
        </td>
        {/* Amount */}
        <td style={{ ...cellBase, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body-sm)', fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap', color: row.txn.amount < 0 ? 'var(--text-muted)' : notReceipt ? 'var(--text-muted)' : 'var(--text-strong)' }}>
          {money(row.txn.amount)}
        </td>
        {/* Matched to */}
        <td style={{ ...cellBase, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)' }}>
          {matchedRefs.length > 0 ? (
            <span style={{ color: 'var(--accent)' }}>
              {matchedRefs.join(' · ')}
            </span>
          ) : (
            <span style={{ color: 'var(--text-faint)' }}>—</span>
          )}
        </td>
        {/* Kind badge */}
        <td style={{ ...cellBase }}>
          <KindBadge row={row} />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} style={{ padding: 0, borderBottom: '1px solid var(--border-subtle)' }}>
            <ExpandedDetail row={row} />
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function ArMatching() {
  const [tab, setTab] = React.useState<TabKey>('all');

  const tabItems = [
    { value: 'all', label: 'All', count: rows.length },
    { value: 'matched', label: 'Matched', count: matchedCount },
    { value: 'partial', label: 'Partial', count: partialCount },
    { value: 'unmatched', label: 'Unmatched', count: unmatchedCount },
  ];

  const visibleRows = filterRows(tab);

  const thStyle: React.CSSProperties = {
    padding: 'var(--space-3) var(--space-5)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-caption)',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: 'var(--ls-overline)',
    borderBottom: '1px solid var(--border-default)',
    whiteSpace: 'nowrap',
    background: 'var(--surface-sunken)',
  };

  return (
    <div>
      <PageHeader
        title="AR matching"
        subtitle="Bank deposits matched against open AR invoices — partial and unmatched receipts flagged for review."
      />

      {/* Summary strip */}
      <SummaryStrip />

      {/* Tabs */}
      <Tabs
        tabs={tabItems}
        value={tab}
        onChange={v => setTab(v as TabKey)}
        style={{ marginBottom: 'var(--space-5)' }}
      />

      {/* Table */}
      <div
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden',
        }}
      >
        {visibleRows.length === 0 ? (
          <div style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)' }}>
            No transactions in this category.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: 110 }} />
              <col />
              {/* memo column is flexible */}
              <col style={{ width: 130 }} />
              <col style={{ width: 200 }} />
              <col style={{ width: 110 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 36 }} />
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Memo / payer</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                <th style={thStyle}>Matched to</th>
                <th style={thStyle}>Kind</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map(row => (
                <TxnRow key={row.txn.id} row={row} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footnote about exclusion logic */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-caption)',
          color: 'var(--text-muted)',
          marginTop: 'var(--space-4)',
          lineHeight: 'var(--lh-relaxed)',
        }}
      >
        Outbound payments and bank fees are excluded from AR matching — they are not customer receipts and are never force-matched to open invoices.
      </p>
    </div>
  );
}
