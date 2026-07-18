import { DollarSign, FileWarning, CheckCircle2, ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
import { buildLedger } from '../data/reconcile';
import { StatCard, Card } from '../ds';
import { money, shortMoney, fmtDate } from '../lib/format';
import { ExceptionCallout } from '../components/ExceptionCallout';

export default function Dashboard() {
  const { exceptions, kpis, activity } = buildLedger();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '24px 0 48px', maxWidth: 'var(--container-wide)', margin: '0 auto' }}>
      {/* Greeting header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-h2)',
          fontWeight: 'var(--fw-extrabold)',
          letterSpacing: 'var(--ls-tight)',
          color: 'var(--text-strong)',
          margin: 0,
          lineHeight: 'var(--lh-snug)',
        }}>
          {greeting}, Amara
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-body-sm)',
          color: 'var(--text-muted)',
          marginTop: 'var(--space-2)',
          lineHeight: 'var(--lh-normal)',
        }}>
          {exceptions.length > 0 ? (
            <>
              You have{' '}
              <strong style={{ color: 'var(--rose-500)' }}>
                {exceptions.length} {exceptions.length === 1 ? 'item' : 'items'}
              </strong>{' '}
              that need your review.
            </>
          ) : (
            'Everything is reconciled — no items need your attention.'
          )}
        </p>
      </div>

      {/* 4-up KPI row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        <StatCard
          label="Open AP"
          value={shortMoney(kpis.openApTotal)}
          icon={<DollarSign size={16} />}
        />
        <StatCard
          label="Open AR"
          value={shortMoney(kpis.openArTotal)}
          icon={<ArrowUpRight size={16} />}
        />
        <StatCard
          label="Exceptions"
          value={String(kpis.exceptionsCount)}
          icon={<FileWarning size={16} />}
          style={kpis.exceptionsCount > 0 ? {
            borderColor: 'var(--rose-500)',
            boxShadow: '0 0 0 1px var(--rose-500)',
          } : {}}
        />
        <StatCard
          label="Reconciled MTD"
          value={shortMoney(kpis.reconciledMtd)}
          icon={<TrendingUp size={16} />}
          accent
        />
      </div>

      {/* Two-column region */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
        alignItems: 'start',
      }}>
        {/* Left: Needs your attention */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-strong)',
            }}>
              Needs your attention
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: exceptions.length > 0 ? 'var(--rose-500)' : 'var(--text-muted)',
              fontWeight: 600,
            }}>
              {exceptions.length} {exceptions.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {exceptions.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 16px',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
              }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success-500)', flexShrink: 0 }} />
                All invoices and payments are reconciled.
              </div>
            ) : (
              exceptions.map((ex) => (
                <ExceptionCallout key={`${ex.type}-${ex.ref}`} exception={ex} />
              ))
            )}
          </div>
        </Card>

        {/* Right: Cash position + activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Cash position */}
          <Card padding={20}>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              margin: '0 0 14px',
            }}>
              Cash position
            </p>
            <CashBar label="Open AP" amount={kpis.openApTotal} max={Math.max(kpis.openApTotal, kpis.openArTotal)} color="var(--blue-mid)" />
            <div style={{ height: 10 }} />
            <CashBar label="Open AR" amount={kpis.openArTotal} max={Math.max(kpis.openApTotal, kpis.openArTotal)} color="var(--blue-azure)" />
            <div style={{ marginTop: 14, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>Net exposure</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>
                  {money(Math.abs(kpis.openArTotal - kpis.openApTotal))}
                </span>
              </div>
            </div>
          </Card>

          {/* Recent activity */}
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-strong)',
              }}>
                Recent activity
              </span>
            </div>
            <div>
              {activity.slice(0, 8).map((item, idx) => (
                <div
                  key={`${item.ref}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '11px 18px',
                    borderBottom: idx < Math.min(activity.length, 8) - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    marginTop: 2,
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.type === 'ar_payment' ? 'var(--success-050)' : 'var(--surface-brand-tint)',
                    color: item.type === 'ar_payment' ? 'var(--success-500)' : 'var(--accent)',
                  }}>
                    {item.type === 'ar_payment'
                      ? <ArrowDownLeft size={14} />
                      : <DollarSign size={14} />}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 13,
                      color: 'var(--text-body)',
                      lineHeight: 'var(--lh-snug)',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.description}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      margin: '2px 0 0',
                    }}>
                      {fmtDate(item.date)}
                    </p>
                  </div>
                  <span style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: item.type === 'ar_payment' ? 'var(--success-500)' : 'var(--text-strong)',
                  }}>
                    {money(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* Local sub-component: CashBar */
interface CashBarProps {
  label: string;
  amount: number;
  max: number;
  color: string;
}

function CashBar({ label, amount, max, color }: CashBarProps) {
  const pct = max > 0 ? Math.round((amount / max) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-strong)' }}>
          {money(amount)}
        </span>
      </div>
      <div style={{
        height: 8,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-sunken)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 'var(--radius-pill)',
          background: color,
          transition: prefersReducedMotion() ? 'none' : `width var(--dur-slow) var(--ease-out)`,
        }} />
      </div>
    </div>
  );
}
