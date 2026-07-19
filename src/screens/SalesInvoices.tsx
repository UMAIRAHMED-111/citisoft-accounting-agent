import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileOutput, ChevronDown, ChevronRight, BellRing } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Skeleton } from '../components/Skeleton';
import { Badge } from '../ds/Badge';
import { Button } from '../ds/Button';
import { Dialog } from '../ds/Dialog';
import { Input } from '../ds/Input';
import { useToast } from '../components/ToastHost';
import { arInvoices } from '../data/seed';
import { buildLedger } from '../data/reconcile';
import type { ArRow } from '../data/reconcile';
import { useLedgerVersion, mutateSeed } from '../data/store';
import { useSimulatedLoad } from '../lib/useSimulatedLoad';
import { money, fmtDate, daysOverdue } from '../lib/format';
import { Tag } from '../ds/Tag';
import { SearchField, Pager } from '../components/TableControls';

const TODAY_DATE = new Date('2026-07-18');
const TODAY_STR = '2026-07-18';

// ---------------------------------------------------------------------------
// KPI band
// ---------------------------------------------------------------------------
interface KpiTileProps {
  label: string;
  value: React.ReactNode;
  caption?: React.ReactNode;
}

function KpiTile({ label, value, caption }: KpiTileProps) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-5) var(--space-6)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-caption)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--text-muted)',
          textTransform: 'none',
          letterSpacing: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--text-strong)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      {caption && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-caption)',
            color: 'var(--rose-600)',
            lineHeight: 'var(--lh-relaxed)',
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}

interface CollectionRateTileProps {
  rate: number;
}

