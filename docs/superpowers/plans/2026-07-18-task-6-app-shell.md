# Task 6: App Shell — Sidebar, Topbar, Router Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete app shell (sidebar + topbar + router + 8 placeholder screens) as the structural frame every screen renders inside, matching Citisoft brand standards.

**Architecture:** AppShell is a fixed-layout wrapper (sidebar 232px + topbar 62px) that uses react-router-dom v6 nested routes and renders `<Outlet/>` in the main content area. App.tsx mounts AppShell wrapped in AgentProviderComponent, with all 8 routes nested inside. Nav items use NavLink for active-state styling; exception counts are read live from `buildLedger().kpis.exceptionsCount`.

**Tech Stack:** React 18, TypeScript, Vite, react-router-dom v6, lucide-react, Citisoft DS tokens (var(--...) only, no raw hex/px colors in components).

## Global Constraints

- NO raw hex colors in component files — only `var(--...)` tokens or inline rgba() with brand-defined values (the active tint `rgba(43,159,212,0.10)` is spec-mandated, acceptable)
- NO raw px color values — use token variables
- Sidebar width: exactly 232px; topbar height: exactly 62px
- Both sidebar and topbar background: `var(--surface-card)`; separators: `var(--border-default)`
- Active nav: bg `rgba(43,159,212,0.10)`, text/icon `var(--accent-strong)` — NOT magenta
- Sentence case everywhere; no emoji
- Motion: `var(--dur)` / `var(--ease-out)`
- Imports from `src/ds` via barrel `src/ds/index.ts`
- Icons from `lucide-react`
- Logo: `<Logo variant="color" />` on the light sidebar
- Exception count pill: mono font, sourced from `buildLedger().kpis.exceptionsCount`
- `AgentProviderComponent` wraps the shell in App.tsx so `useAgent()` resolves inside any route
- All 8 screen files are PLACEHOLDERS only — PageHeader + EmptyState, no real content
- Build gate: `npm run build` passes with zero TS errors; `npx vitest run` stays green (23 tests)
- Hex grep: `grep -rnE "#[0-9a-fA-F]{3,6}" src/app src/components` returns nothing

---

## File Structure

**Create:**
- `src/app/AppShell.tsx` — layout wrapper: sidebar + topbar + `<Outlet/>`
- `src/app/Sidebar.tsx` — nav list with NavLink items, Logo, exception count pills
- `src/app/Topbar.tsx` — search input, ERP chip, notifications, user block
- `src/app/routes.tsx` — route definitions array, `<Routes>` tree
- `src/components/PageHeader.tsx` — reusable `{title, subtitle?, actions?}` header
- `src/components/EmptyState.tsx` — reusable `{icon, title, body, cta?}` empty state
- `src/screens/Dashboard.tsx` — placeholder
- `src/screens/InvoiceInbox.tsx` — placeholder
- `src/screens/PoMatching.tsx` — placeholder
- `src/screens/BankUpload.tsx` — placeholder
- `src/screens/ArMatching.tsx` — placeholder
- `src/screens/Reminders.tsx` — placeholder
- `src/screens/AgentChat.tsx` — placeholder
- `src/screens/ErpConnections.tsx` — placeholder

**Modify:**
- `src/App.tsx` — replace Specimen import with AppShell + AgentProviderComponent + Routes

---

### Task 1: Shared Components — PageHeader and EmptyState

**Files:**
- Create: `src/components/PageHeader.tsx`
- Create: `src/components/EmptyState.tsx`

**Interfaces:**
- Produces:
  - `PageHeader({ title: string; subtitle?: string; actions?: React.ReactNode }): JSX.Element`
  - `EmptyState({ icon: React.ReactNode; title: string; body: string; cta?: React.ReactNode }): JSX.Element`

- [ ] **Step 1: Create PageHeader component**

```typescript
// src/components/PageHeader.tsx
import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      marginBottom: 'var(--space-8)',
    }}>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-h2)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)',
          letterSpacing: 'var(--ls-snug)',
          lineHeight: 'var(--lh-snug)',
          margin: 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--text-muted)',
            marginTop: 'var(--space-2)',
            lineHeight: 'var(--lh-normal)',
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create EmptyState component**

```typescript
// src/components/EmptyState.tsx
import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta?: React.ReactNode;
}

