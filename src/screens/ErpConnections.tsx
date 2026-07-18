import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../ds/Card';
import { Badge } from '../ds/Badge';
import { Button } from '../ds/Button';
import { Switch } from '../ds/Switch';
import { Toast } from '../ds/Toast';

// ---------------------------------------------------------------------------
// ERP catalogue
// ---------------------------------------------------------------------------

interface ErpEntry {
  id: string;
  name: string;
  mark: string;  // short typographic mark for the monogram tile
  descriptor: string;
  // monogram bg: a CSS gradient or background string using only tokens/rgba
  monogramBg: string;
  monogramFg: string;
  connected: boolean;
}

const ERPS: ErpEntry[] = [
  {
    id: 'xero',
    name: 'Xero',
    mark: 'X',
    descriptor: 'Cloud accounting for mid-market businesses.',
    monogramBg: 'linear-gradient(135deg, var(--blue-azure) 0%, var(--blue-mid) 100%)',
    monogramFg: 'var(--text-on-brand)',
    connected: true,
  },
  {
    id: 'netsuite',
    name: 'Oracle NetSuite',
    mark: 'NS',
    descriptor: 'ERP suite for finance, inventory, and supply chain.',
    monogramBg: 'var(--slate-100)',
    monogramFg: 'var(--slate-700)',
    connected: false,
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics 365',
    mark: 'D',
    descriptor: 'Unified business apps across finance and operations.',
    monogramBg: 'var(--slate-100)',
    monogramFg: 'var(--slate-700)',
    connected: false,
  },
  {
    id: 'qbo',
    name: 'QuickBooks Online',
    mark: 'QB',
    descriptor: 'Accounting software for small and growing businesses.',
    monogramBg: 'var(--slate-100)',
    monogramFg: 'var(--slate-700)',
    connected: false,
  },
];

// ---------------------------------------------------------------------------
// Toast queue — local, portal-less (fixed overlay)
// ---------------------------------------------------------------------------

interface ToastItem {
  id: number;
  title: string;
}

let _toastId = 0;

// ---------------------------------------------------------------------------
// Monogram tile
// ---------------------------------------------------------------------------

