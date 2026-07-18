import React from 'react';

const TONES = {
  brand:   { bg: 'var(--blue-050)', fg: 'var(--blue-deep)', bd: 'rgba(43,121,186,0.22)' },
  neutral: { bg: 'var(--slate-100)', fg: 'var(--slate-700)', bd: 'var(--border-default)' },
  success: { bg: 'var(--success-050)', fg: 'var(--success-500)', bd: 'rgba(31,157,107,0.25)' },
  warning: { bg: 'var(--warning-050)', fg: '#a96a12', bd: 'rgba(214,138,30,0.3)' },
  error:   { bg: 'var(--rose-050)', fg: 'var(--rose-600)', bd: 'rgba(214,57,79,0.25)' },
  rfq:     { bg: 'rgba(138,62,93,0.10)', fg: 'var(--rfq-to)', bd: 'rgba(138,62,93,0.25)' },
};

/** Status badge / pill label. Solid or subtle, with optional leading dot. */
export function Badge({ children, tone = 'neutral', solid = false, dot = false, style = {}, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 22,
    padding: '0 9px',
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    letterSpacing: '0.005em',
    whiteSpace: 'nowrap',
  };
  const skin = solid
    ? { background: t.fg, color: '#fff' }
    : { background: t.bg, color: t.fg, border: `1px solid ${t.bd}` };

  return (
    <span style={{ ...base, ...skin, ...style }} {...rest}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: solid ? '#fff' : t.fg }} />}
      {children}
    </span>
  );
}