export function EmptyState({ icon, title, body, cta }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-13) var(--space-8)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--surface-brand-tint)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent)',
        marginBottom: 'var(--space-6)',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-h4)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        marginBottom: 'var(--space-3)',
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-body-sm)',
        color: 'var(--text-muted)',
        maxWidth: 360,
        lineHeight: 'var(--lh-relaxed)',
        marginBottom: cta ? 'var(--space-7)' : 0,
      }}>
        {body}
      </p>
      {cta}
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles for these files**

Run: `cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npx tsc --noEmit 2>&1 | head -30`

Expected: no errors referencing PageHeader or EmptyState

---

### Task 2: Placeholder Screen Files (8 routes)

**Files:**
- Create: `src/screens/Dashboard.tsx`
- Create: `src/screens/InvoiceInbox.tsx`
- Create: `src/screens/PoMatching.tsx`
- Create: `src/screens/BankUpload.tsx`
- Create: `src/screens/ArMatching.tsx`
- Create: `src/screens/Reminders.tsx`
- Create: `src/screens/AgentChat.tsx`
- Create: `src/screens/ErpConnections.tsx`

**Interfaces:**
- Consumes: `PageHeader` from `../components/PageHeader`, `EmptyState` from `../components/EmptyState`
- Produces: default-exported React components, one per route, rendering placeholder content

- [ ] **Step 1: Create Dashboard screen**

```typescript
// src/screens/Dashboard.tsx
import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your AP/AR reconciliation status"
      />
      <EmptyState
        icon={<LayoutGrid size={28} />}
        title="Dashboard coming soon"
        body="KPI cards, exception counts, and recent activity will appear here."
      />
    </div>
  );
}
```

- [ ] **Step 2: Create InvoiceInbox screen**

```typescript
// src/screens/InvoiceInbox.tsx
import React from 'react';
import { Inbox } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function InvoiceInbox() {
  return (
    <div>
      <PageHeader
        title="Invoice inbox"
        subtitle="Review and process incoming AP invoices"
      />
      <EmptyState
        icon={<Inbox size={28} />}
        title="Invoice inbox coming soon"
        body="Incoming vendor invoices awaiting review and PO matching will appear here."
      />
    </div>
  );
}
```

- [ ] **Step 3: Create PoMatching screen**

```typescript
// src/screens/PoMatching.tsx
import React from 'react';
import { GitCompareArrows } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function PoMatching() {
  return (
    <div>
      <PageHeader
        title="PO matching"
        subtitle="Match AP invoices to purchase orders"
      />
      <EmptyState
        icon={<GitCompareArrows size={28} />}
        title="PO matching coming soon"
        body="Automated and manual AP invoice-to-PO matching will be available here."
      />
    </div>
  );
}
```

- [ ] **Step 4: Create BankUpload screen**

```typescript
// src/screens/BankUpload.tsx
import React from 'react';
import { Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function BankUpload() {
  return (
    <div>
      <PageHeader
        title="Bank upload"
        subtitle="Import bank statements for reconciliation"
      />
      <EmptyState
        icon={<Upload size={28} />}
        title="Bank upload coming soon"
        body="Upload CSV or OFX bank statements to match against AR invoices."
      />
    </div>
  );
}
```

- [ ] **Step 5: Create ArMatching screen**

```typescript
// src/screens/ArMatching.tsx
import React from 'react';
import { ListChecks } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function ArMatching() {
  return (
    <div>
      <PageHeader
        title="AR matching"
        subtitle="Match customer payments to outstanding invoices"
      />
      <EmptyState
        icon={<ListChecks size={28} />}
        title="AR matching coming soon"
        body="Customer payment-to-invoice reconciliation and exception handling will appear here."
      />
    </div>
  );
}
```

- [ ] **Step 6: Create Reminders screen**

```typescript
// src/screens/Reminders.tsx
import React from 'react';
import { BellRing } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function Reminders() {
  return (
    <div>
      <PageHeader
        title="Reminders"
        subtitle="Automated payment reminders and follow-ups"
      />
      <EmptyState
        icon={<BellRing size={28} />}
        title="Reminders coming soon"
        body="Scheduled payment reminders and overdue invoice alerts will be configured here."
      />
    </div>
  );
}
```

- [ ] **Step 7: Create AgentChat screen**