function CollectionRateTile({ rate }: CollectionRateTileProps) {
  const pct = Math.round(rate * 100);
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-5) var(--space-6)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-caption)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--text-muted)',
        }}
      >
        Collection rate
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--text-strong)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {pct}%
      </span>
      <div
        style={{
          height: 4,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--border-default)',
          overflow: 'hidden',
          marginTop: 'var(--space-1)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 'var(--radius-pill)',
            background: 'var(--grad-brand)',
            transition: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'none'
              : 'width 280ms var(--ease-out)',
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
function StatusBadge({ row }: { row: ArRow }) {
  const { invoice, balance } = row;
  const isOverdue = balance > 0 && invoice.dueDate < TODAY_DATE;
  if (balance === 0) return <Badge tone="success">Paid</Badge>;
  if (isOverdue) {
    const n = daysOverdue(invoice.dueDate, TODAY_DATE);
    return <Badge tone="error">{`Overdue · ${n}d`}</Badge>;
  }
  if (row.applied > 0) return <Badge tone="warning">Partially paid</Badge>;
  return <Badge tone="neutral">Unpaid</Badge>;
}

// ---------------------------------------------------------------------------
// Row detail panel
// ---------------------------------------------------------------------------
function RowDetail({ row }: { row: ArRow }) {
  const navigate = useNavigate();
  const isOverdue = row.balance > 0 && row.invoice.dueDate < TODAY_DATE;

  return (
    <div
      style={{
        padding: 'var(--space-5) var(--space-8)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--surface-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {row.reasons.length === 0 || (row.kind === 'unmatched' && row.applied === 0) ? (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          No payments received yet
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {row.reasons.map((r, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-body-sm)',
                  color: 'var(--text-body)',
                  margin: 0,
                }}
              >
                {r}
              </p>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-6)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--surface-sunken)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-caption)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>
              Applied:{' '}
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>
                {money(row.applied)}
              </span>
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Balance:{' '}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: row.balance > 0 ? 'var(--text-strong)' : 'var(--success-500)',
                }}
              >
                {money(row.balance)}
              </span>
            </span>
          </div>
        </>
      )}
      {isOverdue && (
        <div>
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<BellRing size={13} />}
            onClick={() => navigate('/reminders')}
          >
            Send reminder
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table row
// ---------------------------------------------------------------------------
function InvoiceRow({ row }: { row: ArRow }) {
  const [expanded, setExpanded] = useState(false);
  const { invoice, applied, balance } = row;

  const cellBase: React.CSSProperties = {
    padding: 'var(--space-4) var(--space-5)',
    borderBottom: '1px solid var(--border-subtle)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-body-sm)',
    color: 'var(--text-body)',
    background: expanded ? 'var(--surface-brand-tint)' : 'transparent',
    transition: 'background 120ms var(--ease-out)',
    verticalAlign: 'middle',
  };

  return (
    <>
      <tr
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded(x => !x);
          }
        }}
        aria-expanded={expanded}
      >
        <td style={{ ...cellBase, width: 36, paddingRight: 0, color: 'var(--text-muted)' }}>
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </td>
        <td style={{ ...cellBase }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)', color: 'var(--accent)', fontWeight: 600 }}>
            {invoice.invoiceNo}
          </span>
          {invoice.source === 'manual' && (
            <span
              title="Recorded manually — not synced from the ERP"
              style={{
                marginLeft: 8,
                fontFamily: 'var(--font-sans)',
                fontSize: 10.5,
                fontWeight: 600,
                padding: '1px 6px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--surface-sunken)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-muted)',
                verticalAlign: 'middle',
              }}
            >
              Off-book
            </span>
          )}
        </td>
        <td style={{ ...cellBase }}>{invoice.customer}</td>
        <td style={{ ...cellBase, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {fmtDate(invoice.issuedDate)}
        </td>
        <td style={{ ...cellBase, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {fmtDate(invoice.dueDate)}
        </td>
        <td style={{ ...cellBase, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body-sm)', fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap', color: 'var(--text-strong)' }}>
          {money(invoice.amount)}
        </td>
        <td style={{ ...cellBase, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body-sm)', textAlign: 'right', whiteSpace: 'nowrap', color: applied > 0 ? 'var(--success-500)' : 'var(--text-faint)' }}>
          {applied > 0 ? money(applied) : '—'}
        </td>
        <td style={{ ...cellBase, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body-sm)', fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap', color: balance > 0 ? 'var(--text-strong)' : 'var(--success-500)' }}>
          {balance > 0 ? money(balance) : money(0)}
        </td>
        <td style={{ ...cellBase }}>
          <StatusBadge row={row} />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={9} style={{ padding: 0, borderBottom: '1px solid var(--border-subtle)' }}>
            <RowDetail row={row} />
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// New invoice dialog
// ---------------------------------------------------------------------------
interface NewInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  currentMaxRef: number;
  currentCount: number;
}

function NewInvoiceDialog({ open, onClose, currentMaxRef, currentCount }: NewInvoiceDialogProps) {
  const toast = useToast();
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [memo, setMemo] = useState('');
  const [working, setWorking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setCustomer('');
    setAmount('');
    setDueDate('');
    setMemo('');
    setErrors({});
    setWorking(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    const errs: Record<string, string> = {};
    if (!customer.trim()) errs.customer = 'Required';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!dueDate) errs.dueDate = 'Required';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setWorking(true);
    await new Promise(r => setTimeout(r, 900));

    const nextNum = currentMaxRef + 1;
    const nextRef = `AR-2026-${String(nextNum).padStart(4, '0')}`;
    const newCount = currentCount + 1;

    mutateSeed(() => {
      arInvoices.push({
        id: `ar-${newCount}`,
        customer: customer.trim(),
        invoiceNo: nextRef,
        amount: Number(amount),
        issuedDate: new Date(TODAY_STR),
        dueDate: new Date(dueDate),
        ref: nextRef,
        source: 'manual',
      });
      return nextRef;
    });

    toast.push({
      tone: 'success',
      title: `Off-book invoice ${nextRef} recorded for ${customer.trim()}`,
    });

    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Record off-book invoice" width={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-body-sm)',
          color: 'var(--text-muted)',
          lineHeight: 'var(--lh-normal)',
          margin: 0,
        }}>
          Sales invoices sync from your ERP automatically. Use this to record an
          invoice issued outside the ERP so collections and reconciliation still
          track it.
        </p>
        <Input
          label="Customer"
          value={customer}
          onChange={e => setCustomer(e.target.value)}
          placeholder="e.g. Acme Corp"
          error={errors.customer}
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
          label="Due date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          error={errors.dueDate}
          disabled={working}
        />
        <Input
          label="Memo (optional)"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="e.g. Project Phoenix — phase 2"
          disabled={working}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <Button variant="ghost" size="md" onClick={handleClose} disabled={working}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} disabled={working}>
            {working ? 'Issuing…' : 'Issue invoice'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Row status helper
// ---------------------------------------------------------------------------
function getRowStatus(row: ArRow): 'paid' | 'partial' | 'overdue' | 'unpaid' {
  const { invoice, balance, applied } = row;
  if (balance === 0) return 'paid';
  if (balance > 0 && invoice.dueDate < TODAY_DATE) return 'overdue';
  if (applied > 0) return 'partial';
  return 'unpaid';
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function SalesInvoices() {
  const version = useLedgerVersion();
  const loading = useSimulatedLoad(400);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid' | 'overdue'>('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const ledger = useMemo(() => buildLedger(), [version]);

  const arRows = ledger.ar;

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return arRows.filter(row => {
      const matchesSearch = !q ||
        row.invoice.customer.toLowerCase().includes(q) ||
        row.invoice.ref.toLowerCase().includes(q);
      const status = getRowStatus(row);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [arRows, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = filteredRows.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  // Status counts (full arRows, not filtered)
  const paidCount = arRows.filter(r => getRowStatus(r) === 'paid').length;
  const partialCount = arRows.filter(r => getRowStatus(r) === 'partial').length;
  const unpaidCount = arRows.filter(r => getRowStatus(r) === 'unpaid').length;
  const overdueCount = arRows.filter(r => getRowStatus(r) === 'overdue').length;

  // KPI derivations
  const invoicedTotal = arRows.reduce((s, r) => s + r.invoice.amount, 0);
  const collected = arRows.reduce((s, r) => s + r.applied, 0);
  const outstanding = arRows.reduce((s, r) => s + r.balance, 0);
  const overdueAmount = arRows
    .filter(r => r.balance > 0 && r.invoice.dueDate < TODAY_DATE)
    .reduce((s, r) => s + r.balance, 0);
  const collectionRate = invoicedTotal > 0 ? collected / invoicedTotal : 0;

  // For new invoice ref generation
  const maxRefNum = useMemo(() => {
    const nums = arInvoices.map(inv => {
      const m = inv.ref.match(/AR-2026-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    });
    return Math.max(...nums, 0);
  }, [version]);

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
        <PageHeader
          title="Sales invoices"
          subtitle="Invoices you've issued — collections tracked against bank receipts"
        />
        <div
          style={{
            display: 'flex',
            gap: 0,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-6)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {[1, 2, 3, 4].map((i, idx) => (
            <React.Fragment key={i}>
              {idx > 0 && <div style={{ width: 1, background: 'var(--border-subtle)', alignSelf: 'stretch' }} />}
              <div style={{ flex: 1, padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Skeleton w={80} h={12} />
                <Skeleton w={100} h={24} />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 'var(--space-4)' }}>
              <Skeleton w={120} h={14} />
              <Skeleton w="30%" h={14} />
              <Skeleton w={80} h={14} />
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
        title="Sales invoices"
        subtitle="Invoices you've issued — collections tracked against bank receipts"
        actions={
          <Button
            variant="primary"
            size="md"
            leadingIcon={<FileOutput size={16} />}
            onClick={() => setDialogOpen(true)}
          >
            Record off-book invoice
          </Button>
        }
      />

      {/* ERP sync status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        margin: 'calc(-1 * var(--space-4)) 0 var(--space-6)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-caption)',
        color: 'var(--text-muted)',
      }}>
        <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success-500)' }} />
        <span>Synced from Xero · Last sync 2 min ago</span>
      </div>

      {/* KPI band */}
      <div
        style={{
          display: 'flex',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-6)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {[0, 1, 2, 3].map((_, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <div style={{ width: 1, background: 'var(--border-subtle)', alignSelf: 'stretch' }} />
            )}
            {idx === 0 && <KpiTile label="Invoiced total" value={money(invoicedTotal)} />}
            {idx === 1 && <KpiTile label="Collected" value={money(collected)} />}
            {idx === 2 && (
              <KpiTile
                label="Outstanding"
                value={money(outstanding)}
                caption={overdueAmount > 0 ? `of which ${money(overdueAmount)} overdue` : undefined}
              />
            )}
            {idx === 3 && <CollectionRateTile rate={collectionRate} />}
          </React.Fragment>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <SearchField value={search} onChange={v => { setSearch(v); setPage(0); }} placeholder="Search customer or invoice…" />
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Tag active={statusFilter === 'all'} onClick={() => { setStatusFilter('all'); setPage(0); }}>All · {arRows.length}</Tag>
          <Tag active={statusFilter === 'paid'} onClick={() => { setStatusFilter('paid'); setPage(0); }}>Paid · {paidCount}</Tag>
          <Tag active={statusFilter === 'partial'} onClick={() => { setStatusFilter('partial'); setPage(0); }}>Partially paid · {partialCount}</Tag>
          <Tag active={statusFilter === 'unpaid'} onClick={() => { setStatusFilter('unpaid'); setPage(0); }}>Unpaid · {unpaidCount}</Tag>
          <Tag active={statusFilter === 'overdue'} onClick={() => { setStatusFilter('overdue'); setPage(0); }}>Overdue · {overdueCount}</Tag>
        </div>
      </div>

      {/* Invoice table */}
      <div
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto', minWidth: 860 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 36 }} />
                <th style={thStyle}>Invoice #</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Issued</th>
                <th style={thStyle}>Due</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Collected</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Balance</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(row => (
                <InvoiceRow key={row.invoice.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
        {filteredRows.length === 0 && (
          <div style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)' }}>
            {search ? `No matches for "${search}"` : 'No invoices in this category.'}
          </div>
        )}
        {filteredRows.length > PAGE_SIZE && (
          <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
            <Pager page={safePage} pageSize={PAGE_SIZE} total={filteredRows.length} onPage={setPage} />
          </div>
        )}
      </div>

      <NewInvoiceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        currentMaxRef={maxRefNum}
        currentCount={arInvoices.length}
      />
    </div>
  );
}
