import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta?: React.ReactNode;
}

export function EmptyState({ icon, title, body, cta }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-13) var(--space-8)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--surface-brand-tint)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent)',
        marginBottom: 'var(--space-6)',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-h4)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        marginBottom: 'var(--space-3)',
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-body-sm)',
        color: 'var(--text-muted)',
        maxWidth: 360,
        lineHeight: 'var(--lh-relaxed)',
        marginBottom: cta ? 'var(--space-7)' : 0,
      }}>
        {body}
      </p>
      {cta}
    </div>
  );
}