```typescript
// src/screens/AgentChat.tsx
import React from 'react';
import { Bot } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function AgentChat() {
  return (
    <div>
      <PageHeader
        title="Agent"
        subtitle="AI-powered reconciliation assistant"
      />
      <EmptyState
        icon={<Bot size={28} />}
        title="Agent chat coming soon"
        body="Ask the AI agent to find exceptions, explain mismatches, and suggest actions."
      />
    </div>
  );
}
```

- [ ] **Step 8: Create ErpConnections screen**

```typescript
// src/screens/ErpConnections.tsx
import React from 'react';
import { Plug } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function ErpConnections() {
  return (
    <div>
      <PageHeader
        title="Connections"
        subtitle="Manage ERP and accounting system integrations"
      />
      <EmptyState
        icon={<Plug size={28} />}
        title="Connections coming soon"
        body="Connect Xero, QuickBooks, Sage, and other accounting systems here."
      />
    </div>
  );
}
```

- [ ] **Step 9: Verify TS compiles for all screens**

Run: `cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npx tsc --noEmit 2>&1 | head -30`

Expected: no errors

---

### Task 3: Sidebar Component

**Files:**
- Create: `src/app/Sidebar.tsx`

**Interfaces:**
- Consumes: `Logo` from `../ds`, `buildLedger` from `../data/reconcile`, `NavLink` from `react-router-dom`
- Produces: `Sidebar(): JSX.Element` — sidebar nav with Logo, NavLink items, exception count pills

- [ ] **Step 1: Create Sidebar component**

```typescript
// src/app/Sidebar.tsx
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Inbox,
  GitCompareArrows,
  Upload,
  ListChecks,
  BellRing,
  Bot,
  Plug,
} from 'lucide-react';
import { Logo } from '../ds';
import { buildLedger } from '../data/reconcile';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  showCount?: boolean;
}

export function Sidebar() {
  const ledger = useMemo(() => buildLedger(), []);
  const exceptionsCount = ledger.kpis.exceptionsCount;

  const navItems: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { to: '/inbox', label: 'Invoice inbox', icon: <Inbox size={18} />, showCount: true },
    { to: '/po-matching', label: 'PO matching', icon: <GitCompareArrows size={18} /> },
    { to: '/bank-upload', label: 'Bank upload', icon: <Upload size={18} /> },
    { to: '/ar-matching', label: 'AR matching', icon: <ListChecks size={18} />, showCount: true },
    { to: '/reminders', label: 'Reminders', icon: <BellRing size={18} /> },
    { to: '/agent', label: 'Agent', icon: <Bot size={18} /> },
    { to: '/connections', label: 'Connections', icon: <Plug size={18} /> },
  ];

  return (
    <aside style={{
      width: 232,
      flexShrink: 0,
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 20px 14px', flexShrink: 0 }}>
        <Logo variant="color" height={26} />
      </div>

      {/* Nav */}
      <nav style={{
        padding: '6px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        overflowY: 'auto',
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'background var(--dur) var(--ease-out)',
              background: isActive ? 'rgba(43,159,212,0.10)' : 'transparent',
              color: isActive ? 'var(--accent-strong)' : 'var(--text-body)',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains('active')) {
                el.style.background = 'var(--surface-sunken)';
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains('active')) {
                el.style.background = 'transparent';
              }
            }}
          >
            {({ isActive }) => (
              <>
                <span style={{ color: isActive ? 'var(--accent-strong)' : 'var(--text-muted)', flexShrink: 0, display: 'flex' }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.showCount && exceptionsCount > 0 && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '1px 7px',
                    borderRadius: 'var(--radius-pill)',
                    background: isActive ? 'rgba(43,159,212,0.16)' : 'var(--surface-sunken)',
                    color: isActive ? 'var(--accent-strong)' : 'var(--text-muted)',
                    lineHeight: '18px',
                    flexShrink: 0,
                  }}>
                    {exceptionsCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom divider */}
      <div style={{ height: 1, background: 'var(--border-subtle)', flexShrink: 0 }} />
      <div style={{ padding: 'var(--space-4)', flexShrink: 0 }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          color: 'var(--text-faint)',
          textAlign: 'center',
          margin: 0,
        }}>
          Citisoft AP/AR
        </p>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Verify NavLink render prop type compiles**

Run: `cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npx tsc --noEmit 2>&1 | head -30`

Expected: no errors

---

### Task 4: Topbar Component

**Files:**
- Create: `src/app/Topbar.tsx`

**Interfaces:**
- Consumes: `Avatar`, `IconButton` from `../ds`, `Bell`, `Search` from `lucide-react`
- Produces: `Topbar(): JSX.Element` — search, ERP chip, notifications, user block

- [ ] **Step 1: Create Topbar component**

```typescript
// src/app/Topbar.tsx
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar, IconButton } from '../ds';

