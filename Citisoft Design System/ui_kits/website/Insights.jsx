const { Tabs, Card, Badge, Button } = window.CitisoftDesignSystem_1a14bd;

const CS_INSIGHTS = {
  All: [
    { tag: 'Guide', mins: '8 min', title: 'How to write an RFQ suppliers actually quote', tone: 'brand' },
    { tag: 'Report', mins: '12 min', title: '2026 industrial sourcing benchmark', tone: 'neutral' },
    { tag: 'Story', mins: '5 min', title: 'How Northgate cut quote time 71%', tone: 'success' },
  ],
  Guides: [
    { tag: 'Guide', mins: '8 min', title: 'How to write an RFQ suppliers actually quote', tone: 'brand' },
    { tag: 'Guide', mins: '6 min', title: 'Setting supplier qualification rules', tone: 'brand' },
    { tag: 'Guide', mins: '9 min', title: 'Approvals & audit trails for procurement', tone: 'brand' },
  ],
  Reports: [
    { tag: 'Report', mins: '12 min', title: '2026 industrial sourcing benchmark', tone: 'neutral' },
    { tag: 'Report', mins: '10 min', title: 'Lead-time volatility by category', tone: 'neutral' },
    { tag: 'Report', mins: '7 min', title: 'The state of supplier diversity', tone: 'neutral' },
  ],
  Customers: [
    { tag: 'Story', mins: '5 min', title: 'How Northgate cut quote time 71%', tone: 'success' },
    { tag: 'Story', mins: '6 min', title: 'Vertex Alloys scales to 400 suppliers', tone: 'success' },
    { tag: 'Story', mins: '4 min', title: 'Why Brightline standardised on Citisoft', tone: 'success' },
  ],
};

function Insights() {
  const [tab, setTab] = React.useState('All');
  const posts = CS_INSIGHTS[tab] || CS_INSIGHTS.All;
  return (
    <section style={{ background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '88px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <span className="cs-overline">Insights</span>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: '12px 0 0' }}>
              Sharper sourcing, every week
            </h2>
          </div>
          <Button variant="ghost" trailingIcon={<Icon name="arrowRight" size={17} />}>View all</Button>
        </div>
        <div style={{ marginBottom: 28, maxWidth: 520 }}>
          <Tabs value={tab} onChange={setTab} tabs={['All', 'Guides', 'Reports', 'Customers']} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {posts.map((p) => (
            <Card key={p.title} interactive padding={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 132, background: p.tone === 'success' ? 'linear-gradient(135deg,#1f9d6b,#14181f)' : 'var(--grad-brand)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.12) 1px,transparent 1px)', backgroundSize: '26px 26px', opacity: 0.5 }} />
              </div>
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Badge tone={p.tone}>{p.tag}</Badge>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-faint)' }}>{p.mins}</span>
                </div>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--text-strong)', margin: 0 }}>{p.title}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Insights = Insights;
