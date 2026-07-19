import React from 'react';

export interface FeatureChipProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  accent?: 'brand' | 'rfq';
  style?: React.CSSProperties;
}

export function FeatureChip({ icon, title, children, accent = 'brand', style = {}, ...rest }: FeatureChipProps) {
  const grad = accent === 'rfq' ? 'var(--grad-rfq)' : 'var(--grad-brand)';
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', ...style }} {...rest}>
      <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: grad, color: 'var(--text-on-brand)', boxShadow: 'var(--shadow-brand)' }}>{icon}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 16.5, fontWeight: 700, color: 'var(--text-strong)', margin: 0, letterSpacing: '-0.01em' }}>{title}</h4>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-muted)', margin: 0 }}>{children}</p>
      </div>
    </div>
  );
}
