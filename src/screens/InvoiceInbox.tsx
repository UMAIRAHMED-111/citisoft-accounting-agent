import { useMemo, useState } from 'react';
import React from 'react';
import { RefreshCw, Search, Link2 } from 'lucide-react';
import { Badge, Button, Card, Dialog } from '../ds';
import { Tag } from '../ds/Tag';
import { SearchField, Pager } from '../components/TableControls';
import { useToast } from '../components/ToastHost';
import { PageHeader } from '../components/PageHeader';
import { PdfViewer } from '../components/PdfViewer';
import { MatchLineItems } from '../components/MatchLineItems';
import { ErpSyncPanel } from '../components/ErpSyncPanel';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { apInvoices, vendors, purchaseOrders } from '../data/seed';
import { matchInvoiceToPo } from '../data/reconcile';
import { useLedgerVersion } from '../data/store';
import { useSimulatedLoad } from '../lib/useSimulatedLoad';
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
        {fieldRow('Received', fmtDate(invoice.receivedAt), 95)}
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
  const toast = useToast();
  const [poDialogOpen, setPoDialogOpen] = useState(false);

  function handleAttachPo(poId: string) {
    setPoDialogOpen(false);
    toast.push({
      tone: 'success',
      title: 'PO attached',
      message: (
        <>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{poId}</span>
          {' '}attached to invoice{' '}
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{invoice.invoiceNo}</span>.
        </>
      ),
    });
  }
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
                onClick={() => setPoDialogOpen(true)}
              >
                Find / attach PO
              </Button>
            }
          />
        )}
      </Card>

      {/* ── 5. ERP sync ── */}
      <ErpSyncPanel invoice={invoice} />

      {/* Attach-PO dialog */}
      <Dialog
        open={poDialogOpen}
        onClose={() => setPoDialogOpen(false)}
        title="Attach a purchase order"
        width={560}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', lineHeight: 'var(--lh-relaxed)' }}>
            Select an open purchase order to attach to invoice{' '}
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-strong)' }}>{invoice.invoiceNo}</span>:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {purchaseOrders.map(po => {
              const poVendor = vendors.find(v => v.id === po.vendorId);
              return (
                <div
                  key={po.id}
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
                    {po.id}
                  </span>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {poVendor?.name ?? po.vendorId} — {po.description}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)', color: 'var(--text-strong)', flexShrink: 0 }}>
                    {money(po.total)}
                  </span>
                  <Button size="sm" variant="secondary" onClick={() => handleAttachPo(po.id)}>
                    Select
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Dialog>
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
      }}
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
  const version = useLedgerVersion();
  const loading = useSimulatedLoad(450);
  const [selectedId, setSelectedId] = useState<string>(apInvoices[0].id);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'auto_approved' | 'needs_review'>('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  // Pre-compute statuses (re-runs when version changes due to agent mutations)
  const rowData = useMemo(
    () =>
      apInvoices.map(inv => {
        const m = matchInvoiceToPo(inv, purchaseOrders);
        const apStatus: ApDisplayStatus =
          m.status === 'auto_approved' ? 'auto_approved' :
          m.status === 'needs_review'  ? 'needs_review' :
          'duplicate';
        return { invoice: inv, apStatus };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  );

  // Filter by search + status
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rowData.filter(({ invoice, apStatus }) => {
      const vendor = vendors.find(v => v.id === invoice.vendorId);
      const matchesSearch = !q ||
        (vendor?.name ?? '').toLowerCase().includes(q) ||
        invoice.invoiceNo.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || apStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rowData, search, statusFilter]);

  // Reset page when filter/search changes
  const prevFilterRef = React.useRef({ search, statusFilter });
  if (prevFilterRef.current.search !== search || prevFilterRef.current.statusFilter !== statusFilter) {
    prevFilterRef.current = { search, statusFilter };
    if (page !== 0) setPage(0);
  }

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageData = filteredData.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  // Keep selection valid — if selected not in current page, select first of page
  const pageIds = new Set(pageData.map(r => r.invoice.id));
  const effectiveSelectedId = pageIds.has(selectedId) && filteredData.some(r => r.invoice.id === selectedId)
    ? selectedId
    : (pageData[0]?.invoice.id ?? apInvoices[0].id);

  const selected = apInvoices.find(i => i.id === effectiveSelectedId) ?? apInvoices[0];

  // Status counts for chips
  const allCount = rowData.length;
  const approvedCount = rowData.filter(r => r.apStatus === 'auto_approved').length;
  const reviewCount = rowData.filter(r => r.apStatus === 'needs_review').length;

  function handleSearch(val: string) {
    setSearch(val);
    setPage(0);
  }

  function handleStatusFilter(f: typeof statusFilter) {
    setStatusFilter(f);
    setPage(0);
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Vendor bills" subtitle="Incoming vendor invoices — review, match, and post to your ERP" />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) minmax(0, 1fr)', gap: 'var(--space-6)', alignItems: 'start' }}>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
              <Skeleton w={100} h={16} />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Skeleton w="70%" h={14} />
                <Skeleton w="40%" h={12} />
                <Skeleton w={80} h={20} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Skeleton h={120} />
            <Skeleton h={200} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Vendor bills"
        subtitle="Incoming vendor invoices — review, match, and post to your ERP"
      />

      {/* Split layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 380px) minmax(0, 1fr)',
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

          {/* Search + filter chips */}
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <SearchField value={search} onChange={handleSearch} placeholder="Search vendor or invoice…" />
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Tag active={statusFilter === 'all'} onClick={() => handleStatusFilter('all')}>All · {allCount}</Tag>
              <Tag active={statusFilter === 'auto_approved'} onClick={() => handleStatusFilter('auto_approved')}>Auto-approved · {approvedCount}</Tag>
              <Tag active={statusFilter === 'needs_review'} onClick={() => handleStatusFilter('needs_review')}>Needs review · {reviewCount}</Tag>
            </div>
          </div>

          {/* Rows */}
          {pageData.length === 0 ? (
            <div style={{ padding: 'var(--space-8) var(--space-5)', textAlign: 'center' }}>
              <EmptyState
                icon={<Search size={20} />}
                title={search ? `No matches for "${search}"` : 'No invoices'}
                body={search ? 'Try a different search term or clear the filter.' : 'No invoices in this category.'}
                cta={search ? (
                  <button
                    type="button"
                    onClick={() => handleSearch('')}
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}
                  >
                    Clear search
                  </button>
                ) : undefined}
              />
            </div>
          ) : (
            pageData.map(({ invoice, apStatus }) => (
              <InvoiceListRow
                key={invoice.id}
                invoice={invoice}
                apStatus={apStatus}
                selected={invoice.id === effectiveSelectedId}
                onClick={() => setSelectedId(invoice.id)}
              />
            ))
          )}

          {/* Pager */}
          {filteredData.length > PAGE_SIZE && (
            <div style={{ padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <Pager
                page={safePage}
                pageSize={PAGE_SIZE}
                total={filteredData.length}
                onPage={setPage}
              />
            </div>
          )}
        </div>

        {/* RIGHT: detail panel */}
        <div>
          <InvoiceDetail key={selected.id} invoice={selected} />
        </div>
      </div>
    </div>
  );
}
