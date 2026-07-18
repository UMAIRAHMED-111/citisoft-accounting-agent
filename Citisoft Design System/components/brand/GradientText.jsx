import React from 'react';

/** Renders its text with the signature 135° brand gradient as the fill. */
export function GradientText({ children, accent = 'brand', as = 'span', style = {}, ...rest }) {
  const grad = accent === 'rfq' ? 'var(--grad-rfq)' : 'var(--grad-brand)';
  const Tag = as;
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
