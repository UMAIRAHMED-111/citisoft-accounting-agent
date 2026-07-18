# Dashboard Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `src/screens/Dashboard.tsx` with a polished enterprise AP/AR dashboard that renders live ledger data through reusable `DataTable` and `ExceptionCallout` components.

**Architecture:** Three files — `Dashboard.tsx` (screen), `DataTable.tsx` (reusable data table), `ExceptionCallout.tsx` (reusable exception row). Dashboard calls `buildLedger()` once and fans data to KPI row, exception queue, cash-position bars, and activity feed. No chart libraries; CSS-only bar chart for cash position.

**Tech Stack:** React 18, TypeScript, Vite, lucide-react icons, DS primitives from `src/ds`, format helpers from `src/lib/format`, data from `src/data/reconcile`.

## Global Constraints

- Tokens only — NO raw hex values in `src/screens/Dashboard.tsx`, `src/components/DataTable.tsx`, `src/components/ExceptionCallout.tsx` (`grep -rnE "#[0-9a-fA-F]{3,6}"` must return empty for these files). Documented brand `rgba()` tints are OK.
- Rose (`var(--rose-500)`) ONLY on exception/problem affordances.
- ONE gradient moment: the Reconciled MTD StatCard icon chip (`accent` prop on `StatCard`).
- No `GradientText` except in the single permitted gradient moment.
- Sentence case everywhere; no emoji; mono font for all amounts and IDs.
- Motion 120–280ms ease-out (`var(--dur-fast)` / `var(--dur)` / `var(--dur-slow)` / `var(--ease-out)`).
- No left-stripe borders on exception callouts — full border only.
- All figures must come from `buildLedger()` — never hardcoded.
- `npm run build` must emit zero TypeScript errors.
- `npx vitest run` must stay green (23 tests pass — no new tests required, no existing tests broken).

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/DataTable.tsx` | Create | Reusable table: mono/right-aligned numeric cells, uppercase tracked header, hover row tint |
| `src/components/ExceptionCallout.tsx` | Create | Full-bordered callout: rose/warning icon chip, description, Review link |
| `src/screens/Dashboard.tsx` | Replace | Greeting header, 4-up KPI row, two-column (exceptions + cash+activity) |

---

## Task 1: DataTable component

**Files:**
- Create: `src/components/DataTable.tsx`

**Interfaces:**
- Produces:
  ```typescript
  export interface ColumnDef<R> {
    key: string;
    header: string;
    render: (row: R) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    mono?: boolean;   // if true, cells use var(--font-mono)
  }
  export interface DataTableProps<R> {
    columns: ColumnDef<R>[];
    rows: R[];
    onRowClick?: (row: R) => void;
    emptyMessage?: string;
  }
  export function DataTable<R>({ columns, rows, onRowClick, emptyMessage }: DataTableProps<R>): JSX.Element
  ```

- [ ] **Step 1: Create `src/components/DataTable.tsx`**

```tsx
import React from 'react';

export interface ColumnDef<R> {
  key: string;
  header: string;
  render: (row: R) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  mono?: boolean;
}

export interface DataTableProps<R> {
  columns: ColumnDef<R>[];
  rows: R[];
  onRowClick?: (row: R) => void;
  emptyMessage?: string;
}

export function DataTable<R>({ columns, rows, onRowClick, emptyMessage = 'No records' }: DataTableProps<R>) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-sunken)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align ?? 'left',
                  padding: '10px 16px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  borderBottom: '1px solid var(--border-default)',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  color: 'var(--text-muted)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: hoveredIdx === idx ? 'var(--surface-sunken)' : 'transparent',
                  cursor: onRowClick ? 'pointer' : 'default',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: `background var(--dur-fast) var(--ease-out)`,
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '12px 16px',
                      textAlign: col.align ?? 'left',
                      fontFamily: col.mono ? 'var(--font-mono)' : 'var(--font-sans)',
                      fontSize: col.mono ? 13 : 14,
                      color: 'var(--text-body)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors referencing `DataTable.tsx`.

---

## Task 2: ExceptionCallout component

**Files:**
- Create: `src/components/ExceptionCallout.tsx`
- Consumes: `Exception` type from `src/data/reconcile`

**Interfaces:**
- Produces:
  ```typescript
  export interface ExceptionCalloutProps {
    exception: Exception;
  }
  export function ExceptionCallout({ exception }: ExceptionCalloutProps): JSX.Element
  ```
  Renders a full-bordered callout (NOT a left-stripe). Border: `1px solid var(--rose-500)` when `type` starts with `ap_mismatch`/`ap_no_po`/`ap_duplicate`, or `1px solid var(--warning-500)` for AR types. Icon chip on the left (rose bg tint `var(--rose-050)`, rose icon color `var(--rose-500)` for AP; warning tint for AR). Description text center. "Review" link right-aligned, linking to `/po-matching` for AP types or `/ar-matching` for AR types.

