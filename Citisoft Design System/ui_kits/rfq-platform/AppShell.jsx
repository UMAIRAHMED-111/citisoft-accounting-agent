const { Logo, Avatar, IconButton, Input, Badge } = window.CitisoftDesignSystem_1a14bd;

function Sidebar({ active, onNav }) {
  const nav = [
    { id: 'dashboard', icon: 'grid', label: 'Dashboard' },
    { id: 'rfqs', icon: 'file', label: 'RFQs', count: 27 },
    { id: 'suppliers', icon: 'users', label: 'Suppliers' },
    { id: 'insights', icon: 'chart', label: 'Spend insights' },
    { id: 'logistics', icon: 'truck', label: 'Logistics' },
  ];
  return (
    <aside style={{ width: 232, flexShrink: 0, background: 'var(--surface-card)', borderRight: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '18px 20px 14px' }}>
        <Logo height={24} basePath="../../assets" />
      </div>
      <nav style={{ padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {nav.map((n) => {
          const on = active === n.id || (active === 'detail' && n.id === 'rfqs');
          return (
            <button key={n.id} onClick={() => onNav(n.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: on ? 'rgba(168,70,111,0.10)' : 'transparent',
                color: on ? 'var(--rfq-to)' : 'var(--text-body)',
                fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: on ? 600 : 500, transition: 'background var(--dur) var(--ease-out)' }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-sunken)'; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              <RIcon name={n.icon} size={18} color={on ? 'var(--rfq-to)' : 'var(--text-muted)'} />
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.count != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 'var(--radius-pill)', background: on ? 'rgba(168,70,111,0.16)' : 'var(--surface-sunken)', color: on ? 'var(--rfq-to)' : 'var(--text-muted)' }}>{n.count}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={() => onNav('settings')} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', width: '100%', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 500, color: 'var(--text-body)' }}>
          <RIcon name="settings" size={18} color="var(--text-muted)" />Settings
        </button>
      </div>
    </aside>
  );
}

function Topbar({ onNew }) {
  const { Button } = window.CitisoftDesignSystem_1a14bd;
  return (
    <header style={{ height: 62, flexShrink: 0, background: 'var(--surface-card)', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px' }}>
      <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><RIcon name="search" size={17} color="var(--text-faint)" /></span>
        <input placeholder="Search RFQs, suppliers, parts…" style={{ width: '100%', height: 40, padding: '0 12px 0 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--surface-page)', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-strong)', outline: 'none' }} />
      </div>
      <div style={{ flex: 1 }} />
      <Button accent="rfq" size="sm" onClick={onNew} leadingIcon={<RIcon name="plus" size={17} color="#fff" />}>New RFQ</Button>
      <IconButton variant="ghost" icon={<RIcon name="bell" size={19} />} label="Notifications" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 6 }}>
        <Avatar name="Dana Ruiz" size="sm" />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>Dana Ruiz</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-faint)' }}>Procurement</div>
        </div>
      </div>
    </header>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
