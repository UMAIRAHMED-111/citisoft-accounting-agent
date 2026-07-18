const { Card, Badge, Button, Avatar, Tag } = window.CitisoftDesignSystem_1a14bd;

function RfqDetail({ rfq, onBack, onAward }) {
  const r = rfq || RFQ_DATA[0];
  const [awarded, setAwarded] = React.useState(null);

  const award = (sup) => { setAwarded(sup); onAward && onAward(sup); };

  return (
    <div style={{ padding: '22px 28px', maxWidth: 1180, margin: '0 auto' }}>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0', marginBottom: 14 }}>
        <RIcon name="arrowLeft" size={16} color="var(--text-muted)" /> Back to RFQs
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--rfq-to)', fontWeight: 600 }}>{r.id}</span>
            <Badge tone={STATUS_TONE[r.status]} dot={r.status === 'awarded' || !!awarded}>{awarded ? 'Awarded' : r.sLabel}</Badge>
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: 0 }}>{r.part}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" size="sm" leadingIcon={<RIcon name="download" size={16} />}>Export</Button>
          <Button accent="rfq" size="sm">Message suppliers</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        {/* Quote comparison */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '15px 18px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', margin: 0 }}>Quotes ({RFQ_QUOTES.length})</h3>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--text-faint)' }}>Ranked by price &amp; lead time</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
            <thead>
              <tr style={{ background: 'var(--surface-page)' }}>
                {['Supplier', 'Rating', 'Price', 'Lead time', 'Terms', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 2 || i === 3 ? 'right' : 'left', padding: '9px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-faint)', borderBottom: '1px solid var(--border-default)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RFQ_QUOTES.map((q) => {
                const isAwarded = awarded === q.sup;
                const highlight = isAwarded || (!awarded && q.best);
                return (
                  <tr key={q.sup} style={{ borderBottom: '1px solid var(--border-subtle)', background: highlight ? 'rgba(168,70,111,0.06)' : 'transparent' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={q.sup} size="xs" square />
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{q.sup}</span>
                        {highlight && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: 'var(--rfq-to)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '2px 6px', background: 'rgba(168,70,111,0.12)', borderRadius: 'var(--radius-pill)' }}>{isAwarded ? 'Awarded' : 'Best'}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}><RIcon name="star" size={13} color="var(--warning-500)" />{q.rating}</span></td>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-strong)', textAlign: 'right' }}>{q.price}</td>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)', textAlign: 'right' }}>{q.lead}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{q.terms}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                      {awarded ? (isAwarded ? <RIcon name="check" size={18} color="var(--success-500)" /> : null)
                        : <Button accent="rfq" size="sm" onClick={() => award(q.sup)}>Award</Button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Spec sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-faint)', margin: '0 0 12px' }}>Specification</h4>
            {[['Category', r.cat], ['Quantity', r.qty], ['Need-by', r.due], ['Incoterm', 'DAP — Houston, TX'], ['Material cert', 'EN 10204 3.1']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag icon={<RIcon name="paperclip" size={13} />}>drawing-v3.pdf</Tag>
              <Tag icon={<RIcon name="box" size={13} />}>spec.xlsx</Tag>
            </div>
          </Card>
          <Card>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-faint)', margin: '0 0 12px' }}>Activity</h4>
            {[['Quote received', 'Acme Steel · 2h ago'], ['Quote received', 'Northgate · 5h ago'], ['RFQ published', 'You · yesterday']].map(([t, s], i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--rfq-accent)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{t}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-faint)' }}>{s}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

window.RfqDetail = RfqDetail;
