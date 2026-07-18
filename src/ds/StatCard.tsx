import React from 'react';
import { Card } from './Card';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  unit?: string;
  delta?: React.ReactNode;
  deltaDir?: 'up' | 'down';
  icon?: React.ReactNode;
  accent?: boolean;
  style?: React.CSSProperties;
}

export function StatCard({ label, value, unit, delta, deltaDir = 'up', icon, accent = false, style = {}, ...rest }: StatCardProps) {
  const deltaColor = deltaDir === 'down' ? 'var(--rose-600)' : 'var(--success-500)';
  return (
    <Card padding={18} style={{ display: 'flex', flexDirection: 'column', gap: 10, ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        {icon && (
          <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: accent ? 'var(--grad-brand)' : 'var(--surface-brand-tint)', color: accent ? 'var(--text-on-brand)' : 'var(--accent)' }}>{icon}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>{unit}</span>}
      </div>
      {delta != null && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: deltaColor }}>
          <span>{deltaDir === 'down' ? '↓' : '↑'}</span>{delta}
        </div>
      )}
    </Card>
  );
}
