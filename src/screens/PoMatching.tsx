import { useState } from 'react';
import { AlertTriangle, CheckCircle2, FileQuestion, ThumbsUp, Flag } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { MatchLineItems } from '../components/MatchLineItems';
import { PdfViewer } from '../components/PdfViewer';
import { ErpSyncPanel } from '../components/ErpSyncPanel';
import { Badge, Button, Toast } from '../ds';
import { apInvoices, purchaseOrders, vendors } from '../data/seed';
import { matchInvoiceToPo } from '../data/reconcile';
import { money, fmtDate } from '../lib/format';
import type { Invoice } from '../data/types';

// ---------------------------------------------------------------------------
// Derive review items once at module level
// ---------------------------------------------------------------------------
interface ReviewItem {
  inv: Invoice;
  match: ReturnType<typeof matchInvoiceToPo>;
}

const reviewItems: ReviewItem[] = apInvoices
  .map(inv => ({ inv, match: matchInvoiceToPo(inv, purchaseOrders) }))
  .filter(r => r.match.status === 'needs_review');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function vendorName(vendorId: string): string {
  return vendors.find(v => v.id === vendorId)?.name ?? vendorId;
}

function matchBadgeTone(confidence: number): 'success' | 'warning' | 'error' {
  if (confidence >= 0.9) return 'success';
  if (confidence >= 0.5) return 'warning';
  return 'error';
}

function matchBadgeLabel(confidence: number, po?: { id: string }): string {
  if (confidence >= 0.9) return 'Auto-matched';
  if (!po) return 'No PO found';
  return 'Amount mismatch';
}

// ---------------------------------------------------------------------------
// Reason callout (full-border, no left stripe, AP-rose tone)
// ---------------------------------------------------------------------------
function ReasonCallout({ reasons }: { reasons: string[] }) {
  return (
    <div
      style={{
        border: '1px solid var(--rose-500)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--rose-050)',
        padding: 'var(--space-5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3)',
        }}
      >
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(214,57,79,0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--rose-500)',
          }}
        >
          <AlertTriangle size={14} />
        </span>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-body-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--rose-600)',
              margin: '0 0 var(--space-2) 0',
              lineHeight: 'var(--lh-snug)',
            }}
          >
            Review required
          </p>
          <ul
            style={{
              margin: 0,
              padding: '0 0 0 var(--space-4)',
              listStyle: 'disc',
            }}
          >
            {reasons.map((r, i) => (
              <li
                key={i}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-body-sm)',
                  color: 'var(--text-body)',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// No-PO empty state for MatchLineItems section
// ---------------------------------------------------------------------------
function NoPOState({ vendorName: vendor, invoiceNo }: { vendorName: string; invoiceNo: string }) {
  return (
    <div
      style={{
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        background: 'var(--surface-sunken)',
      }}
    >
      <FileQuestion
        size={32}
        style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-4)' }}
      />
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-body-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
          margin: '0 0 var(--space-2) 0',
        }}
      >
        No purchase order raised
      </p>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-caption)',
          color: 'var(--text-muted)',
          margin: 0,
          maxWidth: 320,
          lineHeight: 'var(--lh-relaxed)',
          marginInline: 'auto',
        }}
      >
        Invoice{' '}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{invoiceNo}</span>
        {' '}from {vendor} is a services invoice with no PO reference. Attach an existing PO or raise a new one to proceed.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Invoice selector (side list)
