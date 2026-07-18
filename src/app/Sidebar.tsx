import React, { useMemo, useState, useEffect } from 'react';
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
  compact: boolean;
}

function NavItemRow({ item, exceptionsCount, compact }: NavItemProps) {
  const [hovered, setHovered] = useState(false);

  if (compact) {
    // Icon-rail mode: icon only, with a count dot if needed
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        title={item.label}
        aria-label={item.label}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '9px 0',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          transition: 'background var(--dur) var(--ease-out)',
          background: isActive
            ? 'rgba(43,159,212,0.10)'
            : hovered
            ? 'var(--surface-sunken)'
            : 'transparent',
          color: isActive ? 'var(--accent-strong)' : 'var(--text-muted)',
        })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {({ isActive }) => (
          <>
            <span style={{
              color: isActive ? 'var(--accent-strong)' : 'var(--text-muted)',
              display: 'flex',
            }}>
              {item.icon}
            </span>
            {item.showCount && exceptionsCount > 0 && (
              <span
                aria-label={`${exceptionsCount} items`}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--rose-500)',
                  border: '1.5px solid var(--surface-card)',
                }}
              />
            )}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <NavLink
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
              background: isActive ? 'rgba(43,121,186,0.16)' : 'var(--surface-sunken)',
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

  // Compact (icon-rail) mode at narrow viewport widths
  const [compact, setCompact] = useState(() => window.innerWidth < 880);

  useEffect(() => {
    function onResize() {
      setCompact(window.innerWidth < 880);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarWidth = compact ? 64 : 232;

  return (
    <aside
      style={{
        width: sidebarWidth,
        flexShrink: 0,
        background: 'var(--surface-card)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        transition: 'width var(--dur) var(--ease-out)',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: compact ? '18px 0 14px' : '18px 20px 14px',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Logo variant="color" height={compact ? 22 : 26} style={compact ? { maxWidth: 40, objectFit: 'contain' } : {}} />
      </div>

      {/* Nav */}
      <nav
        aria-label="Main navigation"
        style={{
          padding: compact ? '6px 8px' : '6px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <NavItemRow key={item.to} item={item} exceptionsCount={exceptionsCount} compact={compact} />
        ))}
      </nav>

      {/* Bottom strip */}
      {!compact && (
        <>
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
        </>
      )}
    </aside>
  );
}
