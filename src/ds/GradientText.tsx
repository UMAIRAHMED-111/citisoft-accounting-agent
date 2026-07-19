import React from 'react';

export interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  accent?: 'brand' | 'rfq';
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

export function GradientText({ children, accent = 'brand', as = 'span', style = {}, ...rest }: GradientTextProps) {
  const grad = accent === 'rfq' ? 'var(--grad-rfq)' : 'var(--grad-brand)';
  const Tag = as as React.ElementType;
  return (
    <Tag
      style={{
        background: grad,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
