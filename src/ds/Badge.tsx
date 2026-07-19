import React from 'react';

const TONES: Record<string, { bg: string; fg: string; bd: string }> = {
  brand:   { bg: 'var(--blue-050)', fg: 'var(--blue-deep)', bd: 'rgba(43,121,186,0.22)' },
  neutral: { bg: 'var(--slate-100)', fg: 'var(--slate-700)', bd: 'var(--border-default)' },
  success: { bg: 'var(--success-050)', fg: 'var(--success-500)', bd: 'rgba(31,157,107,0.25)' },
  warning: { bg: 'var(--warning-050)', fg: 'var(--warning-600)', bd: 'rgba(214,138,30,0.3)' },
  error:   { bg: 'var(--rose-050)', fg: 'var(--rose-600)', bd: 'rgba(214,57,79,0.25)' },
  rfq:     { bg: 'rgba(138,62,93,0.10)', fg: 'var(--rfq-to)', bd: 'rgba(138,62,93,0.25)' },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  tone?: 'brand' | 'neutral' | 'success' | 'warning' | 'error' | 'rfq';
  solid?: boolean;
  dot?: boolean;
  style?: React.CSSProperties;
}

export function Badge({ children, tone = 'neutral', solid = false, dot = false, style = {}, ...rest }: BadgeProps) {
  const t = TONES[tone] || TONES.neutral;
  const base: React.CSSProperties = {
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
  const skin: React.CSSProperties = solid
    ? { background: t.fg, color: 'var(--text-on-brand)' }
    : { background: t.bg, color: t.fg, border: `1px solid ${t.bd}` };

  return (
    <span style={{ ...base, ...skin, ...style }} {...rest}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: solid ? 'var(--text-on-brand)' : t.fg }} />}
      {children}
    </span>
  );
}