// ---------------------------------------------------------------------------
function InvoiceSelector({
  items,
  selectedId,
  onSelect,
  resolvedIds,
}: {
  items: ReviewItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  resolvedIds: Set<string>;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-overline)',
          fontWeight: 'var(--fw-bold)',
          letterSpacing: 'var(--ls-overline)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: '0 0 var(--space-3) 0',
        }}
      >
        Needs review
      </p>
      {items.map(({ inv, match }) => {
        const active = inv.id === selectedId;
        const resolved = resolvedIds.has(inv.id);
        return (
          <button
            key={inv.id}
            onClick={() => onSelect(inv.id)}
            style={{
              textAlign: 'left',
              background: active ? 'var(--blue-050)' : 'var(--surface-card)',
              border: active
                ? '1px solid rgba(43,121,186,0.35)'
                : '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              cursor: 'pointer',
              transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-1)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: active ? 'var(--accent)' : 'var(--text-strong)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {inv.invoiceNo}
              </span>
              {resolved ? (
                <CheckCircle2 size={13} style={{ color: 'var(--success-500)', flexShrink: 0 }} />
              ) : (
                <Badge tone={matchBadgeTone(match.confidence)} style={{ fontSize: 11, height: 18, padding: '0 6px' }}>
                  {matchBadgeLabel(match.confidence, match.po)}
                </Badge>
              )}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-caption)',
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {vendorName(inv.vendorId)}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-body)',
                marginTop: 'var(--space-1)',
              }}
            >
              {money(inv.amount)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Workspace panel for a single invoice
// ---------------------------------------------------------------------------
function InvoiceWorkspace({
  item,
  resolved,
  onResolve,
}: {
  item: ReviewItem;
  resolved: boolean;
  onResolve: (action: 'approve' | 'flag') => void;
}) {
  const { inv, match } = item;
  const vendor = vendorName(inv.vendorId);
  const hasNo = !match.po;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>

      {/* Section: invoice header card */}
      <div
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Top row: vendor + invoiceNo + status badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-5)',
            marginBottom: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-h3)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text-strong)',
              }}
            >
              {vendor}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
                marginLeft: 'var(--space-3)',
              }}
            >
              #{inv.invoiceNo}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {resolved && (
              <Badge tone="success" dot>Resolved</Badge>
            )}
            <Badge tone={matchBadgeTone(match.confidence)}>
              {matchBadgeLabel(match.confidence, match.po)}
            </Badge>
          </div>
        </div>

        {/* Meta row */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-8)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-5)',
          }}
        >
          {[
            { label: 'Amount', value: money(inv.amount), mono: true },
            { label: 'Due date', value: fmtDate(inv.dueDate), mono: false },
            { label: 'Received', value: fmtDate(inv.receivedAt), mono: false },
            ...(match.po ? [{ label: 'PO ref', value: match.po.id, mono: true }] : []),
            ...(match.po ? [{ label: 'PO total', value: money(match.po.total), mono: true }] : []),
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-overline)',
                  fontWeight: 'var(--fw-bold)',
                  letterSpacing: 'var(--ls-overline)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
                  fontSize: 'var(--fs-body-sm)',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--text-strong)',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Confidence meter */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-overline)',
              fontWeight: 'var(--fw-bold)',
              letterSpacing: 'var(--ls-overline)',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Match confidence
          </div>
          <ConfidenceMeter value={match.confidence} style={{ maxWidth: 320 }} />
        </div>
      </div>

      {/* Section: reason callout */}
      <ReasonCallout reasons={match.reasons} />

      {/* Section: line-item comparison or no-PO state */}
      <div
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-strong)',
            margin: '0 0 var(--space-5) 0',
          }}
        >
          Line-item comparison
        </p>
        {hasNo ? (
          <NoPOState vendorName={vendor} invoiceNo={inv.invoiceNo} />
        ) : (
          <MatchLineItems
            invoiceItems={inv.lineItems}
            poItems={match.po!.lineItems}
          />
        )}
      </div>

      {/* Section: PDF evidence */}
      <PdfViewer
        url={inv.pdfUrl}
        title={`${vendor} — Invoice ${inv.invoiceNo}`}
      />

      {/* Section: ERP hold panel */}
      <ErpSyncPanel invoice={inv} />

      {/* Section: action buttons */}
      {!resolved && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'flex-end',
            paddingTop: 'var(--space-2)',
          }}
        >
          <Button
            variant="secondary"
            size="md"
            onClick={() => onResolve('approve')}
          >
            <ThumbsUp size={15} style={{ marginRight: 6 }} />
            Approve anyway
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onResolve('flag')}
          >
            <Flag size={15} style={{ marginRight: 6 }} />
            Flag for vendor
          </Button>
        </div>
      )}

      {resolved && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            justifyContent: 'flex-end',
            paddingTop: 'var(--space-2)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--success-500)',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Decision recorded</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function PoMatching() {
  const [selectedId, setSelectedId] = useState<string>(
    reviewItems[0]?.inv.id ?? ''
  );
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; action: 'approve' | 'flag' } | null>(null);

  const selectedItem = reviewItems.find(r => r.inv.id === selectedId) ?? reviewItems[0];

  function handleResolve(action: 'approve' | 'flag') {
    if (!selectedItem) return;
    const inv = selectedItem.inv;
    const vendor = vendorName(inv.vendorId);
    const message =
      action === 'approve'
        ? `Invoice ${inv.invoiceNo} from ${vendor} approved for payment.`
        : `Invoice ${inv.invoiceNo} from ${vendor} flagged — vendor will be notified.`;
    setResolvedIds(prev => new Set([...prev, inv.id]));
    setToast({ message, action });
  }

  const unresolvedCount = reviewItems.filter(r => !resolvedIds.has(r.inv.id)).length;

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast overlay */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}>
          <Toast
            tone="success"
            title={toast.action === 'approve' ? 'Invoice approved' : 'Flagged for vendor'}
            onDismiss={() => setToast(null)}
            duration={5000}
          >
            {toast.message}
          </Toast>
        </div>
      )}

      <PageHeader
        title="PO matching"
        subtitle="Review AP invoices that require a decision before posting to the ERP."
        actions={
          unresolvedCount > 0 ? (
            <Badge tone="warning" dot>
              {unresolvedCount} pending
            </Badge>
          ) : (
            <Badge tone="success" dot>All resolved</Badge>
          )
        }
      />

      {reviewItems.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
          }}
        >
          <CheckCircle2 size={32} style={{ margin: '0 auto var(--space-4)', color: 'var(--success-500)' }} />
          <p style={{ margin: 0, fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
            No invoices need review
          </p>
          <p style={{ margin: 'var(--space-2) 0 0', color: 'var(--text-muted)' }}>
            All AP invoices matched their purchase orders automatically.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gap: 'var(--space-8)',
            alignItems: 'start',
          }}
        >
          {/* Left: invoice selector */}
          <div style={{ position: 'sticky', top: 24 }}>
            <InvoiceSelector
              items={reviewItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
              resolvedIds={resolvedIds}
            />
          </div>

          {/* Right: workspace */}
          {selectedItem && (
            <InvoiceWorkspace
              key={selectedItem.inv.id}
              item={selectedItem}
              resolved={resolvedIds.has(selectedItem.inv.id)}
              onResolve={handleResolve}
            />
          )}
        </div>
      )}
    </div>
  );
}
