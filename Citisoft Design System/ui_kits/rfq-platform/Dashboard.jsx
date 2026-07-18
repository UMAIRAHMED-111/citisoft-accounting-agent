const { StatCard, Card, Badge, Tabs, Tag } = window.CitisoftDesignSystem_1a14bd;

function Dashboard({ onOpenRfq, onNew }) {
  const [tab, setTab] = React.useState('open');
  const rows = RFQ_DATA.filter((r) => {
    if (tab === 'all') return true;
    if (tab === 'open') return r.status === 'open' || r.status === 'reviewing';
    if (tab === 'awarded') return r.status === 'awarded';
    if (tab === 'draft') return r.status === 'draft';
    return true;
  });
  const counts = {
    open: RFQ_DATA.filter((r) => r.status === 'open' || r.status === 'reviewing').length,
    awarded: RFQ_DATA.filter((r) => r.status === 'awarded').length,
    draft: RFQ_DATA.filter((r) => r.status === 'draft').length,
  };

  return (
    <div style={{ padding: '26px 28px', maxWidth: 1180, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 27, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: 0 }}>Good morning, Dana</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--text-muted)', margin: '5px 0 0' }}>You have <strong style={{ color: 'var(--rfq-to)' }}>4 RFQs</strong> awaiting your review.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 26 }}>
        <StatCard label="Open RFQs" value="27" delta="3 vs last week" icon={<RIcon name="file" size={18} color="#fff" />} accent />
        <StatCard label="Avg. turnaround" value="4.2" unit="hrs" delta="38% faster" deltaDir="up" icon={<RIcon name="clock" size={18} />} />
        <StatCard label="Award rate" value="92" unit="%" delta="5 pts" icon={<RIcon name="check" size={18} />} />
        <StatCard label="Sourced YTD" value="$3.1" unit="M" delta="On budget" icon={<RIcon name="dollar" size={18} />} />
      </div>

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 0' }}>
          <Tabs value={tab} onChange={setTab} tabs={[
            { value: 'open', label: 'Active', count: counts.open },
            { value: 'awarded', label: 'Awarded', count: counts.awarded },
            { value: 'draft', label: 'Drafts', count: counts.draft },
            { value: 'all', label: 'All' },
          ]} style={{ border: 'none' }} />
          <div style={{ display: 'flex', gap: 8, paddingBottom: 10 }}>
            <Tag icon={<RIcon name="filter" size={14} />}>Filter</Tag>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-default)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
            <thead>
              <tr style={{ background: 'var(--surface-page)' }}>
                {['RFQ', 'Part', 'Category', 'Qty', 'Quotes', 'Best price', 'Status', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: i >= 3 && i <= 5 ? 'right' : 'left', padding: '10px 16px', fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-faint)', borderBottom: '1px solid var(--border-default)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => onOpenRfq(r)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--dur) var(--ease-out)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-page)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--rfq-to)', fontWeight: 600 }}>{r.id}</td>
                  <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{r.part}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13.5, color: 'var(--text-muted)' }}>{r.cat}</td>
                  <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)', textAlign: 'right' }}>{r.qty}</td>
                  <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)', textAlign: 'right' }}>{r.quotes || '—'}</td>
                  <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', textAlign: 'right' }}>{r.best}</td>
                  <td style={{ padding: '13px 16px' }}><Badge tone={STATUS_TONE[r.status]} dot={r.status === 'awarded'}>{r.sLabel}</Badge></td>
                  <td style={{ padding: '13px 16px', textAlign: 'right' }}><RIcon name="arrowRight" size={16} color="var(--text-faint)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

window.Dashboard = Dashboard;
