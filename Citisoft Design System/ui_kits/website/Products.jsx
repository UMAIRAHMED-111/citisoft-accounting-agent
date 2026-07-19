const { Button, Badge } = window.CitisoftDesignSystem_1a14bd;

// Dark "Products" section spotlighting the RFQ / Sales platform (magenta accent).
function Products({ onStart }) {
  return (
    <section data-theme="dark" style={{ background: 'var(--slate-900)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -180, left: -120, width: 560, height: 560, background: 'radial-gradient(circle, rgba(138,62,93,0.34), rgba(74,30,61,0) 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--container-max)', margin: '0 auto', padding: '92px 28px' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
          <span className="cs-overline" style={{ color: 'var(--rfq-accent)' }}>The Citisoft product family</span>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: '#f4f7fa', margin: '14px 0 0', lineHeight: 1.1 }}>
            Purpose-built tools, one platform
          </h2>
        </div>

        {/* Featured product: RFQ platform */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44, alignItems: 'center', background: 'linear-gradient(135deg, rgba(74,30,61,0.55), rgba(27,33,43,0.4))', border: '1px solid rgba(168,70,111,0.3)', borderRadius: 'var(--radius-2xl)', padding: 40, marginBottom: 24 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
              <span style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--grad-rfq)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="file" size={20} color="#fff" /></span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: '#fff' }}>RFQ Platform</span>
              <Badge tone="rfq" style={{ background: 'rgba(168,70,111,0.2)', color: '#e9b8cc', border: '1px solid rgba(168,70,111,0.4)' }}>Flagship</Badge>
            </div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.015em', color: '#f4f7fa', margin: '0 0 12px', lineHeight: 1.15 }}>
              Request, compare, and award quotes in one place
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.6, color: '#c8d0db', margin: '0 0 22px' }}>
              Buyers publish a spec; qualified suppliers respond with priced, dated quotes. Citisoft ranks them on price, lead time, and rating — so you award with confidence.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Parallel multi-supplier quoting', 'Auto-ranked by price & lead time', 'PO generation on award'].map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 14.5, color: '#e4e9f0' }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'rgba(168,70,111,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={13} color="#e9b8cc" /></span>{f}
                </li>
              ))}
            </ul>
            <Button accent="rfq" onClick={onStart} trailingIcon={<Icon name="arrowRight" size={17} color="#fff" />}>Explore the RFQ Platform</Button>
          </div>
          <RfqMock />
        </div>

        {/* Other products */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          <ProductCard icon="users" name="Supplier Network" body="A vetted directory of 12,400+ certified industrial suppliers." />
          <ProductCard icon="trending" name="Spend Insights" body="Category and price analytics across your sourcing history." />
          <ProductCard icon="globe" name="Logistics" body="Track shipments and lead times from award to delivery." />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ icon, name, body }) {
  const [h, setH] = React.useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: '#1b212b', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'var(--radius-lg)', padding: 22, transition: 'transform var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)', transform: h ? 'translateY(-3px)' : 'none', borderColor: h ? 'rgba(43,159,212,0.4)' : 'rgba(255,255,255,0.10)', cursor: 'pointer' }}>
      <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(43,159,212,0.14)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}><Icon name={icon} size={20} color="var(--blue-azure)" /></span>
      <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 16.5, fontWeight: 700, color: '#f4f7fa', margin: '0 0 6px' }}>{name}</h4>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, lineHeight: 1.5, color: '#8b97a6', margin: 0 }}>{body}</p>
    </div>
  );
}

function RfqMock() {
  const quotes = [
    { sup: 'Acme Steel Co.', price: '$48,250', lead: '12 days', best: true },
    { sup: 'Northgate Mfg.', price: '$51,900', lead: '9 days', best: false },
    { sup: 'Vertex Alloys', price: '$53,400', lead: '15 days', best: false },
  ];
  return (
    <div style={{ background: '#14181f', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'var(--radius-lg)', padding: 18, boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--rfq-accent)' }}>RFQ-10428</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: '#f4f7fa', marginTop: 2 }}>Flanged ball valve, 3"</div>
        </div>
        <Badge tone="rfq" style={{ background: 'rgba(168,70,111,0.2)', color: '#e9b8cc', border: '1px solid rgba(168,70,111,0.4)' }}>3 quotes</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quotes.map((q) => (
          <div key={q.sup} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', background: q.best ? 'rgba(168,70,111,0.14)' : '#1b212b', border: `1px solid ${q.best ? 'rgba(168,70,111,0.45)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 'var(--radius-md)' }}>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: '#e4e9f0' }}>{q.sup}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, color: '#f4f7fa' }}>{q.price}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#8b97a6', width: 56, textAlign: 'right' }}>{q.lead}</span>
            {q.best && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 700, color: '#e9b8cc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Best</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

window.Products = Products;