function MonogramTile({
  mark,
  bg,
  fg,
  connected,
}: {
  mark: string;
  bg: string;
  fg: string;
  connected: boolean;
}) {
  const size = 52;
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 'var(--radius-md)',
    background: connected
      ? 'linear-gradient(135deg, var(--blue-azure) 0%, var(--blue-mid) 100%)'
      : bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: connected ? 'var(--shadow-brand)' : 'var(--shadow-xs)',
    transition: 'background var(--dur-slow) var(--ease-out), box-shadow var(--dur-slow) var(--ease-out)',
  };
  const textStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--fw-bold)' as React.CSSProperties['fontWeight'],
    fontSize: mark.length === 1 ? 22 : 16,
    letterSpacing: 'var(--ls-snug)',
    color: connected ? 'var(--text-on-brand)' : fg,
    lineHeight: 1,
    transition: 'color var(--dur-slow) var(--ease-out)',
    userSelect: 'none',
  };
  return (
    <div style={style}>
      <span style={textStyle}>{mark}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single ERP tile
// ---------------------------------------------------------------------------

function ErpTile({
  erp,
  onConnect,
}: {
  erp: ErpEntry & { connected: boolean };
  onConnect: (id: string) => void;
}) {
  const isXero = erp.id === 'xero';

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        padding: 'var(--space-6)',
        minHeight: 180,
        transition: 'border-color var(--dur-slow) var(--ease-out), box-shadow var(--dur-slow) var(--ease-out)',
        borderColor: erp.connected ? 'rgba(31,157,107,0.30)' : 'var(--border-default)',
        boxShadow: erp.connected
          ? '0 0 0 1px rgba(31,157,107,0.15), var(--shadow-sm)'
          : 'var(--shadow-sm)',
      }}
    >
      {/* Header row: monogram + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <MonogramTile
          mark={erp.mark}
          bg={erp.monogramBg}
          fg={erp.monogramFg}
          connected={erp.connected}
        />
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body)',
            fontWeight: 'var(--fw-semibold)' as React.CSSProperties['fontWeight'],
            color: 'var(--text-strong)',
            lineHeight: 'var(--lh-snug)',
            margin: 0,
          }}>
            {erp.name}
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-caption)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--lh-normal)',
            marginTop: 'var(--space-1)',
            margin: '2px 0 0',
          }}>
            {erp.descriptor}
          </p>
        </div>
      </div>

      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', marginTop: 'auto' }}>
        {erp.connected ? (
          <div>
            <Badge tone="success" dot>Connected</Badge>
            {isXero && (
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-caption)',
                color: 'var(--text-faint)',
                margin: '6px 0 0',
                lineHeight: 1,
              }}>
                Last sync 2 min ago
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onConnect(erp.id)}
          >
            Connect
          </Button>
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sync settings row
// ---------------------------------------------------------------------------

function SyncSettings() {
  const [autoPost, setAutoPost] = React.useState(true);
  const [twoWay, setTwoWay] = React.useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
    }}>
      {/* Section label */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-overline)',
        fontWeight: 'var(--fw-bold)' as React.CSSProperties['fontWeight'],
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--text-faint)',
        margin: 0,
      }}>
        Xero sync settings
      </p>

      <Card style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Row 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body-sm)',
                fontWeight: 'var(--fw-semibold)' as React.CSSProperties['fontWeight'],
                color: 'var(--text-strong)',
                margin: 0,
              }}>
                Auto-post reconciled bills
              </p>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-caption)',
                color: 'var(--text-muted)',
                marginTop: 'var(--space-1)',
                margin: '3px 0 0',
                lineHeight: 'var(--lh-normal)',
              }}>
                Approved bills are automatically posted to Xero after reconciliation.
              </p>
            </div>
            <Switch
              checked={autoPost}
              onChange={(v) => setAutoPost(v)}
              size="sm"
            />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Row 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body-sm)',
                fontWeight: 'var(--fw-semibold)' as React.CSSProperties['fontWeight'],
                color: 'var(--text-strong)',
                margin: 0,
              }}>
                Two-way sync
              </p>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-caption)',
                color: 'var(--text-muted)',
                marginTop: 'var(--space-1)',
                margin: '3px 0 0',
                lineHeight: 'var(--lh-normal)',
              }}>
                Changes made in Xero are reflected back in the agent's ledger view.
              </p>
            </div>
            <Switch
              checked={twoWay}
              onChange={(v) => setTwoWay(v)}
              size="sm"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function ErpConnections() {
  const [erps, setErps] = React.useState<ErpEntry[]>(ERPS);
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const handleConnect = (id: string) => {
    setErps((prev) =>
      prev.map((e) => (e.id === id ? { ...e, connected: true } : e))
    );
    const entry = erps.find((e) => e.id === id);
    if (entry) {
      const tid = ++_toastId;
      setToasts((prev) => [...prev, { id: tid, title: `${entry.name} connected` }]);
    }
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <PageHeader
        title="Connections"
        subtitle="Manage ERP and accounting system integrations"
      />

      {/* Intro line */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-body-sm)',
        color: 'var(--text-muted)',
        lineHeight: 'var(--lh-relaxed)',
        marginBottom: 'var(--space-8)',
        maxWidth: 680,
      }}>
        Your ledger stays the source of truth. The agent reads open POs and invoices
        from your ERP and writes reconciled bills and payments back.
      </p>

      {/* ERP grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-5)',
        marginBottom: 'var(--space-10)',
      }}>
        {erps.map((erp) => (
          <ErpTile key={erp.id} erp={erp} onConnect={handleConnect} />
        ))}
      </div>

      {/* Sync settings — Xero scoped */}
      <SyncSettings />

      {/* Toast overlay */}
      {toasts.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 'var(--space-7)',
          right: 'var(--space-7)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          alignItems: 'flex-end',
        }}>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              tone="success"
              title={t.title}
              duration={4000}
              onDismiss={() => dismissToast(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
