import React from 'react';

const SIZES = {
  sm: { padding: '0 14px', height: 34, fontSize: 13.5, gap: 6, radius: 'var(--radius-sm)' },
  md: { padding: '0 18px', height: 42, fontSize: 15, gap: 8, radius: 'var(--radius-md)' },
  lg: { padding: '0 24px', height: 52, fontSize: 16.5, gap: 10, radius: 'var(--radius-md)' },
};

/**
 * Citisoft Button. The primary variant carries the signature 135° blue gradient.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leadingIcon = null,
  trailingIcon = null,
  accent = 'brand', // 'brand' | 'rfq'
  style = {},
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const gradient = accent === 'rfq' ? 'var(--grad-rfq)' : 'var(--grad-brand)';

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans)',
    fontSize: s.fontSize,
    fontWeight: 600,
    letterSpacing: '-0.005em',
    lineHeight: 1,
    borderRadius: s.radius,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur) var(--ease-out), background var(--dur) var(--ease-out), filter var(--dur) var(--ease-out)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  const variants = {
    primary: {
      background: gradient,
      color: 'var(--text-on-brand)',
      boxShadow: 'var(--shadow-brand)',
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-xs)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--accent-strong)',
    },
    danger: {
      background: 'var(--rose-500)',
      color: '#fff',
      boxShadow: '0 6px 18px rgba(214,57,79,0.28)',
    },
  };

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  let dyn = {};
  if (!disabled) {
    if (variant === 'primary') {
      dyn = { background: hover ? 'var(--grad-brand-hover)' : gradient, filter: hover && accent === 'rfq' ? 'brightness(1.08)' : 'none', transform: active ? 'translateY(1px)' : hover ? 'translateY(-1px)' : 'none' };
    } else if (variant === 'secondary') {
      dyn = { background: hover ? 'var(--surface-sunken)' : 'var(--surface-card)', transform: active ? 'translateY(1px)' : 'none' };
    } else if (variant === 'ghost') {
      dyn = { background: hover ? 'var(--surface-brand-tint)' : 'transparent', transform: active ? 'translateY(1px)' : 'none' };
    } else if (variant === 'danger') {
      dyn = { background: hover ? 'var(--rose-600)' : 'var(--rose-500)', transform: active ? 'translateY(1px)' : hover ? 'translateY(-1px)' : 'none' };
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...dyn, ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
    >
      {leadingIcon && <span style={{ display: 'inline-flex' }}>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span style={{ display: 'inline-flex' }}>{trailingIcon}</span>}
    </button>
  );
}
