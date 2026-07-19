import React from 'react';
import { ChevronDown, ChevronRight, Link2Off, AlertCircle, PlusCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { Skeleton } from '../components/Skeleton';
import { Tabs } from '../ds/Tabs';
import { Badge } from '../ds/Badge';
import { Button } from '../ds/Button';
import { Dialog } from '../ds/Dialog';
import { Input } from '../ds/Input';
import { Select } from '../ds/Select';
import { useToast } from '../components/ToastHost';
import { bankStatement, arInvoices } from '../data/seed';
import { matchPaymentToInvoices, buildLedger } from '../data/reconcile';
import { useLedgerVersion, mutateSeed } from '../data/store';
import { useSimulatedLoad } from '../lib/useSimulatedLoad';
import { money, fmtDate, daysOverdue } from '../lib/format';
import { SearchField, Pager } from '../components/TableControls';

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

// Negative-amount rows — "not a customer receipt" signal in their reasons
function isNotAReceipt(row: MatchRow): boolean {
  return row.txn.amount <= 0 || row.reasons.some(r => r.toLowerCase().includes('not a customer receipt'));
}

// ---------------------------------------------------------------------------
// Tab filter logic
// ---------------------------------------------------------------------------
type TabKey = 'all' | 'matched' | 'partial' | 'unmatched';

function filterRows(rows: MatchRow[], tab: TabKey): MatchRow[] {
  if (tab === 'all') return rows;
  if (tab === 'matched') return rows.filter(r => (r.kind === 'exact' || r.kind === 'lump') && !isNotAReceipt(r));
  if (tab === 'partial') return rows.filter(r => r.kind === 'partial');
  if (tab === 'unmatched') return rows.filter(r => r.kind === 'unmatched' && !isNotAReceipt(r));
  return rows;
}

// ---------------------------------------------------------------------------
// Summary totals
// ---------------------------------------------------------------------------
function computeTotals(rows: MatchRow[]) {
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
function ExpandedDetail({ row, onMatchManually }: { row: MatchRow; onMatchManually: (row: MatchRow) => void }) {
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
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<Link2Off size={13} />}
            onClick={() => onMatchManually(row)}
          >
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
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--text-muted)', margin: 0 }}>
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
// AR overview band (improved)
// ---------------------------------------------------------------------------
const TODAY_DATE = new Date('2026-07-18');

interface ArOverviewBandProps {
  totals: { applied: number; unapplied: number; excluded: number };
}

function ArOverviewBand({ totals }: ArOverviewBandProps) {
  const version = useLedgerVersion();
  const ledger = React.useMemo(() => buildLedger(), [version]);
  const arRows = ledger.ar;

  const collectedTotal = arRows.reduce((s, r) => s + r.applied, 0);
  const outstandingTotal = arRows.reduce((s, r) => s + r.balance, 0);
  const overdueAmount = arRows
    .filter(r => r.balance > 0 && r.invoice.dueDate < TODAY_DATE)
    .reduce((s, r) => s + r.balance, 0);
  const overdueRows = arRows.filter(r => r.balance > 0 && r.invoice.dueDate < TODAY_DATE);
  const avgOverdue =
    overdueRows.length > 0
      ? Math.round(
          overdueRows.reduce((s, r) => s + daysOverdue(r.invoice.dueDate, TODAY_DATE), 0) /
            overdueRows.length,
        )
      : null;
  const invoicedTotal = arRows.reduce((s, r) => s + r.invoice.amount, 0);
  const collectionRate = invoicedTotal > 0 ? collectedTotal / invoicedTotal : 0;
  const pct = Math.round(collectionRate * 100);

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-6)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden',
      }}
    >
      {/* Main KPI row */}
      <div style={{ display: 'flex' }}>
        {/* Collected this period */}
        <div style={{ flex: 1, padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--text-muted)' }}>
            Collected this period
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: 'var(--success-500)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {money(collectedTotal)}
          </span>
        </div>

        <div style={{ width: 1, background: 'var(--border-subtle)', alignSelf: 'stretch' }} />

        {/* Outstanding receivables */}
        <div style={{ flex: 1, padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--text-muted)' }}>
            Outstanding receivables
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {money(outstandingTotal)}
          </span>
          {overdueAmount > 0 && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', color: 'var(--rose-600)', marginTop: 2 }}>
              of which {money(overdueAmount)} overdue
            </span>
          )}
        </div>

        <div style={{ width: 1, background: 'var(--border-subtle)', alignSelf: 'stretch' }} />

        {/* Collection rate */}
        <div style={{ flex: 1, padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--text-muted)' }}>
            Collection rate
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {pct}%
          </span>
          <div style={{ height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--border-default)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                borderRadius: 'var(--radius-pill)',
                background: 'var(--grad-brand)',
                transition: 'width 280ms var(--ease-out)',
              }}
            />
          </div>
        </div>

        <div style={{ width: 1, background: 'var(--border-subtle)', alignSelf: 'stretch' }} />

        {/* Avg days overdue */}
        <div style={{ flex: 1, padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--text-muted)' }}>
            Avg days overdue
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: avgOverdue != null ? 'var(--rose-600)' : 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {avgOverdue != null ? `${avgOverdue}d` : '—'}
          </span>
        </div>
      </div>

      {/* Muted detail line */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: 'var(--space-3) var(--space-6)',
          display: 'flex',
          gap: 'var(--space-6)',
          background: 'var(--surface-sunken)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', color: 'var(--text-muted)' }}>
          Unapplied cash:{' '}
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>{money(totals.unapplied)}</span>
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', color: 'var(--text-muted)' }}>
          Excluded (fees / outbound):{' '}
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)' }}>{money(totals.excluded)}</span>
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Record payment dialog
// ---------------------------------------------------------------------------
const PAYMENT_METHODS = [
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Bank transfer', label: 'Bank transfer' },
];

