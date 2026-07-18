import React from 'react';
import { BellRing, CheckCircle2, ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Card, Badge, Button, Switch, Toast } from '../ds';
import { arInvoices, TODAY } from '../data/seed';
import { money, fmtDate, daysOverdue } from '../lib/format';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a customer name to a plausible email slug, e.g. "Precision Parts LLC" → "precisionpartsllc" */
function customerEmailSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function reminderTo(customer: string): string {
  return `accounts@${customerEmailSlug(customer)}.com`;
}

function reminderSubject(invoiceNo: string): string {
  return `Payment reminder: ${invoiceNo}`;
}

function reminderBody(
  customer: string,
  invoiceNo: string,
  amount: number,
  dueDate: Date,
  days: number,
): string {
  const amtStr = money(amount);
  const dueDateStr = fmtDate(dueDate);
  return [
    `Hi ${customer},`,
    ``,
    `We wanted to follow up on invoice ${invoiceNo} for ${amtStr}, which was due on ${dueDateStr} — ${days} day${days === 1 ? '' : 's'} ago.`,
    ``,
    `If payment has already been sent, please disregard this note and let us know so we can update our records. If you have any questions about the invoice or need to make arrangements, we are happy to help.`,
    ``,
    `To pay online, you can use the link below:`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SentState {
  [invoiceId: string]: boolean;
}

interface AutoRemindState {
  [invoiceId: string]: boolean;
}

interface ToastItem {
  id: string;
  customer: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface InvoiceRowProps {
  customer: string;
  invoiceNo: string;
  amount: number;
  days: number;
  sent: boolean;
  selected: boolean;
  onClick: () => void;
}

function InvoiceRow({ customer, invoiceNo, amount, days, sent, selected, onClick }: InvoiceRowProps) {
  const [hover, setHover] = React.useState(false);

  const bg = selected
    ? 'var(--surface-brand-tint)'
    : hover
    ? 'var(--surface-sunken)'
    : 'transparent';

  const borderColor = selected ? 'var(--border-brand)' : 'transparent';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${borderColor}`,
        background: bg,
        cursor: 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        userSelect: 'none',
        outline: 'none',
      }}
    >
      {/* Top row: customer + sent badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-body-sm)',
          fontWeight: 600,
          color: 'var(--text-strong)',
          lineHeight: 'var(--lh-snug)',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {customer}
        </span>
        {sent && <Badge tone="success" dot>Sent</Badge>}
      </div>

      {/* Bottom row: invoice no + amount + days overdue */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-muted)',
          letterSpacing: '0.01em',
        }}>
          {invoiceNo}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-body)',
          }}>
            {money(amount)}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--rose-600)',
          }}>
            {days}d overdue
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Email draft card
// ---------------------------------------------------------------------------

interface EmailDraftProps {
  customer: string;
  invoiceNo: string;
  amount: number;
  dueDate: Date;
  days: number;
  sent: boolean;
  autoRemind: boolean;
  onAutoRemindChange: (v: boolean) => void;
  onSend: () => void;
}

function EmailDraft({
  customer,
  invoiceNo,
  amount,
  dueDate,
  days,
  sent,
  autoRemind,
  onAutoRemindChange,
  onSend,
}: EmailDraftProps) {
  const to = reminderTo(customer);
  const subject = reminderSubject(invoiceNo);
  const body = reminderBody(customer, invoiceNo, amount, dueDate, days);

  const fieldLabel: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-caption)',
    fontWeight: 700,
    color: 'var(--text-faint)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    width: 68,
    flexShrink: 0,
    paddingTop: 2,
  };

  const fieldValue: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-body-sm)',
    color: 'var(--text-body)',
    lineHeight: 'var(--lh-normal)',
    flex: 1,
  };

  const monoValue: React.CSSProperties = {
    ...fieldValue,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--text-muted)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h2 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-h4)',
          fontWeight: 700,
          color: 'var(--text-strong)',
          letterSpacing: 'var(--ls-snug)',
          marginBottom: 4,
        }}>
          Draft reminder
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-body-sm)',
          color: 'var(--text-muted)',
          lineHeight: 'var(--lh-normal)',
        }}>
          Review the draft below before sending. No email is sent until you confirm.
        </p>
      </div>

      {/* Email card */}
      <Card padding={0} elevated style={{ overflow: 'hidden' }}>
        {/* Email "chrome" header */}
        <div style={{
          background: 'var(--surface-sunken)',
          borderBottom: '1px solid var(--border-default)',
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {/* To */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={fieldLabel}>To</span>
            <span style={monoValue}>{to}</span>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Subject */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={fieldLabel}>Subject</span>
            <span style={{
              ...fieldValue,
              fontWeight: 600,
              color: 'var(--text-strong)',
            }}>
              {subject}
            </span>
          </div>
        </div>

        {/* Email body */}
        <div style={{ padding: '20px 20px 24px' }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--text-body)',
            lineHeight: 'var(--lh-relaxed)',
            whiteSpace: 'pre-line',
            marginBottom: 20,
          }}>
            {body}
          </div>

          {/* Pay link placeholder */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            background: 'var(--surface-sunken)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-muted)',
            marginBottom: 20,
          }}>
            <ExternalLink size={13} style={{ flexShrink: 0, color: 'var(--accent)' }} />
            <span>pay.citisoft.io/invoice/{invoiceNo.toLowerCase()}</span>
          </div>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--text-body)',
            lineHeight: 'var(--lh-relaxed)',
          }}>
            Thank you for your business.
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '20px 0' }} />

          {/* Invoice data summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16,
          }}>
            {[
              { label: 'Invoice', value: invoiceNo, mono: true },
              { label: 'Amount due', value: money(amount), mono: true },
              { label: 'Due date', value: fmtDate(dueDate), mono: true },
            ].map(({ label, value, mono }) => (
              <div key={label}>
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-faint)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
                  fontSize: 13,
                  fontWeight: mono ? 500 : 400,
                  color: 'var(--text-strong)',
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <Switch
          label="Auto-remind every 7 days"
          checked={autoRemind}
          onChange={(v) => onAutoRemindChange(v)}
          size="sm"
        />

        {sent ? (
          <Button
            variant="secondary"
            size="md"
            disabled
            leadingIcon={<CheckCircle2 size={16} />}
          >
            Reminder sent
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            leadingIcon={<BellRing size={16} />}
            onClick={onSend}
          >
            Send reminder
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast container
// ---------------------------------------------------------------------------

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9999,
      }}
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          tone="success"
          title="Reminder sent"
          onDismiss={() => onDismiss(t.id)}
          duration={5000}
        >
          Sent to {t.customer}.
        </Toast>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function Reminders() {
  // Derive overdue list live
  const overdueInvoices = arInvoices.filter(
    (inv) => daysOverdue(inv.dueDate, TODAY) > 0,
  );

  const [selectedId, setSelectedId] = React.useState<string>(
    overdueInvoices[0]?.id ?? '',
  );
  const [sentState, setSentState] = React.useState<SentState>({});
  const [autoRemind, setAutoRemind] = React.useState<AutoRemindState>({});
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const selectedInvoice = overdueInvoices.find((inv) => inv.id === selectedId) ?? null;

  function handleSend(invoiceId: string, customer: string) {
    setSentState((prev) => ({ ...prev, [invoiceId]: true }));
    const toastId = `${invoiceId}-${Date.now()}`;
    setToasts((prev) => [...prev, { id: toastId, customer }]);
  }

  function dismissToast(toastId: string) {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }

  // Empty state
  if (overdueInvoices.length === 0) {
    return (
      <div>
        <PageHeader
          title="Reminders"
          subtitle="Payment reminders for overdue AR invoices"
        />
        <EmptyState
          icon={<BellRing size={28} />}
          title="You are all caught up"
          body="No overdue invoices — no reminders needed right now."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Reminders"
        subtitle={`${overdueInvoices.length} overdue invoice${overdueInvoices.length === 1 ? '' : 's'} need${overdueInvoices.length === 1 ? 's' : ''} attention`}
      />

      {/* Two-pane layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: 24,
        alignItems: 'start',
      }}>
        {/* LEFT — overdue list */}
        <Card padding={12} style={{ position: 'sticky', top: 24 }}>
          {/* Column header */}
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-faint)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            padding: '4px 4px 10px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 8,
          }}>
            Overdue invoices
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {overdueInvoices.map((inv) => {
              const days = daysOverdue(inv.dueDate, TODAY);
              return (
                <InvoiceRow
                  key={inv.id}
                  customer={inv.customer}
                  invoiceNo={inv.invoiceNo}
                  amount={inv.amount}
                  days={days}
                  sent={!!sentState[inv.id]}
                  selected={inv.id === selectedId}
                  onClick={() => setSelectedId(inv.id)}
                />
              );
            })}
          </div>
        </Card>

        {/* RIGHT — email draft */}
        {selectedInvoice ? (
          <EmailDraft
            customer={selectedInvoice.customer}
            invoiceNo={selectedInvoice.invoiceNo}
            amount={selectedInvoice.amount}
            dueDate={selectedInvoice.dueDate}
            days={daysOverdue(selectedInvoice.dueDate, TODAY)}
            sent={!!sentState[selectedInvoice.id]}
            autoRemind={!!autoRemind[selectedInvoice.id]}
            onAutoRemindChange={(v) =>
              setAutoRemind((prev) => ({ ...prev, [selectedInvoice.id]: v }))
            }
            onSend={() => handleSend(selectedInvoice.id, selectedInvoice.customer)}
          />
        ) : null}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
