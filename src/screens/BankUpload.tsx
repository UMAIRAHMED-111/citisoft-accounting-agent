import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { Button } from '../ds/Button';
import { Card } from '../ds/Card';
import { Badge } from '../ds/Badge';
import { Dialog } from '../ds/Dialog';
import { bankStatement } from '../data/seed';
import { money, fmtDate } from '../lib/format';
import { useToast } from '../components/ToastHost';

type Phase = 'idle' | 'parsing' | 'parsed';

type PlaidState = 'disconnected' | 'linking' | 'connected';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── Seed history rows (local constants — do not touch src/data/seed.ts) ──────
interface HistoryRow {
  filename: string;
  period: string;
  uploaded: string;
  txns: number;
  matched: string;
  tone: 'success' | 'warning' | 'brand';
  label: string;
  isNew?: boolean;
}

const SEED_HISTORY: HistoryRow[] = [
  {
    filename: 'chase-statement-jun-2026.pdf',
    period: 'Jun 1–30, 2026',
    uploaded: 'Jul 1, 2026',
    txns: 14,
    matched: '14/14',
    tone: 'success',
    label: 'Processed',
  },
  {
    filename: 'chase-statement-may-2026.pdf',
    period: 'May 1–31, 2026',
    uploaded: 'Jun 2, 2026',
    txns: 11,
    matched: '10/11',
    tone: 'warning',
    label: '1 unmatched',
  },
  {
    filename: 'chase-statement-apr-2026.pdf',
    period: 'Apr 1–30, 2026',
    uploaded: 'May 1, 2026',
    txns: 12,
    matched: '12/12',
    tone: 'success',
    label: 'Processed',
  },
];

const BANKS = [
  { id: 'chase', name: 'JPMorgan Chase', monogram: 'JPM' },
  { id: 'boa', name: 'Bank of America', monogram: 'BOA' },
  { id: 'wf', name: 'Wells Fargo', monogram: 'WF' },
  { id: 'citi', name: 'Citibank', monogram: 'C' },
];

// ── History table columns ─────────────────────────────────────────────────────
const historyColumns = [
  {
    key: 'filename',
    header: 'File',
    render: (row: HistoryRow) => (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}>
        {row.filename}
      </span>
    ),
  },
  {
    key: 'period',
    header: 'Period',
    render: (row: HistoryRow) => (
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row.period}</span>
    ),
  },
  {
    key: 'uploaded',
    header: 'Uploaded',
    render: (row: HistoryRow) => (
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row.uploaded}</span>
    ),
  },
  {
    key: 'txns',
    header: 'Transactions',
    align: 'right' as const,
    render: (row: HistoryRow) => (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}>
        {row.txns}
      </span>
    ),
  },
  {
    key: 'matched',
    header: 'Matched',
    align: 'right' as const,
    render: (row: HistoryRow) => (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}>
        {row.matched}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: HistoryRow) => (
      <Badge tone={row.tone}>{row.label}</Badge>
    ),
  },
];

