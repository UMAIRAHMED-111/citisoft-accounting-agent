const { FeatureChip } = window.CitisoftDesignSystem_1a14bd;

function Features() {
  const items = [
    { icon: 'branch', title: 'One auditable workflow', body: 'Every request, quote, and award tracked on a single timeline your whole team can see.' },
    { icon: 'shield', title: 'Certified suppliers only', body: 'Route requests to pre-qualified, compliance-checked vendors — no cold outreach.' },
    { icon: 'zap', title: 'Instant multi-quote', body: 'Send one RFQ and collect competing quotes in parallel, ranked automatically.' },
    { icon: 'layers', title: 'Built for catalogs', body: 'Import SKUs, drawings, and tolerances. Suppliers quote against exact specs.' },
    { icon: 'lock', title: 'Enterprise controls', body: 'SSO, role-based approvals, and a full export-ready audit log on every action.' },
    { icon: 'trending', title: 'Spend intelligence', body: 'See price trends across suppliers and categories to negotiate from data.' },
  ];
  return (
    <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '92px 28px' }}>
      <div style={{ maxWidth: 640, marginBottom: 52 }}>
        <span className="cs-overline">Why Citisoft</span>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: '14px 0 14px', lineHeight: 1.1 }}>
          The sourcing stack for industrial teams
        </h2>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18.5, lineHeight: 1.55, color: 'var(--text-muted)' }}>
          Replace email threads and spreadsheets with a single system that takes a part from request to purchase order.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '38px 44px' }}>
        {items.map((it) => (
          <FeatureChip key={it.title} icon={<Icon name={it.icon} size={22} color="#fff" />} title={it.title}>{it.body}</FeatureChip>
        ))}
      </div>
    </section>
  );
}

window.Features = Features;
