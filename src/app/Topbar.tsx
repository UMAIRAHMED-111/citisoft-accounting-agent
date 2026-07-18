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
        flexShrink: 0,
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
          whiteSpace: 'nowrap',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4, flexShrink: 0 }}>
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
