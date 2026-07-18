import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      marginBottom: 'var(--space-8)',
    }}>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-h2)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)',
          letterSpacing: 'var(--ls-snug)',
          lineHeight: 'var(--lh-snug)',
          margin: 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--text-muted)',
            marginTop: 'var(--space-2)',
            lineHeight: 'var(--lh-normal)',
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
