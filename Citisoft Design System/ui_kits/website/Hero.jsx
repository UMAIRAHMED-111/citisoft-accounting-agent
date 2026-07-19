const { Button, Badge, GradientText, StatCard } = window.CitisoftDesignSystem_1a14bd;

function Hero({ onStart }) {
  return (
    <section data-theme="dark" style={{ position: 'relative', background: 'var(--slate-900)', overflow: 'hidden' }}>
      {/* gradient glow */}
      <div style={{ position: 'absolute', top: -160, right: -120, width: 620, height: 620, background: 'radial-gradient(circle, rgba(43,159,212,0.32), rgba(37,91,156,0) 62%)', filter: 'blur(8px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, #000, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, #000, transparent)' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '92px 28px 96px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
        <div>
          <span className="cs-overline" style={{ display: 'inline-block', marginBottom: 18 }}>Industrial procurement, reinvented</span>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 62, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.025em', color: '#f4f7fa', margin: 0 }}>
            Quote industrial parts in <GradientText>hours,</GradientText> not weeks.
          </h1>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.55, color: '#c8d0db', margin: '22px 0 0', maxWidth: 520 }}>
            Citisoft connects buyers and suppliers on one auditable workflow — from request to award. Send a single RFQ; we route it to every qualified supplier.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <Button size="lg" onClick={onStart}>Start an RFQ</Button>
            <Button size="lg" variant="secondary" style={{ background: 'transparent', color: '#f4f7fa', borderColor: 'rgba(255,255,255,0.22)' }}>Talk to sales</Button>
          </div>
          <div style={{ display: 'flex', gap: 26, marginTop: 40 }}>
            <Trust v="4.2 hrs" l="Avg. quote turnaround" />
            <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />
            <Trust v="12,400+" l="Qualified suppliers" />
            <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />
            <Trust v="$3.1B" l="Sourced in 2025" />
          </div>
        </div>
        <HeroPanel />
      </div>
    </section>
  );
}

function Trust({ v, l }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: '#f4f7fa', letterSpacing: '-0.02em' }}>{v}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: '#8b97a6', marginTop: 3 }}>{l}</div>
    </div>
  );
}

// A small product-UI mock floating in the hero (shows the RFQ app).
function HeroPanel() {
  const rows = [
    { id: 'RFQ-10428', part: 'Flanged ball valve, 3"', sup: '7 quotes', status: 'success', s: 'Awarded' },
    { id: 'RFQ-10427', part: 'Carbon steel plate', sup: '4 quotes', status: 'warning', s: 'Open · 2h left' },
    { id: 'RFQ-10425', part: 'Hex bolts, M12×40', sup: '9 quotes', status: 'brand', s: 'Reviewing' },
  ];
  return (
    <div style={{ background: '#1b212b', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'var(--radius-xl)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <span style={{ marginLeft: 10, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8b97a6' }}>app.citisoft.com / rfqs</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <MiniStat v="27" l="Open RFQs" />
          <MiniStat v="92%" l="Award rate" />
          <MiniStat v="4.2h" l="Turnaround" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', background: '#11151b', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--blue-azure)', width: 78 }}>{r.id}</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: '#e4e9f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.part}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#8b97a6', width: 64 }}>{r.sup}</span>
              <Badge tone={r.status} dot={r.status === 'success'}>{r.s}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ v, l }) {
  return (
    <div style={{ flex: 1, padding: '10px 12px', background: '#11151b', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 19, fontWeight: 700, color: '#f4f7fa' }}>{v}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#8b97a6', marginTop: 2 }}>{l}</div>
    </div>
  );
}

window.Hero = Hero;
