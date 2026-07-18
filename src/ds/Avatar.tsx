import React from 'react';

const SIZES = { xs: 24, sm: 32, md: 40, lg: 52 } as const;

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  square?: boolean;
  style?: React.CSSProperties;
}

export function Avatar({ name = '', src = null, size = 'md', square = false, style = {}, ...rest }: AvatarProps) {
  const dim = SIZES[size] || SIZES.md;
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dim,
    height: dim,
    borderRadius: square ? 'var(--radius-md)' : '50%',
    overflow: 'hidden',
    flexShrink: 0,
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: dim * 0.38,
    letterSpacing: '-0.01em',
    color: 'var(--text-on-brand)',
    background: 'var(--grad-brand)',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: 'var(--shadow-xs)',
  };
  return (
    <span style={{ ...base, ...style }} title={name} {...rest}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initials(name)}
    </span>
  );
}