interface RecordPaymentDialogProps {
  open: boolean;
  onClose: () => void;
}

function RecordPaymentDialog({ open, onClose }: RecordPaymentDialogProps) {
  const toast = useToast();
  const version = useLedgerVersion();
  const ledger = React.useMemo(() => buildLedger(), [version]);

  const [method, setMethod] = React.useState('Cheque');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState('2026-07-18');
  const [reference, setReference] = React.useState('');
  const [invoiceId, setInvoiceId] = React.useState('');
  const [working, setWorking] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const openInvoices = ledger.ar.filter(r => r.balance > 0);

  React.useEffect(() => {
    if (openInvoices.length > 0 && !invoiceId) {
      setInvoiceId(openInvoices[0].invoice.ref);
    }
  }, [open]);

  function reset() {
    setMethod('Cheque');
    setAmount('');
    setDate('2026-07-18');
    setReference('');
    setInvoiceId(openInvoices[0]?.invoice.ref ?? '');
    setErrors({});
    setWorking(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    const errs: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!date) errs.date = 'Required';
    if (!invoiceId) errs.invoiceId = 'Select an invoice';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const selectedRow = openInvoices.find(r => r.invoice.ref === invoiceId);
    if (!selectedRow) return;

    setWorking(true);
    await new Promise(r => setTimeout(r, 900));

    const amt = Number(amount);
    const n = bankStatement.txns.length + 1;
    const memo = `${method} ${reference ? reference + ' ' : ''}${selectedRow.invoice.customer}`;

    mutateSeed(() => {
      bankStatement.txns.push({
        id: `txn-manual-${n}`,
        date: new Date(date),
        amount: amt,
        memo,
        payerRef: invoiceId,
      });
      return invoiceId;
    });

    toast.push({
      tone: 'success',
      title: `Payment recorded — ${money(amt)} applied to ${invoiceId}`,
    });

    reset();
    onClose();
  }

  const invoiceOptions = openInvoices.map(r => ({
    value: r.invoice.ref,
    label: `${r.invoice.ref} — ${r.invoice.customer} (${money(r.balance)} open)`,
  }));

  return (
    <Dialog open={open} onClose={handleClose} title="Record payment" width={500}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Select
          label="Method"
          options={PAYMENT_METHODS}
          value={method}
          onChange={e => setMethod(e.target.value)}
          disabled={working}
        />
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          error={errors.amount}
          disabled={working}
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          error={errors.date}
          disabled={working}
        />
        <Input
          label="Reference (e.g. cheque number)"
          value={reference}
          onChange={e => setReference(e.target.value)}
          placeholder="e.g. CHQ-001234"
          disabled={working}
        />
        <Select
          label="Apply to"
          options={invoiceOptions}
          value={invoiceId}
          onChange={e => setInvoiceId(e.target.value)}
          error={errors.invoiceId}
          disabled={working}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <Button variant="ghost" size="md" onClick={handleClose} disabled={working}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} disabled={working}>
            {working ? 'Recording…' : 'Record payment'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Table row
// ---------------------------------------------------------------------------
function TxnRow({ row, onMatchManually }: { row: MatchRow; onMatchManually: (row: MatchRow) => void }) {
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
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded(x => !x);
          }
        }}
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
            <ExpandedDetail row={row} onMatchManually={onMatchManually} />
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
  const version = useLedgerVersion();
  const loading = useSimulatedLoad(500);
  const [tab, setTab] = React.useState<TabKey>('all');
  const [matchDialogRow, setMatchDialogRow] = React.useState<MatchRow | null>(null);
  const [recordPaymentOpen, setRecordPaymentOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const PAGE_SIZE = 10;
  const toast = useToast();

  // Derived rows — recomputed when agent mutations bump the ledger version.
  // Bank txns render in date order.
  const rows: MatchRow[] = React.useMemo(
    () =>
      [...bankStatement.txns]
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(t => ({
          txn: t,
          ...matchPaymentToInvoices(t, arInvoices),
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  );

  const totals = React.useMemo(() => computeTotals(rows), [rows]);
  const matchedCount = rows.filter(r => (r.kind === 'exact' || r.kind === 'lump') && !isNotAReceipt(r)).length;
  const partialCount = rows.filter(r => r.kind === 'partial').length;
  const unmatchedCount = rows.filter(r => r.kind === 'unmatched' && !isNotAReceipt(r)).length;

  // Candidate invoices for manual matching — anything not yet fully applied
  const openInvoices = React.useMemo(() => {
    const fullyApplied = new Set<string>();
    for (const row of rows) {
      for (const m of row.matches) {
        if (m.applied >= m.invoice.amount) fullyApplied.add(m.invoice.id);
      }
    }
    return arInvoices.filter(inv => !fullyApplied.has(inv.id));
  }, [rows]);

  function handleManualMatch(invoiceNo: string) {
    setMatchDialogRow(null);
    toast.push({
      tone: 'success',
      title: 'Matched manually',
      message: <>Deposit applied to <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{invoiceNo}</span>.</>,
    });
  }

  const tabItems = [
    { value: 'all', label: 'All', count: rows.length },
    { value: 'matched', label: 'Matched', count: matchedCount },
    { value: 'partial', label: 'Partial', count: partialCount },
    { value: 'unmatched', label: 'Unmatched', count: unmatchedCount },
  ];

  const visibleRows = filterRows(rows, tab);

  // Search within visible rows
  const searchedRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return visibleRows;
    return visibleRows.filter(row => {
      return row.txn.memo.toLowerCase().includes(q) ||
        (row.txn.payerRef ?? '').toLowerCase().includes(q);
    });
  }, [visibleRows, search]);

  // Reset page when tab/search changes
  const searchedPage = Math.min(page, Math.max(0, Math.ceil(searchedRows.length / PAGE_SIZE) - 1));
  const pageRows = searchedRows.slice(searchedPage * PAGE_SIZE, (searchedPage + 1) * PAGE_SIZE);

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

  if (loading) {
    return (
      <div>
        <PageHeader title="AR matching" subtitle="Bank deposits matched against open AR invoices — partial and unmatched receipts flagged for review" />
        <div style={{ display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-5)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
          <Skeleton w="25%" h={60} />
          <Skeleton w="25%" h={60} />
          <Skeleton w="25%" h={60} />
          <Skeleton w="25%" h={60} />
        </div>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 'var(--space-4)' }}>
              <Skeleton w={80} h={14} />
              <Skeleton w="40%" h={14} />
              <Skeleton w={80} h={14} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="AR matching"
        subtitle="Bank deposits matched against open AR invoices — partial and unmatched receipts flagged for review"
        actions={
          <Button
            variant="secondary"
            size="md"
            leadingIcon={<PlusCircle size={15} />}
            onClick={() => setRecordPaymentOpen(true)}
          >
            Record payment
          </Button>
        }
      />

      {/* AR overview band */}
      <ArOverviewBand totals={totals} />

      {/* Tabs */}
      <Tabs
        tabs={tabItems}
        value={tab}
        onChange={v => setTab(v as TabKey)}
        style={{ marginBottom: 'var(--space-5)' }}
      />

      {/* Search */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <SearchField
          value={search}
          onChange={v => { setSearch(v); setPage(0); }}
          placeholder="Search memo or reference…"
          style={{ maxWidth: 360 }}
        />
      </div>

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
        {searchedRows.length === 0 ? (
          <div style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)' }}>
            No transactions in this category.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 760 }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: 110 }} />
              <col />
              {/* memo column is flexible */}
              <col style={{ width: 130 }} />
              <col style={{ width: 170 }} />
              <col style={{ width: 130 }} />
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
              {pageRows.map(row => (
                <TxnRow key={row.txn.id} row={row} onMatchManually={setMatchDialogRow} />
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {searchedRows.length > PAGE_SIZE && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
          <Pager page={searchedPage} pageSize={PAGE_SIZE} total={searchedRows.length} onPage={setPage} />
        </div>
      )}

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

      {/* Record payment dialog */}
      <RecordPaymentDialog
        open={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
      />

      {/* Manual match dialog */}
      <Dialog
        open={matchDialogRow != null}
        onClose={() => setMatchDialogRow(null)}
        title="Match deposit manually"
        width={520}
      >
        {matchDialogRow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', lineHeight: 'var(--lh-relaxed)' }}>
              Apply the{' '}
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>
                {money(matchDialogRow.txn.amount)}
              </span>{' '}
              deposit from {fmtDate(matchDialogRow.txn.date)} to an open invoice:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {openInvoices.map(inv => (
                <div
                  key={inv.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-3) var(--space-4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-card)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)', fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                    {inv.invoiceNo}
                  </span>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inv.customer}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)', color: 'var(--text-strong)', flexShrink: 0 }}>
                    {money(inv.amount)}
                  </span>
                  <Button size="sm" variant="secondary" onClick={() => handleManualMatch(inv.invoiceNo)}>
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