export default function BankUpload() {
  const navigate = useNavigate();
  const toast = useToast();
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>('statement.pdf');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Plaid connection state
  const [plaidState, setPlaidState] = useState<PlaidState>('disconnected');
  const [plaidDialogOpen, setPlaidDialogOpen] = useState(false);
  const [linkingBank, setLinkingBank] = useState<string | null>(null);

  // History rows — prepend when a new upload finishes
  const [history, setHistory] = useState<HistoryRow[]>(SEED_HISTORY);

  // Statement renders in date order
  const txns = [...bankStatement.txns].sort((a, b) => a.date.getTime() - b.date.getTime());
  const net = txns.reduce((sum, t) => sum + t.amount, 0);

  function startParsing(filename: string) {
    setUploadedFileName(filename);
    setPhase('parsing');
    setProgress(0);

    if (prefersReducedMotion()) {
      setProgress(100);
      finishParsing(filename);
      return;
    }

    const startTime = performance.now();
    const duration = 1400;

    function tick(now: number) {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - ratio, 2);
      const pct = Math.round(eased * 100);
      setProgress(pct);

      if (ratio < 1) {
        requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => finishParsing(filename), 120);
      }
    }

    requestAnimationFrame(tick);
  }

  function finishParsing(filename: string) {
    setPhase('parsed');
    const newRow: HistoryRow = {
      filename,
      period: 'Jul 1–18, 2026',
      uploaded: 'Today',
      txns: 9,
      matched: '6/9',
      tone: 'brand',
      label: 'Ready to match',
      isNew: true,
    };
    setHistory(prev => [newRow, ...prev]);
  }

  function handleFileSelected(file: File) {
    startParsing(file.name || 'statement.pdf');
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
  }

  // Plaid connection flow
  function openPlaidDialog() {
    setPlaidDialogOpen(true);
    setLinkingBank(null);
  }

  function pickBank(bankName: string) {
    setLinkingBank(bankName);

    if (prefersReducedMotion()) {
      completeLinking(bankName);
      return;
    }

    setTimeout(() => completeLinking(bankName), 900);
  }

  function completeLinking(bankName: string) {
    setPlaidDialogOpen(false);
    setLinkingBank(null);
    setPlaidState('connected');
    toast.push({
      tone: 'success',
      title: 'Bank feed connected — new transactions will sync automatically.',
    });
    // suppress unused warning for bankName (used in connected card display)
    void bankName;
  }

  // Transaction table columns
  const txnColumns = [
    {
      key: 'date',
      header: 'Date',
      render: (row: (typeof txns)[number]) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmtDate(row.date)}</span>
      ),
    },
    {
      key: 'memo',
      header: 'Memo',
      render: (row: (typeof txns)[number]) => (
        <span
          style={{
            color: 'var(--text-body)',
            fontSize: 14,
            maxWidth: 360,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.memo}
        </span>
      ),
    },
    {
      key: 'ref',
      header: 'Reference',
      render: (row: (typeof txns)[number]) => (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: row.payerRef ? 'var(--text-body)' : 'var(--text-faint)',
          }}
        >
          {row.payerRef ?? '—'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right' as const,
      render: (row: (typeof txns)[number]) => (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 600,
            color: row.amount < 0 ? 'var(--text-muted)' : 'var(--text-body)',
          }}
        >
          {money(row.amount)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Bank feed & uploads"
        subtitle="Connect a live bank feed or import a statement to match deposits against open AR invoices"
      />

      {/* ── Two-card ingestion row ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          marginBottom: 'var(--space-8)',
        }}
      >
        {/* LEFT — Bank feed (Plaid) */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {plaidState === 'disconnected' ? (
            <>
              {/* Plaid identity tile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'var(--slate-900)',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 0,
                      color: 'var(--white)',
                      lineHeight: 1,
                    }}
                  >
                    plaid
                  </span>
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--fs-body)',
                      fontWeight: 600,
                      color: 'var(--text-strong)',
                      margin: 0,
                    }}
                  >
                    Connect a bank feed
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-body-sm)',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                Live transaction sync via Plaid — receipts land here automatically.
              </p>

              <Button variant="primary" size="md" onClick={openPlaidDialog} style={{ alignSelf: 'flex-start' }}>
                Connect with Plaid
              </Button>
            </>
          ) : (
            /* Connected state */
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'var(--slate-900)',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 0,
                      color: 'var(--white)',
                      lineHeight: 1,
                    }}
                  >
                    plaid
                  </span>
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--fs-body)',
                        fontWeight: 600,
                        color: 'var(--text-strong)',
                        margin: 0,
                      }}
                    >
                      JPMorgan Chase — Checking ****4783
                    </p>
                    <Badge tone="success" dot>Linked</Badge>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--fs-caption)',
                      color: 'var(--text-muted)',
                      margin: 0,
                    }}
                  >
                    Syncs daily at 6:00 AM · Last sync just now
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color="var(--success-500)" strokeWidth={1.8} />
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-body-sm)',
                    color: 'var(--text-muted)',
                  }}
                >
                  Live feed active — new transactions sync automatically
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                style={{ alignSelf: 'flex-start', color: 'var(--text-muted)' }}
                onClick={() =>
                  toast.push({
                    tone: 'info',
                    title: 'Connection settings are managed by your administrator.',
                  })
                }
              >
                Manage connection
              </Button>
            </>
          )}
        </Card>

        {/* RIGHT — Upload a statement */}
        <Card
          style={{
            border: phase === 'idle'
              ? `2px dashed ${dragOver ? 'var(--border-brand)' : 'var(--border-strong)'}`
              : '1px solid var(--border-default)',
            background: phase === 'idle'
              ? dragOver ? 'var(--surface-brand-tint)' : 'var(--surface-sunken)'
              : 'var(--surface-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
            transition: 'border-color var(--dur) var(--ease-out), background var(--dur) var(--ease-out)',
          }}
          onDrop={phase === 'idle' ? handleDrop : undefined}
          onDragOver={phase === 'idle' ? handleDragOver : undefined}
          onDragLeave={phase === 'idle' ? handleDragLeave : undefined}
        >
          {phase === 'idle' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-5)',
                padding: 'var(--space-8) var(--space-4)',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-xl)',
                  background: dragOver ? 'var(--blue-100)' : 'var(--surface-brand-tint)',
                  color: 'var(--accent)',
                  flexShrink: 0,
                  transition: 'background var(--dur) var(--ease-out)',
                }}
              >
                <Upload size={26} strokeWidth={1.6} />
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-body)',
                    fontWeight: 600,
                    color: 'var(--text-strong)',
                    margin: 0,
                  }}
                >
                  Drop a bank statement (PDF or CSV)
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-body-sm)',
                    color: 'var(--text-muted)',
                    margin: 0,
                  }}
                >
                  Supports JPMorgan Chase, Bank of America, Wells Fargo exports
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <label
                  htmlFor="bank-file-input"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-body-sm)',
                    color: 'var(--accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                    textDecorationStyle: 'dotted',
                    textUnderlineOffset: 3,
                  }}
                >
                  or browse for a file
                </label>
                <input
                  id="bank-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.csv,.ofx"
                  style={{ display: 'none' }}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {phase === 'parsing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* File chip */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-5)',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xs)',
                  width: 'fit-content',
                }}
              >
                <FileText size={16} color="var(--accent)" strokeWidth={1.8} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}>
                  {uploadedFileName}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--accent)',
                    letterSpacing: '0.04em',
                  }}
                >
                  Parsing…
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 4,
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--border-default)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--grad-brand)',
                    transition: 'width 80ms var(--ease-out)',
                  }}
                />
              </div>

              {/* Skeleton rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}
                  >
                    <Skeleton w={70} h={12} />
                    <Skeleton w={`${50 + (i % 3) * 15}%`} h={12} />
                    <Skeleton w={60} h={12} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'parsed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* File chip — success */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-5)',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xs)',
                  width: 'fit-content',
                }}
              >
                <FileText size={16} color="var(--success-500)" strokeWidth={1.8} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}>
                  {uploadedFileName}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--success-500)',
                    letterSpacing: '0.04em',
                  }}
                >
                  Parsed
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-body-sm)',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{txns.length} transactions</span>
                {' · net '}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: net >= 0 ? 'var(--text-strong)' : 'var(--text-muted)',
                  }}
                >
                  {money(net)}
                </span>
                {' · '}
                <span style={{ color: 'var(--text-body)' }}>{bankStatement.period}</span>
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Parsed view: full transaction table + CTA ─────────────────────── */}
      {phase === 'parsed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          {/* Summary + action row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-5)',
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body-sm)',
                color: 'var(--text-muted)',
                margin: 0,
                lineHeight: 'var(--lh-relaxed)',
              }}
            >
              Ready to match against open invoices.
            </p>

            <Button
              variant="primary"
              size="md"
              trailingIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/ar-matching')}
            >
              Match against open invoices
            </Button>
          </div>

          {/* Transaction table */}
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <DataTable columns={txnColumns} rows={txns} />
          </Card>
        </div>
      )}

      {/* ── Upload history ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-caption)',
            fontWeight: 'var(--fw-medium)' as React.CSSProperties['fontWeight'],
            color: 'var(--text-muted)',
            margin: 0,
            letterSpacing: '0.01em',
          }}
        >
          Upload history
        </p>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <DataTable<HistoryRow>
            columns={historyColumns}
            rows={history}
          />
        </Card>
      </div>

      {/* ── Plaid institution picker dialog ───────────────────────────────── */}
      <Dialog
        open={plaidDialogOpen}
        onClose={() => { setPlaidDialogOpen(false); setLinkingBank(null); }}
        title="Connect your bank"
        width={440}
      >
        {linkingBank ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-5)',
              padding: 'var(--space-6) 0',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-pill)',
                background: 'var(--surface-brand-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}
              >
                {BANKS.find(b => b.name === linkingBank)?.monogram ?? '?'}
              </span>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 600,
                  color: 'var(--text-strong)',
                  margin: '0 0 4px',
                }}
              >
                Linking…
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-body-sm)',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}
              >
                Connecting to {linkingBank} via Plaid
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body-sm)',
                color: 'var(--text-muted)',
                margin: '0 0 12px',
              }}
            >
              Select your institution to continue
            </p>
            {BANKS.map(bank => (
              <button
                key={bank.id}
                type="button"
                onClick={() => pickBank(bank.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-sunken)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-card)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)';
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-sunken)',
                    border: '1px solid var(--border-subtle)',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {bank.monogram}
                  </span>
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-body-sm)',
                    fontWeight: 500,
                    color: 'var(--text-strong)',
                    flex: 1,
                  }}
                >
                  {bank.name}
                </span>
                <ChevronRight size={16} color="var(--text-faint)" strokeWidth={1.8} />
              </button>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
}
