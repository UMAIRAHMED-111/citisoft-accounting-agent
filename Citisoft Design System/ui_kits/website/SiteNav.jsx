const { Logo, Button } = window.CitisoftDesignSystem_1a14bd;

function SiteNav({ onStart }) {
  const [open, setOpen] = React.useState(false);
  const links = ['Products', 'Solutions', 'Insights', 'Pricing', 'Company'];
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '0 28px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Logo height={28} basePath="../../assets" />
          <nav style={{ display: 'flex', gap: 4 }} className="cs-navlinks">
            {links.map((l) => (
              <a key={l} href="#" style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 500, color: 'var(--text-body)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; e.currentTarget.style.color = 'var(--text-strong)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-body)'; }}>{l}</a>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="#" style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: 'var(--text-strong)', textDecoration: 'none', padding: '0 8px' }}>Sign in</a>
          <Button size="sm" onClick={onStart}>Start an RFQ</Button>
        </div>
      </div>
    </header>
  );
}

window.SiteNav = SiteNav;
