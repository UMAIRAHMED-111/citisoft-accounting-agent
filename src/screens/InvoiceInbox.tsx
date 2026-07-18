import { useState } from 'react';
import { RefreshCw, Search, Link2 } from 'lucide-react';
import { Badge, Button, Card } from '../ds';
import { PageHeader } from '../components/PageHeader';
import { PdfViewer } from '../components/PdfViewer';
import { MatchLineItems } from '../components/MatchLineItems';
import { ErpSyncPanel } from '../components/ErpSyncPanel';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { apInvoices, vendors, purchaseOrders } from '../data/seed';
import { matchInvoiceToPo } from '../data/reconcile';
import type { Invoice } from '../data/types';
import { money, fmtDate } from '../lib/format';

// ---------------------------------------------------------------------------
// Status badge helpers
// ---------------------------------------------------------------------------
type ApDisplayStatus = 'auto_approved' | 'needs_review' | 'duplicate';

function apStatusBadge(status: ApDisplayStatus) {
  if (status === 'auto_approved') return <Badge tone="success">Auto-approved</Badge>;
  if (status === 'needs_review') return <Badge tone="warning">Needs review</Badge>;
  return <Badge tone="neutral">Duplicate</Badge>;
}

function erpStatusBadge(status: Invoice['erpStatus'], docNo?: string | null) {
  if (status === 'posted')
    return (
      <Badge tone="success">
        Posted ·{' '}
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{docNo}</span>
      </Badge>
    );
  if (status === 'ready') return <Badge tone="brand">Ready to post</Badge>;
  return <Badge tone="warning">Held for review</Badge>;
}

// ---------------------------------------------------------------------------
// Inline OCR confidence tag
// ---------------------------------------------------------------------------
function ConfTag({ pct }: { pct: number }) {
  const color =
    pct >= 90 ? 'var(--accent)' : pct >= 70 ? 'var(--warning-600)' : 'var(--rose-600)';
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        color,
        background: pct >= 90 ? 'var(--blue-050)' : pct >= 70 ? 'var(--warning-050)' : 'var(--rose-050)',
        borderRadius: 'var(--radius-xs)',
        padding: '1px 5px',
        marginLeft: 6,
        whiteSpace: 'nowrap',
      }}
    >
      {pct}%
    </span>
  );
}

// ---------------------------------------------------------------------------
// OCR fields card
// ---------------------------------------------------------------------------
interface OcrCardProps {
  invoice: Invoice;
}

function OcrFieldsCard({ invoice }: OcrCardProps) {
  const [rerunning, setRerunning] = useState(false);

  async function handleRerun() {
    setRerunning(true);
    await new Promise(r => setTimeout(r, 900));
    setRerunning(false);
  }

  const vendor = vendors.find(v => v.id === invoice.vendorId);
  const noPo = invoice.poRef == null;

  const fieldRow = (
    label: string,
    value: string,
    conf: number,
    flagged?: boolean,
    flagMsg?: string
  ) => (
    <div
      key={label}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        padding: 'var(--space-3) 0',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-caption)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--text-muted)',
          minWidth: 110,
          paddingTop: 1,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontFamily: label === 'Amount' || label === 'Invoice no.' ? 'var(--font-mono)' : 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            fontWeight: 'var(--fw-medium)',
            color: flagged ? 'var(--rose-600)' : 'var(--text-strong)',
          }}
        >
          {rerunning ? <Skeleton w={120} h={14} /> : value}
          {!rerunning && <ConfTag pct={conf} />}
        </span>
        {flagged && !rerunning && flagMsg && (
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-caption)',
              color: 'var(--rose-600)',
              marginTop: 2,
            }}
          >
            {flagMsg}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card padding={20} style={{ marginBottom: 0 }}>
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-strong)',
          }}
        >
          OCR-extracted fields
        </span>
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<RefreshCw size={13} style={rerunning ? { animation: 'spin 0.7s linear infinite' } : {}} />}
          onClick={handleRerun}
          disabled={rerunning}
        >
          {rerunning ? 'Re-running…' : 'Re-run extraction'}
        </Button>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Fields */}
      <div>
        {fieldRow('Vendor', vendor?.name ?? invoice.vendorId, 98)}
        {fieldRow('Invoice no.', invoice.invoiceNo, 99)}
        {fieldRow('Amount', money(invoice.amount, invoice.currency), 97)}
        {fieldRow('Invoice date', fmtDate(invoice.receivedAt), 95)}
        {fieldRow(
          'PO reference',
          noPo ? 'Not found' : (invoice.poRef ?? '—'),
          noPo ? 22 : 94,
          noPo,
          noPo ? 'No PO reference found on the document' : undefined
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Detail panel (right side)
// ---------------------------------------------------------------------------
function InvoiceDetail({ invoice }: { invoice: Invoice }) {
  const vendor = vendors.find(v => v.id === invoice.vendorId);
  const match = matchInvoiceToPo(invoice, purchaseOrders);
  const poItems = match.po?.lineItems ?? [];
  const hasPo = match.po != null;
  const apStatus: ApDisplayStatus =
    match.status === 'auto_approved' ? 'auto_approved' :
    match.status === 'needs_review'  ? 'needs_review' :
    'duplicate';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* ── 1. Invoice header ── */}
      <div
        style={{
          padding: 'var(--space-5) var(--space-6)',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-h4)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text-strong)',
                marginBottom: 'var(--space-1)',
              }}
            >
              {vendor?.name ?? invoice.vendorId}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-caption)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-3)',
              }}
            >
              {invoice.invoiceNo}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {apStatusBadge(apStatus)}
              {erpStatusBadge(invoice.erpStatus, invoice.erpDocNo)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-h3)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text-strong)',
                letterSpacing: '-0.01em',
              }}
            >
              {money(invoice.amount, invoice.currency)}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-caption)',
                color: 'var(--text-muted)',
                marginTop: 'var(--space-1)',
              }}
            >
              Due {fmtDate(invoice.dueDate)}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. OCR fields ── */}
      <OcrFieldsCard invoice={invoice} />

      {/* ── 3. PDF viewer ── */}
      <PdfViewer
        url={invoice.pdfUrl}
        title={`${vendor?.name ?? invoice.vendorId} — Invoice ${invoice.invoiceNo}`}
        defaultOpen={false}
      />

      {/* ── 4. Line-item matching ── */}
      <Card padding={20} style={{ marginBottom: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-strong)',
            marginBottom: 'var(--space-5)',
          }}
        >
          Line-item matching
        </div>

        {hasPo ? (
          <MatchLineItems
            invoiceItems={invoice.lineItems}
            poItems={poItems}
          />
        ) : (
          <EmptyState
            icon={<Search size={22} />}
            title="No purchase order raised"
            body="This is a services invoice with no PO reference. Attach or raise a PO before approving."
            cta={
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<Link2 size={14} />}
                onClick={() => {/* affordance only */}}
              >
                Find / attach PO
              </Button>
            }
          />
        )}
      </Card>

      {/* ── 5. ERP sync ── */}
      <ErpSyncPanel invoice={invoice} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Invoice list row