- [ ] **Step 1: Create `src/components/ExceptionCallout.tsx`**

```tsx
import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Exception } from '../data/reconcile';

export interface ExceptionCalloutProps {
  exception: Exception;
}

export function ExceptionCallout({ exception }: ExceptionCalloutProps) {
  const isAp = exception.type.startsWith('ap_');
  const borderColor = isAp ? 'var(--rose-500)' : 'var(--warning-500)';
  const chipBg    = isAp ? 'var(--rose-050)' : 'var(--warning-050)';
  const chipColor = isAp ? 'var(--rose-500)' : 'var(--warning-500)';
  const reviewPath = isAp ? '/po-matching' : '/ar-matching';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        transition: `box-shadow var(--dur-fast) var(--ease-out)`,
      }}
    >
      {/* Icon chip */}
      <span
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-sm)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: chipBg,
          color: chipColor,
        }}
      >
        {isAp ? <AlertTriangle size={16} /> : <AlertCircle size={16} />}
      </span>

      {/* Description */}
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          color: 'var(--text-body)',
          lineHeight: 'var(--lh-normal)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: isAp ? 'var(--rose-500)' : 'var(--warning-500)',
            marginRight: 6,
          }}
        >
          {exception.ref}
        </span>
        {exception.description.replace(exception.ref + ':', '').replace(exception.ref, '').trim().replace(/^:\s*/, '')}
      </span>

      {/* Review link */}
      <Link
        to={reviewPath}
        style={{
          flexShrink: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--accent)',
          textDecoration: 'none',
          transition: `color var(--dur-fast) var(--ease-out)`,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
      >
        Review
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors referencing `ExceptionCallout.tsx`.

---

## Task 3: Dashboard screen

**Files:**
- Replace: `src/screens/Dashboard.tsx`
- Consumes:
  - `buildLedger()` from `../data/reconcile` — returns `{ ap, ar, exceptions, kpis, activity }`
  - `StatCard` from `../ds` — props: `label`, `value`, `icon`, `accent?: boolean`
  - `Card` from `../ds` — props: `children`, `padding?`
  - `money`, `shortMoney`, `fmtDate` from `../lib/format`
  - `ExceptionCallout` from `../components/ExceptionCallout`
  - `DataTable` (not needed for this task — used optionally for activity rows)
  - lucide icons: `DollarSign`, `FileWarning`, `CheckCircle2`, `ArrowDownLeft`, `ArrowUpRight`, `TrendingUp`

**Interfaces:**
- Produces: default export `function Dashboard(): JSX.Element`
- The screen is self-contained — no props.

- [ ] **Step 1: Replace `src/screens/Dashboard.tsx` with the full implementation**

```tsx
import React from 'react';
import { DollarSign, FileWarning, CheckCircle2, ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { buildLedger } from '../data/reconcile';
import { StatCard, Card } from '../ds';
import { money, shortMoney, fmtDate } from '../lib/format';
import { ExceptionCallout } from '../components/ExceptionCallout';

export default function Dashboard() {
  const { exceptions, kpis, activity, ap, ar } = buildLedger();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 'var(--container-wide)', margin: '0 auto' }}>
      {/* ── Greeting header ── */}
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

      {/* ── 4-up KPI row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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

      {/* ── Two-column region ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
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

/* ── Local sub-component: CashBar ── */
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
          transition: `width var(--dur-slow) var(--ease-out)`,
        }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript build**

```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npm run build 2>&1 | tail -20
```

Expected: `✓ built in` (zero TS errors, vite build success).

- [ ] **Step 3: Run tests**

```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npx vitest run 2>&1 | tail -10
```

Expected: 23 tests pass, 0 fail.

- [ ] **Step 4: Hex-grep clean check**

```bash
grep -rnE "#[0-9a-fA-F]{3,6}" \
  "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent/src/screens/Dashboard.tsx" \
  "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent/src/components/DataTable.tsx" \
  "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent/src/components/ExceptionCallout.tsx"
```

Expected: empty output (no matches).

- [ ] **Step 5: Commit**

```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && git add src/screens/Dashboard.tsx src/components/DataTable.tsx src/components/ExceptionCallout.tsx && git commit -m "feat(dashboard): KPIs, exception queue, activity, cash position"
```

---

## Task 4: Write report

**Files:**
- Create: `.superpowers/sdd/task-7-report.md`

- [ ] **Step 1: Write the task-7 report**

Content must cover:
- Components created and their file paths
- Ledger field → UI element mapping table
- Tail of `npm run build` output
- Tail of `npx vitest run` output
- Hex-grep result (must be empty)
- Commit hash or "needs controller commit"
