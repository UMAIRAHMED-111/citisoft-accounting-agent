const { Button, Logo } = window.CitisoftDesignSystem_1a14bd;

function CTASection({ onStart }) {
  return (
    <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 28px 92px' }}>
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--grad-brand)', borderRadius: 'var(--radius-2xl)', padding: '64px 56px', textAlign: 'center', boxShadow: 'var(--shadow-brand)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.10) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.10) 1px,transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse 70% 100% at 50% 0%, #000, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 70% 100% at 50% 0%, #000, transparent)' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 42, fontWeight: 800, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 14px', lineHeight: 1.08 }}>
            Send your first RFQ today
          </h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 19, color: 'rgba(255,255,255,0.9)', margin: '0 auto 30px', maxWidth: 520, lineHeight: 1.5 }}>
            Set up in minutes. No supplier outreach, no spreadsheets — just quotes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button size="lg" variant="secondary" onClick={onStart} style={{ background: '#fff', color: 'var(--blue-deep)', borderColor: '#fff' }}>Start an RFQ</Button>
            <Button size="lg" variant="ghost" style={{ color: '#fff', background: 'rgba(255,255,255,0.12)' }}>Book a demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const cols = [
    { h: 'Product', links: ['RFQ Platform', 'Supplier Network', 'Spend Insights', 'Logistics', 'Pricing'] },
    { h: 'Solutions', links: ['Manufacturing', 'Energy', 'Construction', 'Public sector'] },
    { h: 'Resources', links: ['Insights', 'Guides', 'Benchmark report', 'Help center', 'API docs'] },
    { h: 'Company', links: ['About', 'Careers', 'Security', 'Contact'] },
  ];
  return (
    <footer data-theme="dark" style={{ background: 'var(--slate-900)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '60px 28px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: 36 }}>
          <div>
            <Logo variant="white" height={28} basePath="../../assets" />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, lineHeight: 1.6, color: '#8b97a6', margin: '16px 0 0', maxWidth: 260 }}>
              The sourcing platform for industrial teams — from request to award on one auditable workflow.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#66707e', marginBottom: 14 }}>{c.h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.links.map((l) => (
                  <li key={l}><a href="#" style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: '#c8d0db', textDecoration: 'none' }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: '#66707e' }}>© 2026 Citisoft Solutions, Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Security', 'Status'].map((l) => (
              <a key={l} href="#" style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: '#8b97a6', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

window.CTASection = CTASection;
window.SiteFooter = SiteFooter;
