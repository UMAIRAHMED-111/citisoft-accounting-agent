import React from 'react';

const SIZES = { sm: 32, md: 40, lg: 48 } as const;

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  icon: React.ReactNode;
  label: string;
  variant?: 'brand' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function IconButton({
  icon,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  label,
  style = {},
  ...rest
}: IconButtonProps) {
  const dim = SIZES[size] || SIZES.md;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  // Touch-target padding — visual box stays `dim`, but the clickable area is
  // extended to at least 44px via an invisible overlay.
  const hitPad = Math.max(0, (44 - dim) / 2);

  const base: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dim,
    height: dim,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--dur) var(--ease-out)',
    transform: active ? 'translateY(1px)' : 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  const variants: Record<string, React.CSSProperties> = {
    brand: { background: 'var(--grad-brand)', color: 'var(--text-on-brand)', boxShadow: hover ? 'var(--shadow-brand)' : 'var(--shadow-sm)' },
    secondary: { background: hover ? 'var(--surface-sunken)' : 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-default)' },
    ghost: { background: hover ? 'var(--surface-brand-tint)' : 'transparent', color: 'var(--text-muted)' },
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
    >
      {hitPad > 0 && <span aria-hidden style={{ position: 'absolute', inset: -hitPad }} />}
      {icon}
    </button>
  );
}