// ---------------------------------------------------------------------------
interface ListRowProps {
  invoice: Invoice;
  apStatus: ApDisplayStatus;
  selected: boolean;
  onClick: () => void;
}

function InvoiceListRow({ invoice, apStatus, selected, onClick }: ListRowProps) {
  const vendor = vendors.find(v => v.id === invoice.vendorId);
  const [hover, setHover] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 'var(--space-4) var(--space-5)',
        cursor: 'pointer',
        background: selected
          ? 'var(--surface-brand-tint)'
          : hover
          ? 'var(--surface-sunken)'
          : 'var(--surface-card)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background var(--dur-fast) var(--ease-out)',
        outline: 'none',
      }}
      onFocus={e => { e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--focus-ring)'; }}
      onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-body-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: selected ? 'var(--accent)' : 'var(--text-strong)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: 'var(--space-1)',
            }}
          >
            {vendor?.name ?? invoice.vendorId}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-caption)',
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-2)',
            }}
          >
            {invoice.invoiceNo}
          </div>
          {apStatusBadge(apStatus)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-body-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-strong)',
            textAlign: 'right',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {money(invoice.amount, invoice.currency)}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function InvoiceInbox() {
  const [selectedId, setSelectedId] = useState<string>(apInvoices[0].id);

  // Pre-compute statuses once
  const rowData = apInvoices.map(inv => {
    const m = matchInvoiceToPo(inv, purchaseOrders);
    const apStatus: ApDisplayStatus =
      m.status === 'auto_approved' ? 'auto_approved' :
      m.status === 'needs_review'  ? 'needs_review' :
      'duplicate';
    return { invoice: inv, apStatus };
  });

  const selected = apInvoices.find(i => i.id === selectedId) ?? apInvoices[0];

  return (
    <div>
      <PageHeader
        title="Invoice inbox"
        subtitle="Review incoming AP invoices, verify PO matching, and post to your ERP"
      />

      {/* Split layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
          minHeight: 0,
        }}
      >
        {/* LEFT: invoice list */}
        <div
          style={{
            position: 'sticky',
            top: 24,
            maxWidth: 380,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          {/* List header */}
          <div
            style={{
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body-sm)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-strong)',
              }}
            >
              {apInvoices.length} invoices
            </span>
            <Badge tone="warning">
              {rowData.filter(r => r.apStatus === 'needs_review').length} pending
            </Badge>
          </div>

          {/* Rows */}
          {rowData.map(({ invoice, apStatus }) => (
            <InvoiceListRow
              key={invoice.id}
              invoice={invoice}
              apStatus={apStatus}
              selected={invoice.id === selectedId}
              onClick={() => setSelectedId(invoice.id)}
            />
          ))}
        </div>

        {/* RIGHT: detail panel */}
        <div>
          <InvoiceDetail key={selected.id} invoice={selected} />
        </div>
      </div>
    </div>
  );
}
