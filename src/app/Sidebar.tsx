import React, { useMemo, useState } from 'react';
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

interface NavItemDef {
  to: string;
  label: string;
  icon: React.ReactNode;
  showCount?: boolean;
}

const NAV_ITEMS: NavItemDef[] = [
  { to: '/', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
  { to: '/inbox', label: 'Invoice inbox', icon: <Inbox size={18} />, showCount: true },
  { to: '/po-matching', label: 'PO matching', icon: <GitCompareArrows size={18} /> },
  { to: '/bank-upload', label: 'Bank upload', icon: <Upload size={18} /> },
  { to: '/ar-matching', label: 'AR matching', icon: <ListChecks size={18} />, showCount: true },
  { to: '/reminders', label: 'Reminders', icon: <BellRing size={18} /> },
  { to: '/agent', label: 'Agent', icon: <Bot size={18} /> },
  { to: '/connections', label: 'Connections', icon: <Plug size={18} /> },
];

interface NavItemProps {
  item: NavItemDef;
  exceptionsCount: number;
}

function NavItemRow({ item, exceptionsCount }: NavItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
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
        background: isActive
          ? 'rgba(43,159,212,0.10)'
          : hovered
          ? 'var(--surface-sunken)'
          : 'transparent',
        color: isActive ? 'var(--accent-strong)' : 'var(--text-body)',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: isActive ? 600 : 500,
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {({ isActive }) => (
        <>
          <span style={{
            color: isActive ? 'var(--accent-strong)' : 'var(--text-muted)',
            flexShrink: 0,
            display: 'flex',
          }}>
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
  );
}

export function Sidebar() {
  const ledger = useMemo(() => buildLedger(), []);
  const exceptionsCount = ledger.kpis.exceptionsCount;

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
        {NAV_ITEMS.map((item) => (
          <NavItemRow key={item.to} item={item} exceptionsCount={exceptionsCount} />
        ))}
      </nav>

      {/* Bottom strip */}
      <div style={{ height: 1, background: 'var(--border-subtle)', flexShrink: 0 }} />
      <div style={{ padding: 'var(--space-4)', flexShrink: 0 }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          color: 'var(--text-faint)',
          textAlign: 'center',
          margin: 0,
          letterSpacing: 'var(--ls-wide)',
          textTransform: 'uppercase',
        }}>
          Citisoft AP/AR
        </p>
      </div>
    </aside>
  );
}
