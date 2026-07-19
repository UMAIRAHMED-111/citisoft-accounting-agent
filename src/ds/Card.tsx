import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  padding?: number;
  interactive?: boolean;
  elevated?: boolean;
  style?: React.CSSProperties;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Card({ children, padding = 20, interactive = false, elevated = false, style = {}, ...rest }: CardProps) {
  const [hover, setHover] = React.useState(false);
  const reduced = prefersReducedMotion();
  const base: React.CSSProperties = {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: elevated ? 'var(--shadow-md)' : 'var(--shadow-sm)',
    padding,
    transition: reduced ? 'box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)' : 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
    ...(interactive && hover ? { transform: reduced ? 'none' : 'translateY(-2px)', boxShadow: 'var(--shadow-lg)', borderColor: 'var(--border-strong)', cursor: 'pointer' } : {}),
  };
  return (
    <div
      style={{ ...base, ...style }}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      {...rest}
    >
      {children}
    </div>
  );
}