export function Topbar() {
  return (
    <header style={{
      height: 62,
      flexShrink: 0,
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      padding: '0 22px',
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
        <span style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--text-faint)',
          display: 'flex',
        }}>
          <Search size={16} />
        </span>
        <input
          placeholder="Search invoices, payments, vendors…"
          style={{
            width: '100%',
            height: 38,
            padding: '0 12px 0 36px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--surface-page)',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: 'var(--text-strong)',
            outline: 'none',
            transition: 'border-color var(--dur) var(--ease-out)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--border-brand)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
        />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* ERP status chip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 12px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-sunken)',
        border: '1px solid var(--border-subtle)',
      }}>
        <span style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'var(--success-500)',
          flexShrink: 0,
          display: 'inline-block',
        }} />
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-body)',
        }}>
          Xero · Connected
        </span>
      </div>

      {/* Notifications */}
      <IconButton
        icon={<Bell size={18} />}
        label="Notifications"
        variant="ghost"
        size="sm"
      />

      {/* User block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4 }}>
        <Avatar name="Amara Okafor" size="sm" />
        <div style={{ lineHeight: 1.25 }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-strong)',
          }}>
            Amara Okafor
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11.5,
            color: 'var(--text-faint)',
          }}>
            Financial controller
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify TS compiles**

Run: `cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npx tsc --noEmit 2>&1 | head -30`

Expected: no errors

---

### Task 5: AppShell + Routes + App.tsx wiring

**Files:**
- Create: `src/app/AppShell.tsx`
- Create: `src/app/routes.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Sidebar`, `Topbar` from local `./Sidebar`, `./Topbar`; all screen components; `AgentProviderComponent` from `../agent/AgentProvider`
- Produces: mounted app at all 8 routes, active nav reflecting current route

- [ ] **Step 1: Create AppShell layout component**

```typescript
// src/app/AppShell.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--surface-page)',
    }}>
      <Sidebar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}>
        <Topbar />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-8)',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create routes configuration**

```typescript
// src/app/routes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import Dashboard from '../screens/Dashboard';
import InvoiceInbox from '../screens/InvoiceInbox';
import PoMatching from '../screens/PoMatching';
import BankUpload from '../screens/BankUpload';
import ArMatching from '../screens/ArMatching';
import Reminders from '../screens/Reminders';
import AgentChat from '../screens/AgentChat';
import ErpConnections from '../screens/ErpConnections';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="inbox" element={<InvoiceInbox />} />
        <Route path="po-matching" element={<PoMatching />} />
        <Route path="bank-upload" element={<BankUpload />} />
        <Route path="ar-matching" element={<ArMatching />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="agent" element={<AgentChat />} />
        <Route path="connections" element={<ErpConnections />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 3: Update App.tsx**

```typescript
// src/App.tsx
import React from 'react';
import { AgentProviderComponent } from './agent/AgentProvider';
import { AppRoutes } from './app/routes';

function App() {
  return (
    <AgentProviderComponent>
      <AppRoutes />
    </AgentProviderComponent>
  );
}

export default App;
```

- [ ] **Step 4: Full build check**

Run: `cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npm run build 2>&1 | tail -20`

Expected: "✓ built in" message, zero TS errors

- [ ] **Step 5: Tests still green**

Run: `cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent" && npx vitest run 2>&1 | tail -10`

Expected: all 23 tests pass

- [ ] **Step 6: Hex color discipline check**

Run: `grep -rnE "#[0-9a-fA-F]{3,6}" "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent/src/app" "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent/src/components" 2>/dev/null`

Expected: no output (zero matches)

- [ ] **Step 7: Commit**

```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent"
git add src/app/ src/components/ src/screens/ src/App.tsx docs/
git commit -m "feat(app): app shell, sidebar, topbar, routing"
```

---

### Task 6: Write Task Report

**Files:**
- Create: `.superpowers/sdd/task-6-report.md`

- [ ] **Step 1: Write report with build/test results and hex-grep output**

The report must cover: files created, active nav state styling explanation, exception count wiring, build output tail, test output tail, hex-grep result.
