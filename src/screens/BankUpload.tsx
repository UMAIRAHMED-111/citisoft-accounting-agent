import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { Button } from '../ds/Button';
import { Card } from '../ds/Card';
import { bankStatement } from '../data/seed';
import { money, fmtDate } from '../lib/format';

type Phase = 'idle' | 'parsing' | 'parsed';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function BankUpload() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function startParsing() {
    setPhase('parsing');
    setProgress(0);

    if (prefersReducedMotion()) {
      setProgress(100);
      setPhase('parsed');
      return;
    }

    // Animate progress over ~1.4s then reveal parsed state
    const startTime = performance.now();
    const duration = 1400;

    function tick(now: number) {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / duration, 1);
      // ease-out curve: 1 - (1 - t)^2
      const eased = 1 - Math.pow(1 - ratio, 2);
      const pct = Math.round(eased * 100);
      setProgress(pct);

      if (ratio < 1) {
        requestAnimationFrame(tick);
      } else {
        setProgress(100);
        // small settle pause so the bar reaches 100% visibly
        setTimeout(() => setPhase('parsed'), 120);
      }
    }

    requestAnimationFrame(tick);
  }

  // Statement renders in date order — parsed output should read chronologically
  const txns = [...bankStatement.txns].sort((a, b) => a.date.getTime() - b.date.getTime());
  const net = txns.reduce((sum, t) => sum + t.amount, 0);

  // Build columns for DataTable
  const columns = [
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
        <span style={{ color: 'var(--text-body)', fontSize: 14, maxWidth: 360, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.memo}
        </span>
      ),
    },
    {
      key: 'ref',
      header: 'Reference',
      render: (row: (typeof txns)[number]) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: row.payerRef ? 'var(--text-body)' : 'var(--text-faint)' }}>
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
        title="Bank statement upload"
        subtitle="Import a bank statement to match deposits against open AR invoices"
      />

      {/* ── Idle state ────────────────────────────────────────────── */}
      {phase === 'idle' && (
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <Card
            style={{
              border: '2px dashed var(--border-strong)',
              background: 'var(--surface-sunken)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-5)',
              padding: 'var(--space-12) var(--space-8)',
              textAlign: 'center',
              cursor: 'default',
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
                background: 'var(--surface-brand-tint)',
                color: 'var(--accent)',
                flexShrink: 0,
              }}
            >
              <Upload size={26} strokeWidth={1.6} />
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', fontWeight: 600, color: 'var(--text-strong)', margin: 0 }}>
                Drop a bank statement (PDF or CSV)
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', color: 'var(--text-muted)', margin: 0 }}>
                Supports JPMorgan Chase, Bank of America, Wells Fargo exports
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Button
                variant="primary"
                size="md"
                leadingIcon={<FileText size={16} />}
                onClick={startParsing}
              >
                Use sample statement
              </Button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-body-sm)',
                  color: 'var(--text-muted)',
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
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.csv,.ofx"
                style={{ display: 'none' }}
                onChange={() => startParsing()}
              />
            </div>
          </Card>
        </div>
      )}

      {/* ── Parsing state ─────────────────────────────────────────── */}
      {phase === 'parsing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
              chase-statement-jul-2026.pdf
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
              maxWidth: 480,
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
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)' }}>
              <Skeleton w={260} h={11} />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 120px 90px',
                  gap: 'var(--space-6)',
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  alignItems: 'center',
                }}
              >
                <Skeleton w={80} h={13} />
                <Skeleton w={`${60 + (i % 3) * 15}%`} h={13} />
                <Skeleton w={88} h={13} />
                <Skeleton w={60} h={13} />
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── Parsed state ──────────────────────────────────────────── */}
      {phase === 'parsed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* File chip (static) */}
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
              chase-statement-jul-2026.pdf
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
              <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{txns.length} transactions</span>
              {' · net '}
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: net >= 0 ? 'var(--text-strong)' : 'var(--text-muted)' }}>
                {money(net)}
              </span>
              {' · covering '}
              <span style={{ color: 'var(--text-body)' }}>{bankStatement.period}</span>
              {' · '}
              <span style={{ color: 'var(--text-body)' }}>{bankStatement.account}</span>
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
            <DataTable columns={columns} rows={txns} />
          </Card>
        </div>
      )}
    </div>
  );
}
